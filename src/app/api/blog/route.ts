import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const total = await BlogPost.countDocuments({ isActive: true });
    const posts = await BlogPost.find({ isActive: true })
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ success: true, data: posts, total, page, limit });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ success: false, error: '블로그 글을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
