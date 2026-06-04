"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./providers";

export default function LayoutContent({ children }) {
    const pathname = usePathname();
    const { theme, setTheme, lang, setLang, t, mounted } = useApp();

    // Prevent hydration pop-ins before mounting
    if (!mounted) {
        return (
            <div className="layout-wrapper" style={{ opacity: 0 }}>
                {children}
            </div>
        );
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const isLinkActive = (path) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="layout-wrapper">
            {/* Header Area */}
            <header className="main-header">
                <div className="header-content">
                    <Link href="/" className="logo-area">
                        <div className="logo-icon">
                            <svg viewBox="0 0 100 100" className="svg-logo">
                                <circle cx="50" cy="50" r="45" className="logo-outer-circle" />
                                <circle cx="50" cy="50" r="30" className="logo-inner-circle" />
                                <polygon points="50,15 58,40 85,42 62,56 70,82 50,65 30,82 38,56 15,42 42,40" className="logo-star" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            <h1>{t("app_title")}</h1>
                            <span>{t("app_subtitle")}</span>
                        </div>
                    </Link>

                    <nav className="desktop-nav">
                        <Link href="/" className={`nav-link ${isLinkActive("/") && !pathname.includes("upload") && !pathname.includes("settings") && !pathname.includes("artisan") ? "active" : ""}`}>
                            <i className="fa-solid fa-house"></i> {t("nav_home")}
                        </Link>
                        <Link href="/upload" className={`nav-link ${isLinkActive("/upload") ? "active" : ""}`}>
                            <i className="fa-solid fa-circle-plus"></i> {t("nav_upload")}
                        </Link>
                        <Link href="/artisan/nguyen_van_ba" className={`nav-link ${pathname.includes("artisan/nguyen_van_ba") ? "active" : ""}`}>
                            <i className="fa-solid fa-seedling"></i> {t("nav_my_garden")}
                        </Link>
                        <Link href="/settings" className={`nav-link ${isLinkActive("/settings") ? "active" : ""}`}>
                            <i className="fa-solid fa-sliders"></i> {t("nav_settings")}
                        </Link>
                    </nav>

                    <div className="header-actions">
                        {/* Language Switcher */}
                        <div className="lang-switcher">
                            <button className={`lang-btn ${lang === "vi" ? "active" : ""}`} onClick={() => setLang("vi")}>VI</button>
                            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
                            <button className={`lang-btn ${lang === "jp" ? "active" : ""}`} onClick={() => setLang("jp")}>JP</button>
                        </div>

                        {/* Theme Toggle */}
                        <button className="theme-toggle-btn" id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                        </button>

                        {/* Red Seal */}
                        <div className="viet-stamp-seal">
                            <span>{lang === "vi" ? "Hội\nQuán" : lang === "en" ? "Bonsai\nClub" : "盆栽\n会館"}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Bottom Nav (Mobile Only) */}
            <nav className="mobile-nav">
                <Link href="/" className={`mobile-nav-link ${isLinkActive("/") && !pathname.includes("upload") && !pathname.includes("settings") && !pathname.includes("artisan") ? "active" : ""}`}>
                    <i className="fa-solid fa-house"></i>
                    <span>{lang === "vi" ? "Sảnh" : lang === "en" ? "Hall" : "本館"}</span>
                </Link>
                <Link href="/upload" className={`mobile-nav-link ${isLinkActive("/upload") ? "active" : ""}`}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>{lang === "vi" ? "Đăng cây" : lang === "en" ? "Publish" : "登録"}</span>
                </Link>
                <Link href="/artisan/nguyen_van_ba" className={`mobile-nav-link ${pathname.includes("artisan/nguyen_van_ba") ? "active" : ""}`}>
                    <i className="fa-solid fa-seedling"></i>
                    <span>{lang === "vi" ? "Nhà vườn" : lang === "en" ? "Garden" : "庭園"}</span>
                </Link>
                <Link href="/settings" className={`mobile-nav-link ${isLinkActive("/settings") ? "active" : ""}`}>
                    <i className="fa-solid fa-sliders"></i>
                    <span>{lang === "vi" ? "Cài đặt" : lang === "en" ? "Settings" : "設定"}</span>
                </Link>
            </nav>
        </div>
    );
}
