"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Building2, Menu, X, Sun, Moon } from "lucide-react";

export default function LandingNavbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Prevent hydration mismatch for theme toggle
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (id.startsWith('/')) return; // let Next.js handle it if it's a route
        e.preventDefault();
        setMobileMenuOpen(false);
        const element = document.getElementById(id.substring(1));
        if (element) {
            const offset = 80; // navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };



    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800" : "bg-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-xl font-bold ${isScrolled ? "text-slate-800 dark:text-white" : "text-white"}`}>PropertyFlow CRM</span>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-6">
                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-white/80 hover:bg-white/10'}`}
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <div className="flex items-center gap-4">
                        <Link
                            href="/demo-login"
                            className={`text-sm font-medium transition-colors ${isScrolled ? "text-slate-700 dark:text-slate-200" : "text-white/90"} hover:text-indigo-600 dark:hover:text-indigo-400`}
                        >
                            Demo CRM
                        </Link>
                        <a
                            href="#contact-form"
                            onClick={(e) => scrollToSection(e, "#contact-form")}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-colors shadow-sm"
                        >
                            Book Consultation
                        </a>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={`p-2 ${isScrolled ? "text-slate-500" : "text-white/80"}`}
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 -mr-2 ${isScrolled ? "text-slate-600 dark:text-slate-300" : "text-white"}`}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center py-6 px-6 gap-6">
                    <div className="flex flex-col gap-4 w-full mt-2">
                        <Link
                            href="/demo-login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            View Demo
                        </Link>
                        <a
                            href="#contact-form"
                            onClick={(e) => scrollToSection(e, "#contact-form")}
                            className="w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md"
                        >
                            Request Demo
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
