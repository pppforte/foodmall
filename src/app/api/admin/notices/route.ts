import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const notices = await Notice.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    console.error('Admin notices GET error:', error);
    return NextResponse.json({ success: false, error: '공지사항 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const body = await request.json();
    const notice = await Notice.create(body);
    return NextResponse.json({ success: true, data: notice }, { status: 201 });
  } catch (error) {
    console.error('Admin notice POST error:', error);
    return NextResponse.json({ success: false, error: '공지사항 생성에 실패했습니다.' }, { status: 500 });
  }
}
