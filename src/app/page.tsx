import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedCase } from '@/components/FeaturedCase'
import { ServicesSection } from '@/components/ServicesSection'
import { CasesSection } from '@/components/CasesSection'
import { ComplexProjectsSection } from '@/components/ComplexProjectsSection'
import { CertificationsSection } from '@/components/CertificationsSection'
import { AboutSection } from '@/components/AboutSection'
import { StatsSection } from '@/components/StatsSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'

/**
 * 主页面组件
 * 整合所有页面区块
 */
export default function Home() {
  return (
    <main className="min-h-screen" style={{ width: '100vw' }}>
      <Header />
      <HeroSection />
      <FeaturedCase />
      <ServicesSection />
      <CasesSection />
      <ComplexProjectsSection />
      <CertificationsSection />
      <AboutSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}