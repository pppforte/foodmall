import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import { sendInquiryEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validation
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, error: '이름과 연락처는 필수입니다.' }, { status: 400 });
    }
    if (!body.privacyAgreed) {
      return NextResponse.json({ success: false, error: '개인정보 수집 동의가 필요합니다.' }, { status: 400 });
    }

    // Phone format validation (Korean phone numbers)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json({ success: false, error: '올바른 전화번호를 입력해주세요.' }, { status: 400 });
    }

    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || '';

    const inquiry = await Inquiry.create({
      name: body.name,
      phone: body.phone,
      hasStore: body.hasStore || 'no',
      region: body.region || '',
      content: body.content || '',
      source: body.source || 'form',
      privacyAgreed: body.privacyAgreed,
      ipAddress,
    });

    // Send email (don't block response on email)
    sendInquiryEmail({
      name: body.name,
      phone: body.phone,
      hasStore: body.hasStore || 'no',
      region: body.region || '',
      content: body.content || '',
      source: body.source || 'form',
    }).then((sent) => {
      if (sent) {
        Inquiry.findByIdAndUpdate(inquiry._id, { emailSent: true }).catch(console.error);
      }
    }).catch(console.error);

    return NextResponse.json({ success: true, data: { id: inquiry._id } }, { status: 201 });
  } catch (error) {
    console.error('Inquiry POST error:', error);
    return NextResponse.json({ success: false, error: '문의 접수에 실패했습니다.' }, { status: 500 });
  }
}
