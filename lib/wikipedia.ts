const RATE_LIMIT = 1000; // 1 second
let lastCallTime = 0;

interface WikipediaSearchResponse {
  query: {
    search: {
      title: string;
      snippet: string;
      pageid: number;
    }[];
  };
}

interface WikipediaContentResponse {
  title: string;
  extract: string;
  type?: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

async function checkRateLimit() {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < RATE_LIMIT) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT - timeSinceLastCall));
  }
  lastCallTime = Date.now();
}

async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
}

async function isDisambiguationPage(title: string): Promise<boolean> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(url);
  if (!response.ok) return false;

  const data = (await response.json()) as WikipediaContentResponse;
  if (data.type === 'disambiguation') return true;
  return data.description?.toLowerCase().includes('disambiguation') ?? false;
}

export async function searchWikipedia(query: string) {
  await checkRateLimit();

  // First try with the exact query
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  const response = await fetch(searchUrl);
  if (!response.ok) throw new Error('Search failed');

  const data = (await response.json()) as WikipediaSearchResponse;
  if (!data.query?.search?.length) {
    throw new Error('No matching Wikipedia article found');
  }

  // Try each result until we find one that's not a disambiguation page
  for (const result of data.query.search) {
    const isDisambiguation = await isDisambiguationPage(result.title);
    if (!isDisambiguation) {
      return result.title;
    }
  }

  // If all results were disambiguation pages, try searching with species-specific terms
  const speciesTerms = ['species', 'animal', 'plant', 'organism'];
  for (const term of speciesTerms) {
    const specificSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' ' + term)}&format=json&origin=*`;
    const specificResponse = await fetch(specificSearchUrl);
    if (!specificResponse.ok) continue;

    const specificData = (await specificResponse.json()) as WikipediaSearchResponse;
    if (!specificData.query?.search?.length) continue;

    const result = specificData.query.search[0];
    if (!result) continue;

    const isDisambiguation = await isDisambiguationPage(result.title);
    if (!isDisambiguation) {
      return result.title;
    }
  }

  throw new Error('Could not find a specific article. Try adding more specific terms to your search.');
}

export async function getWikipediaContent(title: string) {
  await checkRateLimit();

  const contentUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(contentUrl);
  if (!response.ok) throw new Error('Failed to fetch article content');

  const data = (await response.json()) as WikipediaContentResponse;
  const image = data.thumbnail?.source;

  if (image) {
    const isValidImage = await validateImageUrl(image);
    if (!isValidImage) {
      throw new Error('Invalid or unsupported image format');
    }
  }

  return {
    description: data.extract,
    image: image ?? undefined
  };
}
