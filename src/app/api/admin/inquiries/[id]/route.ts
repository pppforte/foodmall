import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const inquiry = await Inquiry.findByIdAndUpdate(id, body, { new: true });
    if (!inquiry) {
      return NextResponse.json({ success: false, error: '문의를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Admin inquiry PUT error:', error);
    return NextResponse.json({ success: false, error: '문의 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return NextResponse.json({ success: false, error: '문의를 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin inquiry DELETE error:', error);
    return NextResponse.json({ success: false, error: '문의 삭제에 실패했습니다.' }, { status: 500 });
  }
}
