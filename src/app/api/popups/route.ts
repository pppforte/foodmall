import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Popup from '@/models/Popup';

export async function GET() {
  try {
    await dbConnect();
    const now = new Date();
    const popups = await Popup.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ sortOrder: 1 });
    return NextResponse.json({ success: true, data: popups });
  } catch (error) {
    console.error('Popups GET error:', error);
    return NextResponse.json({ success: false, error: '팝업을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
