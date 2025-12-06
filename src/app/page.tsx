import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { CasesSection } from '@/components/CasesSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'
import { ScrollToHash } from '@/components/ScrollToHash'

/**
 * 主页面组件
 * 整合所有页面区块
 */
export default function Home() {
  return (
    <main>
      <ScrollToHash />
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CasesSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

