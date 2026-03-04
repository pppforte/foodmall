export default function Footer() {
  return (
    <footer id="footer" className="bg-[var(--color-secondary)] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black text-white mb-4">완뚝순두부</h3>
            <p className="text-sm leading-relaxed">
              전 가맹점 웨이팅 기본!<br />
              체계적인 지원과 노하우 전수!<br />
              검증된 맛과 브랜드로 안정적인 창업!
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">회사 정보</h4>
            <ul className="space-y-2 text-sm">
              <li>상호: (주)완뚝순두부</li>
              <li>대표: 홍길동</li>
              <li>사업자등록번호: 000-00-00000</li>
              <li>주소: 대구광역시 동구 팔공로51길 31-10</li>
              <li>
                대표번호:{' '}
                <a href="tel:1668-1977" className="text-white hover:text-[var(--color-accent)] transition-colors">
                  1668-1977
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#brand" className="hover:text-white transition-colors">브랜드 소개</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">메뉴 소개</a>
              </li>
              <li>
                <a href="#franchise" className="hover:text-white transition-colors">가맹 안내</a>
              </li>
              <li>
                <a href="#store" className="hover:text-white transition-colors">매장 안내</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">창업 문의</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} 완뚝순두부. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
