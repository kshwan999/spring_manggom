import { useEffect, useRef } from 'react';

export default function Particles({ season }: { season: 'winter' | 'spring' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const numParticles = season === 'winter' ? 150 : 80;

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
        size: season === 'winter' ? 2 + Math.random() * 4 : 6 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 2,
        vy: season === 'winter' ? 0.5 + Math.random() * 1.5 : 1 + Math.random() * 2,
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

      ctx.shadowBlur = season === 'winter' ? 4 : 8;
      ctx.shadowColor = season === 'winter' ? "#ffffff" : "#ffb7c5";

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        if (season === 'winter') {
          p.x += Math.sin(frame * 0.03 + p.driftSeed) * 0.6;
        } else {
          p.angle += p.rotation;
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
        p.vy = Math.max(season === 'winter' ? 0.5 : 1, p.vy * 0.99 + 0.05);

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);

        if (season === 'winter') {
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
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
