import { useEffect, useRef } from 'react';

export default function Particles({ season }: { season: 'spring' | 'summer' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const numParticles = season === 'spring' ? 120 : 60;

    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let lastMouseX = -1000;
    let lastMouseY = -1000;
    let frame = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (lastMouseX !== -1000) {
        mouseVelX = mouseX - lastMouseX;
        mouseVelY = mouseY - lastMouseY;
      }
      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: season === 'spring' ? 6 + Math.random() * 8 : Math.random() * 6 + 3,
        vx: (Math.random() - 0.5) * 2,
        vy: season === 'spring' ? 1 + Math.random() * 2 : -2 - Math.random() * 2, // Summer particles float up instead
        angle: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 0.1,
        hueShift: Math.random() * 20,
        driftSeed: Math.random() * 100,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Decay mouse velocity
      mouseVelX *= 0.9;
      mouseVelY *= 0.9;

      ctx.shadowBlur = season === 'spring' ? 8 : 4;
      ctx.shadowColor = season === 'spring' ? "#ffb7c5" : "#a2e4f0";

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        if (season === 'spring') {
          p.x += Math.sin(frame * 0.03 + p.driftSeed) * 1.5;
          p.angle += p.rotation;
        } else {
          // Summer bubbles wiggle slightly upwards
          p.x += Math.sin(frame * 0.05 + p.driftSeed) * 0.8;
        }

        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 2 + mouseVelX * 0.1;
          p.vy += (dy / dist) * force * 2 + mouseVelY * 0.1;
        }

        p.vx *= 0.98;
        if (season === 'spring') {
            p.vy = Math.max(1, p.vy * 0.99 + 0.05);
            if (p.y > canvas.height + 20) {
              p.y = -20;
              p.x = Math.random() * canvas.width;
            }
        } else {
            p.vy = Math.min(-0.5, p.vy * 0.99 - 0.05);
            if (p.y < -20) {
              p.y = canvas.height + 20;
              p.x = Math.random() * canvas.width;
            }
        }
        
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (season === 'spring') {
          ctx.rotate(p.angle);
          ctx.fillStyle = `hsl(${340 + p.hueShift}, 100%, 85%)`;

          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size, -p.size, p.size, p.size, 0, p.size);
          ctx.bezierCurveTo(-p.size, p.size, -p.size, -p.size, 0, -p.size);
          ctx.fill();

          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
        } else {
          // Summer Bubbles
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = Math.max(1, p.size * 0.1);
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Bubble Highlight
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.beginPath();
          ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}
