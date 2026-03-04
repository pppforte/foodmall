import { NextRequest, NextResponse } from 'next/server';
import { verifyUsername, verifyPassword, generateToken, getTokenCookieOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    if (!(await verifyUsername(username))) {
      return NextResponse.json({ success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    const token = await generateToken();
    const cookieOptions = getTokenCookieOptions();

    const response = NextResponse.json({ success: true });
    response.cookies.set(cookieOptions.name, token, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: '로그인에 실패했습니다.' }, { status: 500 });
  }
}
