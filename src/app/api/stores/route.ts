import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Store from '@/models/Store';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const search = searchParams.get('search');

    const filter: Record<string, unknown> = { isActive: true };
    if (region && region !== '전체') {
      filter.region = region;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const stores = await Store.find(filter).sort({ sortOrder: 1, name: 1 });

    // Also get distinct regions for filter
    const regions = await Store.distinct('region', { isActive: true });

    return NextResponse.json({
      success: true,
      data: stores,
      total: stores.length,
      regions: ['전체', ...regions.sort()],
    });
  } catch (error) {
    console.error('Stores GET error:', error);
    return NextResponse.json({ success: false, error: '매장 정보를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
