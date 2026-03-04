import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const posts = await BlogPost.find().sort({ publishedAt: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Admin blog GET error:', error);
    return NextResponse.json({ success: false, error: '블로그 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const body = await request.json();
    const post = await BlogPost.create(body);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Admin blog POST error:', error);
    return NextResponse.json({ success: false, error: '블로그 글 생성에 실패했습니다.' }, { status: 500 });
  }
}
