import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import PublicationsPage from './pages/PublicationsPage'
import PatentsPage from './pages/PatentsPage'
import ResearchSubtypingPage from './pages/ResearchSubtypingPage'
import ResearchNetworkControlPage from './pages/ResearchNetworkControlPage'
import ResearchBiomarkersPage from './pages/ResearchBiomarkersPage'
import ResearchTranslationPage from './pages/ResearchTranslationPage'
import PublicationDetailPage from './pages/PublicationDetailPage'
import ExplainerPage from './pages/ExplainerPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/publications/:slug" element={<PublicationDetailPage />} />
          <Route path="/publications/:slug/explainer" element={<ExplainerPage />} />
          <Route path="/patents" element={<PatentsPage />} />
          <Route path="/research/subtyping" element={<ResearchSubtypingPage />} />
          <Route path="/research/network-control" element={<ResearchNetworkControlPage />} />
          <Route path="/research/biomarkers" element={<ResearchBiomarkersPage />} />
          <Route path="/research/translation" element={<ResearchTranslationPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
