import React, { useEffect, useState } from 'react';

interface FloatingReactionsProps {
  reactions: Array<{ id: string; reaction: string }>;
}

interface ActiveParticle {
  id: string;
  emoji: string;
  left: number;
}

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions = [] }) => {
  const [particles, setParticles] = useState<ActiveParticle[]>([]);

  useEffect(() => {
    if (reactions.length === 0) return;
    const latest = reactions[reactions.length - 1];
    if (!latest) return;

    const newParticle: ActiveParticle = {
      id: `${latest.id}-${Date.now()}`,
      emoji: latest.reaction,
      left: Math.floor(15 + Math.random() * 70), // 15% to 85% width
    };

    setParticles((prev) => [...prev, newParticle]);

    // Cleanup particle after animation ends
    const timer = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2800);

    return () => clearTimeout(timer);
  }, [reactions]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-4xl sm:text-5xl animate-float-up select-none filter drop-shadow-md"
          style={{
            left: `${p.left}%`,
            bottom: '60px',
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};
