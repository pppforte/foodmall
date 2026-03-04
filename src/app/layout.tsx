import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "완뚝순두부 - 프랜차이즈 창업",
    template: "%s | 완뚝순두부",
  },
  description: "전 가맹점 웨이팅 기본! 체계적인 지원과 노하우 전수! 검증된 맛과 브랜드로 안정적인 창업!",
  keywords: ["순두부창업", "돌솥밥", "한식창업", "프랜차이즈창업", "소자본창업"],
  openGraph: {
    title: "완뚝순두부",
    description: "전 가맹점 웨이팅 기본! 체계적인 지원과 노하우 전수!",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "완뚝순두부",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
