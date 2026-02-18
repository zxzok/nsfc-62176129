import ResearchDetailLayout from '../components/shared/ResearchDetailLayout'

export default function ResearchTranslationPage() {
  return (
    <ResearchDetailLayout
      topicKey="translation"
      accentColor="coral"
      relatedCategory="clinical"
      icon={
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      }
    />
  )
}
