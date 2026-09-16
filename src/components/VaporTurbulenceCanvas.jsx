import React, { useEffect, useRef } from 'react';

export default function VaporTurbulenceCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width * 0.5, y: height * 0.4, targetX: width * 0.5, targetY: height * 0.4 };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Refined subtle refractive obsidian & deep violet ribbons
    const ribbons = [
      { speed: 0.0004, amp: 90, freq: 0.0012, yOffset: 0.18, width: 2.5, alpha: 0.35, color: '#7c3aed' },
      { speed: 0.0006, amp: 120, freq: 0.0016, yOffset: 0.32, width: 3.0, alpha: 0.45, color: '#9333ea' },
      { speed: 0.0003, amp: 150, freq: 0.0011, yOffset: 0.52, width: 3.8, alpha: 0.55, color: '#a855f7' },
      { speed: 0.0005, amp: 110, freq: 0.0014, yOffset: 0.72, width: 2.8, alpha: 0.4, color: '#6b21a8' },
      { speed: 0.0003, amp: 140, freq: 0.0009, yOffset: 0.88, width: 3.5, alpha: 0.3, color: '#4c1d95' },
    ];

    let time = 0;

    const render = () => {
      time += 1;
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      // Obsidian deep background
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // Deep atmospheric vignette
      const topRadial = ctx.createRadialGradient(
        width * 0.5, height * 0.15, 50,
        width * 0.5, height * 0.15, width * 0.55
      );
      topRadial.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
      topRadial.addColorStop(0.5, 'rgba(76, 29, 149, 0.04)');
      topRadial.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = topRadial;
      ctx.fillRect(0, 0, width, height);

      const mouseRadial = ctx.createRadialGradient(
        mouse.x, mouse.y, 10,
        mouse.x, mouse.y, 420
      );
      mouseRadial.addColorStop(0, 'rgba(168, 85, 247, 0.06)');
      mouseRadial.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = mouseRadial;
      ctx.fillRect(0, 0, width, height);

      // Render fluid neon ribbons
      ribbons.forEach((ribbon, idx) => {
        ctx.beginPath();
        const t = time * ribbon.speed;
        const centerY = height * ribbon.yOffset;
        const step = 20;

        ctx.lineWidth = ribbon.width;
        ctx.strokeStyle = ribbon.color;
        ctx.shadowColor = ribbon.color;
        ctx.shadowBlur = 18;
        ctx.globalAlpha = ribbon.alpha;

        let prevX = 0;
        let prevY = centerY;

        for (let x = -40; x <= width + 40; x += step) {
          const distToMouse = Math.hypot(x - mouse.x, centerY - mouse.y);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 320) * 28;

          const wave1 = Math.sin(x * ribbon.freq + t + idx) * ribbon.amp;
          const wave2 = Math.cos(x * ribbon.freq * 0.7 - t * 0.6) * (ribbon.amp * 0.4);
          const y = centerY + wave1 + wave2 + (mouse.y > centerY ? mouseInfluence : -mouseInfluence);

          if (x === -40) {
            ctx.moveTo(x, y);
          } else {
            const xc = (prevX + x) / 2;
            const yc = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, xc, yc);
          }
          prevX = x;
          prevY = y;
        }

        ctx.stroke();

        // Fine light specular line
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.shadowBlur = 4;
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
}
