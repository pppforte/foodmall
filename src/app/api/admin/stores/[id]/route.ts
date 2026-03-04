import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Store from '@/models/Store';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const store = await Store.findByIdAndUpdate(id, body, { new: true });
    if (!store) {
      return NextResponse.json({ success: false, error: '매장을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: store });
  } catch (error) {
    console.error('Admin store PUT error:', error);
    return NextResponse.json({ success: false, error: '매장 수정에 실패했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { id } = await params;
    const store = await Store.findByIdAndDelete(id);
    if (!store) {
      return NextResponse.json({ success: false, error: '매장을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin store DELETE error:', error);
    return NextResponse.json({ success: false, error: '매장 삭제에 실패했습니다.' }, { status: 500 });
  }
}
