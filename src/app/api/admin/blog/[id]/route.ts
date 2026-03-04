import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const post = await BlogPost.findByIdAndUpdate(id, body, { new: true });
    if (!post) {
      return NextResponse.json({ success: false, error: '블로그 글을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Admin blog PUT error:', error);
    return NextResponse.json({ success: false, error: '블로그 글 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ success: false, error: '블로그 글을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin blog DELETE error:', error);
    return NextResponse.json({ success: false, error: '블로그 글 삭제에 실패했습니다.' }, { status: 500 });
  }
}
