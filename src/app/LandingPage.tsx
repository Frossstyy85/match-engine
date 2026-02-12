"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
    const heroRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Subtle mouse parallax on the background image
    useEffect(() => {
        const hero = heroRef.current;
        const bg = bgRef.current;
        if (!hero || !bg) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xOffset = ((clientX - innerWidth / 2) / innerWidth) * 20;
            const yOffset = ((clientY - innerHeight / 2) / innerHeight) * 20;
            bg.style.transform = `translate(${-xOffset}px, ${-yOffset}px) scale(1.05)`;
        };

        hero.addEventListener("mousemove", handleMouseMove);
        return () => hero.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative">
            {/* ── Navbar ── */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 border-b border-white/10"
                style={{
                    animation: "nav-slide-down 0.6s ease-out both",
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-white font-bold text-xl tracking-tight">
                        Match Engine
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-8">
                        <a
                            href="#about"
                            className="relative text-gray-300 text-sm font-medium transition-all duration-200 hover:text-white hover:scale-105 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            About
                        </a>
                        <Link
                            href="/dashboard"
                            className="relative text-gray-300 text-sm font-medium transition-all duration-200 hover:text-white hover:scale-105 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/auth/login"
                            className="relative text-gray-300 text-sm font-medium transition-all duration-200 hover:text-white hover:scale-105 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold transition-all duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section
                ref={heroRef}
                className="relative h-screen w-full overflow-hidden flex items-center justify-center"
            >
                {/* Background image layer (parallax target) */}
                <div
                    ref={bgRef}
                    className="absolute inset-[-20px] transition-transform duration-200 ease-out"
                    style={{
                        backgroundImage: "url('/bg1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: "scale(1.05)",
                    }}
                />

                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Hero content */}
                <div className="relative z-10 text-center flex flex-col items-center gap-6">
                    {/* Frosted glass panel */}
                    <div
                        className={`
                            px-16 py-12 rounded-2xl
                            backdrop-blur-xl bg-white/10 border border-white/20
                            shadow-2xl shadow-black/20
                            ${mounted ? "opacity-100" : "opacity-0"}
                        `}
                        style={{
                            animation: mounted
                                ? "welcome-pop 1.4s cubic-bezier(0.16, 1, 0.3, 1) both"
                                : "none",
                        }}
                    >
                        {/* "Welcome" with gradient text */}
                        <h1 className="text-7xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-400 leading-tight">
                            Welcome
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="mt-4 text-lg md:text-xl text-gray-300 font-medium max-w-md"
                            style={{
                                animation: mounted
                                    ? "welcome-subtitle 1s ease-out 0.5s both"
                                    : "none",
                            }}
                        >
                            Match people and skills to projects.
                        </p>

                        {/* CTA buttons */}
                        <div
                            className="mt-8 flex gap-4 justify-center"
                            style={{
                                animation: mounted
                                    ? "welcome-subtitle 1s ease-out 0.8s both"
                                    : "none",
                            }}
                        >
                            <Link
                                href="/auth/login"
                                className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold text-base transition-all duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                            >
                                Get started
                            </Link>
                            <a
                                href="#about"
                                className="px-8 py-3 rounded-xl border border-white/30 text-white font-semibold text-base backdrop-blur-sm bg-white/5 transition-all duration-200 hover:bg-white/15 hover:scale-105"
                            >
                                Learn more
                            </a>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div
                        className="mt-8 text-white/60"
                        style={{
                            animation: mounted
                                ? "float 3s ease-in-out infinite, welcome-subtitle 1s ease-out 1.2s both"
                                : "none",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 5v14" />
                            <path d="m19 12-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* ── About Section ── */}
            <section
                id="about"
                className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
            >
                {/* Background: same image, fixed for continuity */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "url('/bg1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />

                {/* About content – glassmorphism card */}
                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl shadow-black/20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            About{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
                                Match Engine
                            </span>
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Match Engine is a modern staffing and project management tool that
                            connects the right people with the right projects. By mapping
                            skills, availability, and team needs, it takes the guesswork out of
                            resource allocation.
                        </p>
                        <p className="text-gray-400 text-base leading-relaxed mb-8">
                            Whether you are an HR lead optimizing staffing levels, a project
                            manager building your dream team, or an employee exploring new
                            opportunities &mdash; Match Engine has you covered.
                        </p>

                        {/* Feature highlights */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-200 hover:bg-white/10 hover:scale-[1.02]">
                                <h3 className="text-white font-semibold text-base mb-2">
                                    Skill Matching
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Automatically match team members to projects based on their
                                    skill profiles.
                                </p>
                            </div>
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-200 hover:bg-white/10 hover:scale-[1.02]">
                                <h3 className="text-white font-semibold text-base mb-2">
                                    Team Management
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Organize teams, assign leads, and track project progress in
                                    one place.
                                </p>
                            </div>
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-200 hover:bg-white/10 hover:scale-[1.02]">
                                <h3 className="text-white font-semibold text-base mb-2">
                                    Role Dashboards
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Tailored views for admins, HR, project leads, and individual
                                    contributors.
                                </p>
                            </div>
                        </div>

                        {/* Final CTA */}
                        <div className="mt-10 text-center">
                            <Link
                                href="/auth/signup"
                                className="inline-block px-10 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base transition-all duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                            >
                                Get started for free
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
