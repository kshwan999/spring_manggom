import { motion, useMotionValue, useSpring } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

export default function Manggom({ season }: { season: 'winter' | 'spring' }) {
  const [isPetting, setIsPetting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxEyeMove = 6;
        
        if (distance > 0) {
          eyeX.set((dx / distance) * Math.min(distance / 20, maxEyeMove));
          eyeY.set((dy / distance) * Math.min(distance / 20, maxEyeMove));
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [eyeX, eyeY]);

  const smoothEyeX = useSpring(eyeX, { stiffness: 300, damping: 30 });
  const smoothEyeY = useSpring(eyeY, { stiffness: 300, damping: 30 });

  // Exact colors from the user's code
  const colors = {
    fur: "#fbe5a2",
    pajama: "#a3ccff",
    outline: "#222222",
    blush: "rgba(255, 100, 150, 0.6)",
    mouth: "#ff7675",
    tosim: "#ffffff",
    hamter: "#d1ccc0",
  };

  const poyong = isPetting ? 22 : 0;

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-grab active:cursor-grabbing z-20 flex items-center justify-center"
      onPointerDown={() => setIsPetting(true)}
      onPointerUp={() => setIsPetting(false)}
      onPointerLeave={() => setIsPetting(false)}
    >
      <svg width="600" height="500" viewBox="0 0 600 500" className="overflow-visible drop-shadow-[0_0_30px_rgba(100,100,150,0.2)]">
        <defs>
          {/* The Signature Scruffy Filter */}
          <filter id="scruffy" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          
          <clipPath id="faceClip">
            <motion.ellipse 
              cx="300" 
              animate={{ cy: 275 + poyong, rx: 158 + poyong * 0.4, ry: 115 - poyong }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </clipPath>

          <pattern id="polka" x="0" y="0" width="36" height="32" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="16" r="2.5" fill="#ffffff" />
          </pattern>
        </defs>
        
        {/* Friends (Tosim & Hamter) */}
        <motion.g 
          animate={{ y: isPetting ? [0, -15, 0] : 0 }} 
          transition={{ repeat: isPetting ? Infinity : 0, duration: 0.4 }}
        >
          {/* Tosim (Left) */}
          <g transform="translate(100, 360)" filter="url(#scruffy)">
            <ellipse cx="-18" cy="-40" rx="15" ry="28" fill={colors.tosim} stroke={colors.outline} strokeWidth="6" transform="rotate(-5 -18 -40)" />
            <ellipse cx="18" cy="-40" rx="15" ry="28" fill={colors.tosim} stroke={colors.outline} strokeWidth="6" transform="rotate(5 18 -40)" />
            <path d="M -55 30 C -60 -10, -40 -42, 0 -42 C 40 -42, 60 -10, 55 30 C 50 60, -50 60, -55 30 Z" fill={colors.tosim} stroke={colors.outline} strokeWidth="6" />
            <circle cx="-22" cy="-8" r="4" fill={colors.outline} />
            <circle cx="22" cy="-8" r="4" fill={colors.outline} />
            <path d="M -8 5 A 4.5 4.5 0 0 0 0 9 A 4.5 4.5 0 0 0 8 5" stroke={colors.outline} strokeWidth="2" fill="none" />
          </g>
          
          {/* Hamter (Right) */}
          <g transform="translate(500, 380)" filter="url(#scruffy)">
            <circle cx="-15" cy="-20" r="10" fill={colors.hamter} stroke={colors.outline} strokeWidth="5" />
            <circle cx="15" cy="-20" r="10" fill={colors.hamter} stroke={colors.outline} strokeWidth="5" />
            <ellipse cx="0" cy="0" rx="35" ry="30" fill={colors.hamter} stroke={colors.outline} strokeWidth="5" />
            <circle cx="-10" cy="-2" r="3.5" fill={colors.outline} />
            <circle cx="10" cy="-2" r="3.5" fill={colors.outline} />
          </g>
        </motion.g>

        {/* Manggom Main Body */}
        <motion.g 
          filter="url(#scruffy)"
          animate={{ 
            x: season === 'winter' && !isPetting ? [-1.5, 1.5, -1.5, 1.5, 0] : 0,
            y: season === 'winter' && !isPetting ? [-1, 1, -1, 1, 0] : 0,
          }}
          transition={{ 
            x: { repeat: season === 'winter' && !isPetting ? Infinity : 0, duration: 0.2, ease: "linear" },
            y: { repeat: season === 'winter' && !isPetting ? Infinity : 0, duration: 0.2, ease: "linear" }
          }}
        >
          {/* Ears */}
          <motion.ellipse 
            cx="215" 
            fill={colors.fur} stroke={colors.outline} strokeWidth="7.5" transform="rotate(-20 215 180)"
            animate={{ cy: 180 + poyong * 0.5, rx: 48, ry: 42 - poyong * 0.3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.ellipse 
            cx="385" 
            fill={colors.fur} stroke={colors.outline} strokeWidth="7.5" transform="rotate(20 385 180)"
            animate={{ cy: 180 + poyong * 0.5, rx: 48, ry: 42 - poyong * 0.3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Face Base (Filled to hide lines behind) */}
          <motion.ellipse 
            cx="300" 
            fill={colors.fur}
            animate={{ cy: 275 + poyong, rx: 158 + poyong * 0.4, ry: 115 - poyong }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Pajama Base (Clipped inside face) */}
          <g clipPath="url(#faceClip)">
            <rect x="100" y="305" width="400" height="200" fill={colors.pajama} />
            <rect x="100" y="305" width="400" height="200" fill="url(#polka)" />
          </g>

          {/* Face Outline (Stroked over everything) */}
          <motion.ellipse 
            cx="300" 
            fill="none" stroke={colors.outline} strokeWidth="7.5"
            animate={{ cy: 275 + poyong, rx: 158 + poyong * 0.4, ry: 115 - poyong }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Pajama Collar Line */}
          <motion.path 
            stroke={colors.outline} strokeWidth="7.5" fill="none"
            animate={{ 
              d: isPetting 
                ? `M 134 ${313 + poyong * 0.8} Q 300 ${325 + poyong * 0.8} 466 ${313 + poyong * 0.8}`
                : `M 154 313 Q 300 325 446 313`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.circle 
            cx="300" r="9" fill="#fff" stroke={colors.outline} strokeWidth="7.5"
            animate={{ cy: 343 + poyong * 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Arms */}
          <motion.ellipse 
            cx="235" fill={colors.pajama} stroke={colors.outline} strokeWidth="7.5" transform="rotate(10 235 407)"
            animate={{ cy: 407 + poyong, rx: 42, ry: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.ellipse 
            cx="365" fill={colors.pajama} stroke={colors.outline} strokeWidth="7.5" transform="rotate(-10 365 407)"
            animate={{ cy: 407 + poyong, rx: 42, ry: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        </motion.g>

        {/* Face Details (No scruffy filter for clean look) */}
        <motion.g
          animate={{ 
            y: season === 'winter' && !isPetting ? [-1, 1, -1, 1, 0] : 0,
            x: season === 'winter' && !isPetting ? [-1.5, 1.5, -1.5, 1.5, 0] : 0,
          }}
          transition={{ 
            y: { repeat: season === 'winter' && !isPetting ? Infinity : 0, duration: 0.2, ease: "linear" },
            x: { repeat: season === 'winter' && !isPetting ? Infinity : 0, duration: 0.2, ease: "linear" }
          }}
        >
          {/* Blush */}
          <motion.ellipse 
            cx="222" rx="38" ry="22" fill={isPetting ? "rgba(255, 50, 100, 0.75)" : colors.blush}
            animate={{ cy: 287 + poyong }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.ellipse 
            cx="378" rx="38" ry="22" fill={isPetting ? "rgba(255, 50, 100, 0.75)" : colors.blush}
            animate={{ cy: 287 + poyong }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />

          {/* Eyes */}
          {isPetting ? (
            <>
              <motion.path d="M 252 263 A 12 12 0 0 1 276 263" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
              <motion.path d="M 324 263 A 12 12 0 0 1 348 263" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            </>
          ) : (
            <>
              <motion.circle cx="264" r="8" fill={colors.outline} style={{ x: smoothEyeX, y: smoothEyeY }} animate={{ cy: 269 + poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
              <motion.circle cx="336" r="8" fill={colors.outline} style={{ x: smoothEyeX, y: smoothEyeY }} animate={{ cy: 269 + poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            </>
          )}

          {/* Mouth */}
          {season === 'winter' && !isPetting ? (
            <motion.path 
              d="M 288 303 L 300 293 L 312 303" fill="none" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
              animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ) : season === 'spring' && !isPetting ? (
            <motion.path 
              d="M 288 292 L 288 305 C 288 320, 312 320, 312 305 L 312 292 Z" fill="#FF6B6B" stroke={colors.outline} strokeWidth="6" strokeLinejoin="round"
              animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ) : (
            <motion.ellipse 
              cx="300" rx="14" ry="18" fill={colors.mouth} stroke={colors.outline} strokeWidth="6"
              animate={{ cy: 297 + poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}

          {/* Winter Expressions (Eyebrows & Snot) */}
          {season === 'winter' && !isPetting && (
            <>
              <motion.path d="M 245 239 L 272 251" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
              <motion.path d="M 355 239 L 328 251" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
              
              {/* Snot Bubble */}
              <motion.g animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <motion.circle
                  cx="308" cy="287" r="10" fill="rgba(100, 210, 255, 0.7)" stroke={colors.outline} strokeWidth="3"
                  animate={{ r: [10, 14, 10], x: [-1.5, 1.5, -1.5] }}
                  transition={{ 
                    r: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
                    x: { repeat: Infinity, duration: 0.2, ease: "linear" }
                  }}
                />
                <motion.circle
                  cx="305" cy="284" r="2.5" fill="rgba(255, 255, 255, 0.8)"
                  animate={{ x: [-1.5, 1.5, -1.5] }}
                  transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                />
              </motion.g>
            </>
          )}

          {/* Spring Expressions (Eyebrows) */}
          {season === 'spring' && !isPetting && (
            <>
              <motion.path d="M 250 230 L 265 240" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
              <motion.path d="M 350 230 L 335 240" stroke={colors.outline} strokeWidth="6" strokeLinecap="round" animate={{ y: poyong }} transition={{ type: "spring", stiffness: 300, damping: 20 }} />
            </>
          )}
        </motion.g>

        {/* Hats */}
        <motion.g
          animate={{ 
            y: season === 'winter' && !isPetting ? [-1, 1, -1, 1, 0] : 0,
            x: season === 'winter' && !isPetting ? [-1.5, 1.5, -1.5, 1.5, 0] : 0,
          }}
          transition={{ 
            y: { repeat: season === 'winter' && !isPetting ? Infinity : 0, duration: 0.2, ease: "linear" },
            x: { repeat: season === 'winter' && !isPetting ? Infinity : 0, duration: 0.2, ease: "linear" }
          }}
        >
          {season === 'spring' && (
            <g transform="translate(300, 135)">
              <motion.g 
                animate={{ 
                  y: poyong * 2.2,
                  rotate: isPetting ? [0, 10, -10, 0] : [0, 5, -5, 0]
                }}
                transition={{ 
                  y: { type: "spring", stiffness: 300, damping: 20 },
                  rotate: { repeat: Infinity, duration: isPetting ? 0.5 : 2, ease: "easeInOut" }
                }}
              >
                <path d="M -30 10 L 30 10 L 0 -55 Z" fill="#93C5FD" stroke={colors.outline} strokeWidth="5" strokeLinejoin="round" />
                <rect x="-35" y="0" width="70" height="18" rx="9" fill="white" stroke={colors.outline} strokeWidth="5" />
                <circle cx="0" cy="-55" r="12" fill="white" stroke={colors.outline} strokeWidth="5" />
              </motion.g>
            </g>
          )}
          {season === 'winter' && (
            <g transform="translate(300, 135)">
              <motion.g 
                animate={{ y: poyong * 2.2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <path d="M -35 15 C -20 -45, 40 -50, 60 -10 C 65 0, 50 10, 50 10 Z" fill="#EF4444" stroke={colors.outline} strokeWidth="5" strokeLinejoin="round" />
                <rect x="-45" y="10" width="90" height="22" rx="11" fill="white" stroke={colors.outline} strokeWidth="5" />
                <circle cx="55" cy="-8" r="14" fill="white" stroke={colors.outline} strokeWidth="5" />
              </motion.g>
            </g>
          )}
        </motion.g>
      </svg>
    </motion.div>
  );
}
