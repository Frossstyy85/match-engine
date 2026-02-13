"use client"

import {useEffect, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const description = "";

export default function Home() {

    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="min-h-screen">
            <nav
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 md:py-4 transition-all duration-300 ${
                    scrolled
                        ? "bg-background/80 backdrop-blur-sm border-b border-border"
                        : "bg-transparent"
                }`}
                style={{ animation: "nav-slide-down 0.6s ease-out forwards" }}
            >
                <span className="text-lg font-bold text-foreground">
                    <a href={"#"}> Match Engine </a>
                </span>
                <div className="flex items-center gap-3 sm:gap-6">
                    <a
                        href="#about"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </a>
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Dashboard
                    </Link>
                </div>
            </nav>

            <section className="flex flex-col items-center justify-center min-h-screen gap-6">
                <h1
                    className="text-5xl md:text-7xl font-bold text-foreground opacity-0"
                    style={{ animation: "welcome-pop 1s ease-out 0.3s forwards" }}
                >
                    Welcome
                </h1>
                <div
                    className="opacity-0"
                    style={{ animation: "welcome-subtitle 0.8s ease-out 0.9s forwards" }}
                >
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/dashboard">View Dashboard</Link>
                    </Button>
                </div>
            </section>

            <section
                id="about"
                className="flex flex-col items-center justify-center min-h-[50vh] px-4 sm:px-6 md:px-8 py-16 md:py-24"
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8">
                    About
                </h2>
                <div className="max-w-xl w-full rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm mx-2">
                    <p className="text-muted-foreground leading-relaxed text-center">
                        {description}
                    </p>
                </div>
            </section>
        </div>
    )
}
