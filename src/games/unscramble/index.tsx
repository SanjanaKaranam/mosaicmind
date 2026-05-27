import { useUnscramble } from './hooks/useUnscramble'
import ModeSelect from './components/ModeSelect'
import GameScreen from './components/GameScreen'
import ScoreScreen from './components/ScoreScreen'
import GameLayout from './components/GameLayout'

export default function Unscramble() {
  const game = useUnscramble()
  const inGame = game.phase === 'playing' || game.phase === 'reveal' || game.phase === 'finished'
  const canRestart = inGame && game.mode?.play !== 'daily'

  return (
    <GameLayout
      title="CrypText"
      onHome={inGame ? game.goHome : undefined}
      onRestart={canRestart ? game.restartGame : undefined}
      onEndGame={(game.phase === 'playing' || game.phase === 'reveal') && game.mode?.play === 'unlimited' ? game.endGame : undefined}
    >
      {game.phase === 'idle' && (
        <ModeSelect onStart={game.startGame} />
      )}
      {(game.phase === 'playing' || game.phase === 'reveal') && (
        <GameScreen
          currentRound={game.currentRound}
          totalRounds={game.totalRounds}
          score={game.score}
          scrambled={game.scrambled}
          currentWord={game.currentWord}
          input={game.input}
          timeLeft={game.timeLeft}
          timing={game.mode?.timing ?? 'timed'}
          revealedIndices={game.revealedIndices}
          hintsUsed={game.hintsUsed}
          paused={game.paused}
          correctFlash={game.correctFlash}
          revealed={game.phase === 'reveal'}
          revealReason={game.revealReason}
          onNext={game.advanceFromReveal}
          onInput={game.handleInput}
          onLetterHint={game.useLetterHint}
          onRevealWord={game.revealWord}
          onDefinitionHint={game.trackDefinitionHint}
          onPause={game.togglePause}
          onGoHome={game.goHome}
          onRestart={game.restartGame}
          onShuffle={game.shuffleScramble}
        />
      )}
      {game.phase === 'finished' && game.mode && (
        <ScoreScreen
          score={game.score}
          totalRounds={game.totalRounds}
          wrongWords={game.wrongWords}
          hintsUsed={game.hintsUsed}
          mode={game.mode}
          onPlayAgain={game.resetGame}
          onReplay={game.replayGame}
        />
      )}
    </GameLayout>
  )
}
