"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const frameCount = 240;
  
  const currentFrame = (index: number) =>
    `/frames/frame_${(index + 1).toString().padStart(4, "0")}.webp`;

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
    
    // Set initial images even if not all loaded so it starts rendering
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let targetFrame = 0;
    let currentFrameRendered = 0;
    let animationFrameId: number;

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    };

    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScrollTop <= 0) return;

      const scrollFraction = scrollTop / maxScrollTop;
      targetFrame = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(scrollFraction * frameCount))
      );

      // Respect reduced-motion: snap straight to the frame instead of easing.
      if (prefersReducedMotion) {
        currentFrameRendered = targetFrame;
        renderFrame(targetFrame);
      }
    };

    const update = () => {
      currentFrameRendered += (targetFrame - currentFrameRendered) * 0.1;
      const frameToRender = Math.round(currentFrameRendered);

      if (images[frameToRender] && images[frameToRender].complete) {
        renderFrame(frameToRender);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const handleResize = () => {
      const frameToRender = Math.round(currentFrameRendered);
      renderFrame(frameToRender);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    // Initial render
    renderFrame(0);
    if (!prefersReducedMotion) {
      update();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [images]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center -z-10 bg-[#0a0a0a]">
      <canvas ref={canvasRef} className="max-w-[100vw] max-h-[100vh] w-full h-full object-cover" />
      {/* Balanced, subtle gradient overlays for contrast and depth without dimming the portrait */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
    </div>
  );
}
