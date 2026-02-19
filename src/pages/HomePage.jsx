import HeroSection from '../components/home/HeroSection'
import FeaturedPublications from '../components/home/FeaturedPublications'
import ResearchHighlights from '../components/home/ResearchHighlights'
import KeyResults from '../components/home/KeyResults'
import ApplicationImpact from '../components/home/ApplicationImpact'
import ContactSection from '../components/home/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ResearchHighlights />
      <KeyResults />
      <FeaturedPublications />
      <ApplicationImpact />
      <ContactSection />
    </>
  )
}
