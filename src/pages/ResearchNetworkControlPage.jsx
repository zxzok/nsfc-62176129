import ResearchDetailLayout from '../components/shared/ResearchDetailLayout'

export default function ResearchNetworkControlPage() {
  return (
    <ResearchDetailLayout
      topicKey="networkControl"
      accentColor="navy"
      relatedCategory="network-control"
      icon={
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="5" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
          <circle cx="8" cy="19" r="2" /><circle cx="16" cy="19" r="2" />
          <line x1="12" y1="7" x2="5" y2="10" /><line x1="12" y1="7" x2="19" y2="10" />
          <line x1="5" y1="14" x2="8" y2="17" /><line x1="19" y1="14" x2="16" y2="17" />
        </svg>
      }
    />
  )
}
