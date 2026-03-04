import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { verifyAuth } from '@/lib/auth';
import { searchNaverBlog, searchNaverBlogAll, parseNaverDate } from '@/lib/naver';

export async function POST(request: NextRequest) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const keyword = body.keyword || '완뚝순두부';
    const fullCollect = body.fullCollect === true;

    let items;
    let total;

    if (fullCollect) {
      // Full collection: paginate through up to 1000 results
      const result = await searchNaverBlogAll(keyword, 1000);
      items = result.items;
      total = result.total;
    } else {
      // Quick collection: latest 100 only
      const result = await searchNaverBlog(keyword, 100);
      items = result.items;
      total = result.total;
    }

    let newCount = 0;
    let skipCount = 0;
    let filteredCount = 0;

    for (const item of items) {
      const cleanTitle = item.title.replace(/<[^>]*>/g, '');
      const cleanDesc = item.description.replace(/<[^>]*>/g, '');

      // Strict keyword filter: title or description must contain the exact keyword
      if (!cleanTitle.includes(keyword) && !cleanDesc.includes(keyword)) {
        filteredCount++;
        continue;
      }

      const exists = await BlogPost.findOne({ link: item.link });
      if (exists) {
        skipCount++;
        continue;
      }

      await BlogPost.create({
        title: cleanTitle,
        description: cleanDesc,
        link: item.link,
        bloggerName: item.bloggername,
        source: 'naver',
        isActive: true,
        publishedAt: parseNaverDate(item.postdate),
      });
      newCount++;
    }

    return NextResponse.json({
      success: true,
      data: {
        keyword,
        totalFound: total,
        fetched: items.length,
        filtered: filteredCount,
        newlyAdded: newCount,
        skipped: skipCount,
        mode: fullCollect ? 'full' : 'quick',
      },
    });
  } catch (error) {
    console.error('Blog collect error:', error);
    const message = error instanceof Error ? error.message : '블로그 수집에 실패했습니다.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
