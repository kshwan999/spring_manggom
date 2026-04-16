'use client';

import { useState } from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'motion/react';
import Manggom from '@/components/Manggom';
import Particles from '@/components/Particles';
import Environment from '@/components/Environment';

export default function Page() {
  const [season, setSeason] = useState<'spring' | 'summer'>('spring');

  const handleSeasonChange = (newSeason: 'spring' | 'summer') => {
    if (season === newSeason) return;
    
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSeason(newSeason);
        });
      });
    } else {
      setSeason(newSeason);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden select-none bg-slate-900">
      <Environment season={season} />
      <Particles season={season} />

      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center">
        {/* Character Text */}
        <div className="mb-8 h-16 flex items-center justify-center">
          {season === 'spring' ? (
            <motion.h1
              key="spring-text"
              className="text-4xl md:text-5xl font-bold text-pink-200 tracking-wider"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              animate={{ x: [-2, 2, -2, 2, 0], y: [-1, 1, -1, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
            >
              봄 냄새!!
            </motion.h1>
          ) : (
            <motion.h1
              key="summer-text"
              className="text-4xl md:text-5xl font-bold text-blue-300 tracking-wider"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeOut" }}
            >
              너무덥곰!!
            </motion.h1>
          )}
        </div>

        {/* Character */}
        <Manggom season={season} />

        {/* Controls */}
        <div className="absolute top-8 flex gap-2 px-6 py-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl shadow-lg z-50">
          <button
            onClick={() => handleSeasonChange('spring')}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-wide transition-all shadow-sm ${
              season === 'spring' 
                ? 'bg-gradient-to-br from-[#ff758c] to-[#ff7eb3] text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-105' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Spring
          </button>
          <button
            onClick={() => handleSeasonChange('summer')}
            className={`px-6 py-2 rounded-full font-bold uppercase tracking-wide transition-all shadow-sm ${
              season === 'summer' 
                ? 'bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-105' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Summer!!
          </button>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-12 text-white/50 text-sm tracking-wider">
          망곰이의 머리를 쓰다듬어(마우스 드래그) 보세요!
        </div>
      </div>
    </main>
  );
}

