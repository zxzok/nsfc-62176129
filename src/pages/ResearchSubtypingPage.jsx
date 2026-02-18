import ResearchDetailLayout from '../components/shared/ResearchDetailLayout'

export default function ResearchSubtypingPage() {
  return (
    <ResearchDetailLayout
      topicKey="subtyping"
      accentColor="ocean"
      relatedCategory="precision-medicine"
      icon={
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      }
    />
  )
}
