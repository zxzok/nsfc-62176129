export default function Disclaimer({ text }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 flex items-start gap-3.5">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 text-amber-400 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v2m0 4h.01M10.29 3.86l-8.03 14a2 2 0 001.73 3h16.06a2 2 0 001.73-3l-8.03-14a2 2 0 00-3.46 0z" />
        </svg>
      </div>
      <p className="text-[12px] text-slate-400 leading-[1.8]">{text}</p>
    </div>
  )
}
