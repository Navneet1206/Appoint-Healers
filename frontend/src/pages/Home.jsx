"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------
   ParticleAnimation: Pink particle background
------------------------------------------------------------------ */
export function ParticleAnimation({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId;

    // Pastel pink colors
    const colors = ["#FFC0CB", "#FFB6C1", "#F8E0E0", "#FFD1DC", "#FFDAE0"];
    let particles = [];

    // Create particles based on screen size
    function createParticles() {
      const particleCount = Math.min(Math.floor((width * height) / 15000), 100);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      createParticles();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update particle positions
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw each particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${particle.opacity})`);
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 182, 193, ${0.1 * (1 - distance / 100)
              })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className || ""}`}
      style={{ pointerEvents: "none" }}
    />
  );
}

/* ------------------------------------------------------------------
   Simple fade-in animation with Framer Motion
------------------------------------------------------------------ */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

/* ------------------------------------------------------------------
   Home: Main Landing Page
------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
    <div className="relative min-h-screen bg-pink-100 overflow-hidden w-full">
      {/* Background Particle Animation */}
      <ParticleAnimation />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="mx-auto py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            {/* Left Side: Text + Badge + CTA */}
            <div className="flex flex-col space-y-4">
              {/* Badge */}
              <span className="inline-block border border-pink-200 text-pink-600 text-sm font-medium px-3 py-1 rounded-full w-fit">
                Mental Health Support
              </span>
              {/* Heading */}
              <h1 className="text-5xl font-bold text-pink-800 leading-tight">
                Find Your Perfect Mental Health Professional
              </h1>
              {/* Subheading */}
              <p className="text-gray-700">
                Connect with psychiatrists, relationship counselors, and active
                listeners who can help you navigate life's challenges.
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                <a
                  href="/professionals"
                  className="bg-pink-500 text-white rounded px-6 py-3 text-center hover:bg-pink-600 transition-colors"
                >
                  Explore Professionals
                </a>
                <a
                  href="/how-it-works"
                  className="border border-pink-500 text-pink-500 rounded px-6 py-3 text-center hover:bg-pink-50 transition-colors"
                >
                  How It Works
                </a>
              </div>
              {/* Small statistic row */}
              <div className="flex items-center gap-2 pt-3">
                {/* Four placeholder circles (like user avatars) */}
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-pink-300"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">1,000+</span> people found
                  their match this month
                </p>
              </div>
            </div>

            {/* Right Side: White Card (Image Placeholder) */}
            <div className="flex items-center justify-center">
              <div className="bg-white w-full h-80 md:h-80 rounded-lg shadow flex items-center justify-center">
                <span className="text-gray-400">[ Image Placeholder ]</span>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
        {/* OUR SERVICES SECTION */}
        <section className="mx-auto px-4 pb-16 bg-pink-50 w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-pink-800 p-16">
              Our Services
            </h2>
            <p className="mt-2 text-gray-700">
              We provide professional support in multiple areas of mental health.
            </p>
          </div>

          <div  className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Service Card 1 */}
            <div className="bg-white border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-pink-800">Counseling</h3>
              <p className="mt-2 text-gray-600">
                Personalized counseling sessions to help you navigate life's
                challenges.
              </p>
            </div>
            {/* Service Card 2 */}
            <div className="bg-white border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-pink-800">Therapy</h3>
              <p className="mt-2 text-gray-600">
                Expert therapy sessions for mental, emotional, and relational
                well-being.
              </p>
            </div>
            {/* Service Card 3 */}
            <div className="bg-white border p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-pink-800">Psychiatry</h3>
              <p className="mt-2 text-gray-600">
                Professional psychiatric support with a focus on comprehensive
                care.
              </p>
            </div>
          </div>
        </section>
    </>
  );
}
