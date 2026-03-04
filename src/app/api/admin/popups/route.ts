import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Popup from '@/models/Popup';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const popups = await Popup.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: popups });
  } catch (error) {
    console.error('Admin popups GET error:', error);
    return NextResponse.json({ success: false, error: '팝업 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const body = await request.json();
    const popup = await Popup.create(body);
    return NextResponse.json({ success: true, data: popup }, { status: 201 });
  } catch (error) {
    console.error('Admin popup POST error:', error);
    return NextResponse.json({ success: false, error: '팝업 생성에 실패했습니다.' }, { status: 500 });
  }
}
