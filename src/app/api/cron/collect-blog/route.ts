import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { searchNaverBlog, parseNaverDate } from '@/lib/naver';
import { getSettings } from '@/lib/settings';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const settings = await getSettings();

    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = settings.cronSecret || process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const keyword = settings.blogSearchKeyword || process.env.BLOG_SEARCH_KEYWORD || '완뚝순두부';
    const { items, total } = await searchNaverBlog(keyword, 100);

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

    console.log(`[Cron] Blog collected: keyword="${keyword}", total=${total}, new=${newCount}, filtered=${filteredCount}, skipped=${skipCount}`);

    return NextResponse.json({
      success: true,
      data: { keyword, totalFound: total, filtered: filteredCount, newlyAdded: newCount, skipped: skipCount },
    });
  } catch (error) {
    console.error('[Cron] Blog collect error:', error);
    const message = error instanceof Error ? error.message : 'Collection failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
