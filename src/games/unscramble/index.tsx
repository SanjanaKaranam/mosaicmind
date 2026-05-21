import { useUnscramble } from './hooks/useUnscramble'
import ModeSelect from './components/ModeSelect'

export default function Unscramble() {
  const game = useUnscramble()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {game.phase === 'idle' && (
        <ModeSelect onStart={game.startGame} />
      )}
    </div>
  )
}
