import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!(await verifyAuth())) {
    return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
  }
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ success: true, data: inquiries, total, page, limit });
  } catch (error) {
    console.error('Admin inquiries GET error:', error);
    return NextResponse.json({ success: false, error: '문의 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
