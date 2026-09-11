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

    let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };

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

    // Ribbons definition for fluid obsidian & purple turbulence
    const ribbons = [
      { baseHue: 275, speed: 0.0006, amp: 140, freq: 0.0018, yOffset: 0.2, width: 3.5, alpha: 0.65, glow: '#c084fc' },
      { baseHue: 290, speed: 0.0008, amp: 190, freq: 0.0014, yOffset: 0.35, width: 4.0, alpha: 0.55, glow: '#e879f9' },
      { baseHue: 260, speed: 0.0005, amp: 220, freq: 0.0022, yOffset: 0.5, width: 5.0, alpha: 0.75, glow: '#a855f7' },
      { baseHue: 305, speed: 0.0007, amp: 160, freq: 0.0016, yOffset: 0.65, width: 3.0, alpha: 0.5, glow: '#f43f5e' },
      { baseHue: 250, speed: 0.0004, amp: 260, freq: 0.0011, yOffset: 0.8, width: 6.0, alpha: 0.8, glow: '#7c3aed' },
      { baseHue: 280, speed: 0.0009, amp: 130, freq: 0.0025, yOffset: 0.9, width: 2.5, alpha: 0.6, glow: '#d8b4fe' },
    ];

    let time = 0;

    const render = () => {
      time += 1;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Dark Obsidian clear with subtle fading trail
      ctx.fillStyle = '#05040a';
      ctx.fillRect(0, 0, width, height);

      // Deep atmospheric ambient radial gradients
      const bgGrad1 = ctx.createRadialGradient(
        width * 0.75, height * 0.25, 50,
        width * 0.75, height * 0.25, width * 0.6
      );
      bgGrad1.addColorStop(0, 'rgba(109, 40, 217, 0.16)');
      bgGrad1.addColorStop(0.5, 'rgba(59, 7, 100, 0.08)');
      bgGrad1.addColorStop(1, 'rgba(5, 4, 10, 0)');
      ctx.fillStyle = bgGrad1;
      ctx.fillRect(0, 0, width, height);

      const bgGrad2 = ctx.createRadialGradient(
        mouse.x, mouse.y, 20,
        mouse.x, mouse.y, 400
      );
      bgGrad2.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
      bgGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGrad2;
      ctx.fillRect(0, 0, width, height);

      // Draw undulating fluid luminous ribbons
      ribbons.forEach((ribbon, idx) => {
        ctx.beginPath();
        const t = time * ribbon.speed;
        const centerY = height * ribbon.yOffset;
        const step = 25;

        ctx.lineWidth = ribbon.width;
        ctx.strokeStyle = ribbon.glow;
        ctx.shadowColor = ribbon.glow;
        ctx.shadowBlur = 24;

        let prevX = 0;
        let prevY = centerY;

        for (let x = -50; x <= width + 50; x += step) {
          // Double sine wave + mouse turbulence perturbation
          const distToMouse = Math.hypot(x - mouse.x, centerY - mouse.y);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 380) * 45;

          const wave1 = Math.sin(x * ribbon.freq + t + idx) * ribbon.amp;
          const wave2 = Math.cos(x * ribbon.freq * 0.6 - t * 0.8) * (ribbon.amp * 0.45);
          const wave3 = Math.sin((x + centerY) * 0.003 + t * 1.5) * 20;

          const y = centerY + wave1 + wave2 + wave3 + (mouse.y > centerY ? mouseInfluence : -mouseInfluence);

          if (x === -50) {
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

        // Secondary glow pass for neon sheen
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 8;
        ctx.stroke();
      });

      // Reset shadow blur
      ctx.shadowBlur = 0;

      // Subtle particle mist
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
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
