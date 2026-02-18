export default function SectionWrapper({ id, dark, className = '', children }) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-24 ${dark ? 'bg-navy text-white' : 'bg-slate-50'} ${className}`}
    >
      <div className="section-container">
        {children}
      </div>
    </section>
  )
}
