import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import BrandSection from '@/components/sections/BrandSection';
import MenuSlideSection from '@/components/sections/MenuSlideSection';
import MediaSection from '@/components/sections/MediaSection';
import FranchiseSection from '@/components/sections/FranchiseSection';
import InteriorSection from '@/components/sections/InteriorSection';
import MenuTabSection from '@/components/sections/MenuTabSection';
import ContactSection from '@/components/sections/ContactSection';
import StoreSection from '@/components/sections/StoreSection';
import BlogNoticeSection from '@/components/sections/BlogNoticeSection';
import MobileCTA from '@/components/layout/MobileCTA';
import PopupManager from '@/components/PopupManager';

export default function Home() {
  return (
    <>
      <Header />
      <PopupManager />
      <HeroSection />
      <BrandSection />
      <MenuSlideSection />
      <MenuTabSection />
      <MediaSection />
      <FranchiseSection />
      <InteriorSection />
      <StoreSection />
      <BlogNoticeSection />
      <ContactSection />
      <Footer />
      <MobileCTA />
    </>
  );
}
