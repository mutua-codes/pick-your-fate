'use client';

import { useState, useEffect } from 'react';

type Outcome = {
  emoji: string;
  title: string;
  desc: string;
};

const OUTCOMES: Outcome[] = [
  { emoji: '👑', title: 'TYCOON', desc: 'Living like a king. Three yachts, a private island, and a golden toilet.' },
  { emoji: '💸', title: 'BROKE LEGEND', desc: 'No money, but plenty of confidence. You walk into five-star restaurants like you own them.' },
  { emoji: '🤡', title: 'VILLAGE FOOL', desc: 'The whole village is laughing. Somewhere, a goat is telling its friends about you.' },
  { emoji: '🐔', title: 'ANIMAL MODE', desc: 'You are officially part of the animal kingdom. You eat a tin can. It is the best day of your life.' },
  { emoji: '🧦', title: 'SOCK COLLECTOR', desc: '4,000 odd socks. None match. Your washing machine has filed a complaint.' },
  { emoji: '📢', title: 'VILLAGE ANNOUNCER', desc: 'Official voice of the megaphone. Nobody asked. You will not stop.' },
  { emoji: '🥔', title: 'POTATO MINISTER', desc: 'Minister of Potatoes. Salary: potatoes. Office: a sack. You take it very seriously.' },
  { emoji: '🛸', title: 'ABDUCTED (KINDA)', desc: 'Aliens returned you after 11 minutes for "too much paperwork." You still wave at the sky.' },
];

function shuffle(arr: Outcome[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  // Initialize with standard order to avoid Math.random() during pre-render
  const [outcomes, setOutcomes] = useState<Outcome[]>(OUTCOMES);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [result, setResult] = useState<Outcome | null>(null);

  // Shuffle only on the client side after mounting to avoid hydration errors
  useEffect(() => {
    setOutcomes(shuffle(OUTCOMES));
  }, []);

  const gameOver = openedIndex !== null;
  const isWinner = result?.title === 'TYCOON';

  function openBox(index: number) {
    if (gameOver) return;
    setOpenedIndex(index);
    setResult(outcomes[index]);
  }

  function reset() {
    setOutcomes(shuffle(OUTCOMES));
    setOpenedIndex(null);
    setResult(null);
  }

  return (
    <main className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-4 text-center">
      <h1 className="fw-bold mb-2">🎲 Pick a Box</h1>
      
      <div className="alert alert-warning fw-semibold mb-4" role="alert" style={{ maxWidth: 520 }}>
        🏆 One box hides the <strong>TYCOON</strong>. Guess it correctly and you win a prize!
      </div>

      <p className="text-muted-light mb-4">
        Eight boxes. One destiny. Zero refunds. Choose wisely… or don&apos;t.
      </p>

      <div className="d-flex flex-wrap gap-3 justify-content-center mb-4" style={{ maxWidth: 600 }}>
        {outcomes.map((outcome, i) => {
          const isOpened = openedIndex === i;
          const isDisabled = gameOver && !isOpened;
          const classes = [
            'box-card',
            isOpened ? 'opened' : '',
            isDisabled ? 'disabled' : '',
          ].join(' ');

          return (
            <div
              key={i}
              className={classes}
              onClick={() => openBox(i)}
              role="button"
              aria-label={`Box ${i + 1}`}
              aria-disabled={gameOver}
            >
              {isOpened ? outcome.emoji : '📦'}
            </div>
          );
        })}
      </div>

      <div className={`result-card p-4 mb-4 ${result ? 'show' : ''}`}>
        {result && (
          <>
            <div className="result-emoji mb-2">{result.emoji}</div>
            <div className="fs-4 fw-bold mb-1">{result.title}</div>
            <div className="text-muted-light">{result.desc}</div>
            {isWinner && (
              <div className="alert alert-success mt-3 mb-0 fw-bold">
                🎉 CORRECT GUESS! You win the prize!
              </div>
            )}
          </>
        )}
      </div>

      <button
        className="btn btn-danger btn-lg px-4"
        onClick={reset}
        disabled={!gameOver}
        style={{ boxShadow: '0 4px 0 #7a1f35' }}
      >
        Play Again
      </button>
    </main>
  );
}