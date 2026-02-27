import { useEffect, useRef } from 'react';

class Tree {
  x: number;
  y: number;
  scale: number;
  side: number;
  trunkSway: number;
  heightVar: number;
  thicknessVar: number;
  branchCount: number;
  canopySeed: number;
  branches: { y: number; angle: number; len: number }[];
  color: string;
  canopyColor: string;

  constructor(x: number, y: number, scale: number, side: number) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.side = side;
    
    this.trunkSway = (Math.random() - 0.5) * 45;
    this.heightVar = 1.3 + Math.random() * 0.5;
    this.thicknessVar = 0.9 + Math.random() * 0.3;
    this.branchCount = 4 + Math.floor(Math.random() * 3);
    this.canopySeed = Math.random() * 100;
    
    this.branches = [];
    for (let i = 0; i < this.branchCount; i++) {
        const bY = -120 - (i * 35);
        const baseAngle = this.side === -1 ? Math.PI : 0; 
        const bAngle = baseAngle + (Math.random() - 0.5) * 1.2 - 0.5;
        const bLen = 60 + Math.random() * 60;
        this.branches.push({ y: bY, angle: bAngle, len: bLen });
    }
    
    this.color = `rgba(25, 25, 40, ${0.6 + 0.3 * scale})`; 
    this.canopyColor = `rgba(255, 183, 197, ${0.2 + 0.15 * scale})`;
  }

  draw(ctx: CanvasRenderingContext2D, state: 'winter' | 'spring') {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale * this.thicknessVar, this.scale * this.heightVar);
    
    const trunkColor = state === 'winter' 
      ? `rgba(25, 25, 40, ${0.6 + 0.3 * this.scale})` 
      : `rgba(110, 75, 50, ${0.8 + 0.2 * this.scale})`; // Warm brown for spring
      
    ctx.fillStyle = trunkColor;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.bezierCurveTo(-12, -100, -25 + this.trunkSway, -150, -5, -280); 
    ctx.lineTo(5, -280);
    ctx.bezierCurveTo(25 + this.trunkSway, -150, 12, -100, 15, 0);
    ctx.fill();

    ctx.lineWidth = 4.5;
    ctx.strokeStyle = trunkColor;
    this.branches.forEach((b) => {
        ctx.beginPath();
        ctx.moveTo(0, b.y);
        const cpX = Math.cos(b.angle) * b.len * 0.6;
        const cpY = b.y + Math.sin(b.angle) * b.len * 0.6;
        const endX = Math.cos(b.angle) * b.len;
        const endY = b.y + Math.sin(b.angle) * b.len;
        
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();
    });

    if (state === 'spring') {
        const canopyColor = `rgba(255, 170, 190, ${0.7 + 0.3 * this.scale})`; // Brighter, more opaque pink for day
        ctx.fillStyle = canopyColor;
        for (let i = 0; i < 16; i++) {
            const ang = (i / 16) * Math.PI * 2;
            const dist = 55 + Math.sin(ang * 4 + this.canopySeed) * 40;
            const lx = Math.cos(ang) * dist;
            const ly = -300 + Math.sin(ang) * dist * 0.7; 
            const r = 65 + Math.sin(this.canopySeed + i) * 20;
            
            ctx.beginPath();
            ctx.arc(lx, ly, r, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.restore();
  }
}

export default function Environment({ season }: { season: 'winter' | 'spring' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;
    let trees: Tree[] = [];
    
    // Background Orbs
    const orbs = Array.from({ length: 15 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 100 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: 0.03 + Math.random() * 0.05,
    }));

    // Stars
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      blink: Math.random() * Math.PI,
      size: 0.5 + Math.random() * 1.5,
    }));

    const initTrees = (width: number, height: number) => {
      trees = [];
      const treeCount = 66;
      
      const vPointY = height * 0.4;
      const roadTopLeft = width/2 - 50;
      const roadTopRight = width/2 + 50;
      const roadBottomLeft = -width * 0.6;
      const roadBottomRight = width * 1.6;

      for (let i = 0; i < treeCount; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const step = Math.pow(Math.floor(i / 2) / (treeCount / 2), 1.2); 
        
        const y = vPointY + step * (height - vPointY + 200);
        const scale = 0.3 + step * 1.8;
        
        let x;
        if (side === -1) {
            x = roadTopLeft + step * (roadBottomLeft - roadTopLeft);
            x -= (10 + step * 120);
        } else {
            x = roadTopRight + step * (roadBottomRight - roadTopRight);
            x += (10 + step * 120);
        }
        
        x += (Math.random() - 0.5) * (step * 250); 
        
        trees.push(new Tree(x, y, scale, side));
      }
      trees.sort((a, b) => a.scale - b.scale);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initTrees(canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Background Gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      if (season === 'winter') {
        bgGrad.addColorStop(0, '#0c1c38');
        bgGrad.addColorStop(1, '#020817');
      } else {
        bgGrad.addColorStop(0, '#FFF5E1'); // Warm sun center
        bgGrad.addColorStop(1, '#A0D8EF'); // Sky blue edges
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Stars (Only in winter)
      if (season === 'winter') {
        stars.forEach((s) => {
          s.blink += 0.03;
          const alpha = (Math.sin(s.blink) + 1) / 2;
          ctx.fillStyle = `rgba(255, 255, 230, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 3. Moon / Sun
      const mx = width - 120;
      const my = 100;
      ctx.save();
      ctx.shadowBlur = season === 'winter' ? 40 : 60;
      ctx.shadowColor = season === 'winter' ? "rgba(200, 230, 255, 0.5)" : "rgba(255, 220, 100, 0.8)";
      ctx.fillStyle = season === 'winter' ? "#f0f8ff" : "#FFD700";
      ctx.beginPath();
      ctx.arc(mx, my, season === 'winter' ? 40 : 50, 0, Math.PI * 2);
      ctx.fill();
      
      if (season === 'winter') {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(mx - 15, my - 10, 40, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Back Orbs (Warm flares in spring)
      orbs.forEach((o) => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.size) o.x = width + o.size;
        if (o.x > width + o.size) o.x = -o.size;
        if (o.y < -o.size) o.y = height + o.size;
        if (o.y > height + o.size) o.y = -o.size;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.size);
        const pulse = Math.sin(frame * 0.02 + o.size) * 0.02;
        const orbColor = season === 'winter' ? `rgba(200, 230, 255, ${o.opacity + pulse})` : `rgba(255, 240, 200, ${(o.opacity + pulse) * 1.5})`;
        g.addColorStop(0, orbColor);
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Perspective Path (Road)
      const vPointY = height * 0.4;
      const roadColor = season === 'winter' ? "rgba(10, 20, 40, 0.9)" : "rgba(240, 230, 210, 0.8)"; // Warm dirt/path
      
      // Draw the main road polygon
      ctx.fillStyle = roadColor;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 50, vPointY);
      ctx.lineTo(width / 2 + 50, vPointY);
      ctx.lineTo(width * 1.6, height + 100);
      ctx.lineTo(-width * 0.6, height + 100);
      ctx.fill();

      // Road side glow / borders
      ctx.strokeStyle = season === 'winter' ? "rgba(180, 220, 255, 0.25)" : "rgba(255, 200, 150, 0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 50, vPointY);
      ctx.lineTo(-width * 0.6, height + 100);
      ctx.moveTo(width / 2 + 50, vPointY);
      ctx.lineTo(width * 1.6, height + 100);
      ctx.stroke();

      // 6. Trees
      trees.forEach((t) => t.draw(ctx, season));

      // 7. Ground Cover (Fill the bottom with the road color instead of green grass)
      // We draw a rectangle at the bottom to cover the green grass area
      // The height is calculated to start where the road ends visually or just cover the bottom
      ctx.fillStyle = roadColor;
      ctx.fillRect(0, height - 200, width, 200);
      
      // Add a subtle gradient to the bottom to give it some depth, but keep it the same base color
      const gGrad = ctx.createLinearGradient(0, height - 200, 0, height);
      if (season === 'spring') {
        gGrad.addColorStop(0, "rgba(240, 230, 210, 0)"); // Transparent at top
        gGrad.addColorStop(1, "rgba(220, 210, 190, 0.8)"); // Slightly darker dirt at bottom
      } else {
        gGrad.addColorStop(0, "rgba(10, 20, 40, 0)");
        gGrad.addColorStop(1, "rgba(5, 10, 20, 0.8)");
      }
      ctx.fillStyle = gGrad;
      ctx.fillRect(0, height - 200, width, 200);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}
