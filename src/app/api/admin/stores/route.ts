import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Store from '@/models/Store';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const stores = await Store.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: stores });
  } catch (error) {
    console.error('Admin stores GET error:', error);
    return NextResponse.json({ success: false, error: '매장 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const body = await request.json();
    const store = await Store.create(body);
    return NextResponse.json({ success: true, data: store }, { status: 201 });
  } catch (error) {
    console.error('Admin store POST error:', error);
    return NextResponse.json({ success: false, error: '매장 생성에 실패했습니다.' }, { status: 500 });
  }
}
