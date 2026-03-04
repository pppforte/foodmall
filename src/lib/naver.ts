import { getSettings } from '@/lib/settings';

interface NaverBlogItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string; // "20240823" format
}

interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverBlogItem[];
}

export async function searchNaverBlog(
  query: string,
  display = 100,
  start = 1,
  sort: 'sim' | 'date' = 'date'
): Promise<{ items: NaverBlogItem[]; total: number }> {
  const settings = await getSettings();
  const clientId = settings.naverClientId || process.env.NAVER_CLIENT_ID;
  const clientSecret = settings.naverClientSecret || process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('네이버 API 키가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    query,
    display: String(display),
    start: String(start),
    sort,
  });

  const res = await fetch(
    `https://openapi.naver.com/v1/search/blog.json?${params}`,
    {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`네이버 API 오류: ${res.status} ${error}`);
  }

  const data: NaverSearchResponse = await res.json();
  return { items: data.items, total: data.total };
}

// Paginated full collection: fetches up to maxItems (capped at 1000 by Naver API)
export async function searchNaverBlogAll(
  query: string,
  maxItems = 1000,
  sort: 'sim' | 'date' = 'date'
): Promise<{ items: NaverBlogItem[]; total: number }> {
  const allItems: NaverBlogItem[] = [];
  let total = 0;
  const pageSize = 100;
  const cap = Math.min(maxItems, 1000);

  for (let start = 1; start <= cap; start += pageSize) {
    const result = await searchNaverBlog(query, pageSize, start, sort);
    total = result.total;
    allItems.push(...result.items);

    if (result.items.length < pageSize || start + pageSize > total) {
      break;
    }
  }

  return { items: allItems, total };
}

export function parseNaverDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}
