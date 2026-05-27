interface Props {
  timeLeft: number
  total:    number
}

export default function Timer({ timeLeft, total }: Props) {
  const pct   = (timeLeft / total) * 100
  const color = pct > 50 ? 'bg-[var(--accent)]' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="w-full flex items-center gap-3">
      <span className={`text-2xl font-bold w-10 text-right ${pct <= 25 ? 'text-red-400' : 'text-white/80'}`}>
        {timeLeft}
      </span>
      <div className="flex-1 h-4 bg-black/40 rounded-full overflow-hidden border border-white/15">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
