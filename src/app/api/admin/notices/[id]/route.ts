import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const notice = await Notice.findByIdAndUpdate(id, body, { new: true });
    if (!notice) {
      return NextResponse.json({ success: false, error: '공지사항을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: notice });
  } catch (error) {
    console.error('Admin notice PUT error:', error);
    return NextResponse.json({ success: false, error: '공지사항 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) {
      return NextResponse.json({ success: false, error: '공지사항을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin notice DELETE error:', error);
    return NextResponse.json({ success: false, error: '공지사항 삭제에 실패했습니다.' }, { status: 500 });
  }
}
