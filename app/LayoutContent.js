"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./providers";

export default function LayoutContent({ children }) {
    const pathname = usePathname();
    const { theme, setTheme, lang, setLang, t, mounted, currentUser, logout, showToast } = useApp();
    const uploadHref = currentUser ? "/upload" : "/login?next=/upload";
    const gardenHref = currentUser?.artisanId ? `/artisan/${currentUser.artisanId}` : "";
    const isRegisterPage = pathname === "/register";
    const isLoginPage = pathname === "/login";
    const isAuthPage = isRegisterPage || isLoginPage;
    const accountHref = gardenHref || "/";
    const authNavHref = isRegisterPage ? "/register" : "/login";
    const authNavIcon = isRegisterPage ? "fa-user-plus" : "fa-user-lock";
    const authNavLabel = isRegisterPage
        ? (lang === "vi" ? "Đăng ký" : lang === "en" ? "Register" : "登録")
        : (lang === "vi" ? "Đăng nhập" : lang === "en" ? "Login" : "ログイン");
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

    const handleLogout = async () => {
        try {
            await logout();
            setMobileMenuOpen(false);
            showToast("Đã đăng xuất.");
        } catch (error) {
            showToast(error.message || "Không thể đăng xuất.", "error");
        }
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
                        <Link href="/" className={`nav-link ${isLinkActive("/") && !pathname.includes("upload") && !pathname.includes("settings") && !pathname.includes("artisan") && !pathname.includes("admin") ? "active" : ""}`}>
                            <i className="fa-solid fa-house"></i> {t("nav_home")}
                        </Link>
                        <Link href={uploadHref} className={`nav-link ${isLinkActive("/upload") ? "active" : ""}`}>
                            <i className="fa-solid fa-circle-plus"></i> {t("nav_upload")}
                        </Link>
                        {gardenHref && (
                            <Link href={gardenHref} className={`nav-link ${pathname === gardenHref ? "active" : ""}`}>
                                <i className="fa-solid fa-seedling"></i> {t("nav_my_garden")}
                            </Link>
                        )}
                        {currentUser?.role === "ADMIN" && (
                            <Link href="/settings" className={`nav-link ${isLinkActive("/settings") ? "active" : ""}`}>
                                <i className="fa-solid fa-sliders"></i> {t("nav_settings")}
                            </Link>
                        )}
                    </nav>

                    <div className="header-actions">
                        {currentUser?.role === "ADMIN" && (
                            <Link
                                href="/admin/moderation"
                                className={`admin-quick-link ${isLinkActive("/admin") ? "active" : ""}`}
                                title={t("nav_admin") || "Quản trị"}
                                aria-label={t("nav_admin") || "Quản trị"}
                            >
                                <i className="fa-solid fa-shield-halved"></i>
                                <span>{t("nav_admin") || "Quản trị"}</span>
                            </Link>
                        )}

                        {currentUser ? (
                            <div className="session-chip">
                                <span className="session-name">{currentUser.name}</span>
                                <button onClick={handleLogout} title="Đăng xuất" aria-label="Đăng xuất">
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="auth-links">
                                <Link href="/login" className={pathname === "/login" ? "active" : ""}>Đăng nhập</Link>
                                <Link href="/register" className={pathname === "/register" ? "active" : ""}>Đăng ký</Link>
                            </div>
                        )}

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

                        <div className="mobile-header-menu">
                            <button
                                type="button"
                                className={`mobile-menu-trigger ${mobileMenuOpen ? "active" : ""}`}
                                onClick={() => setMobileMenuOpen(prev => !prev)}
                                aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
                                aria-expanded={mobileMenuOpen}
                                aria-controls="mobile-header-menu-panel"
                            >
                                <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
                            </button>

                            {mobileMenuOpen && (
                                <div className="mobile-menu-panel" id="mobile-header-menu-panel">
                                    {currentUser ? (
                                        <div className="mobile-menu-user">
                                            <span>Tài khoản</span>
                                            <strong>{currentUser.name}</strong>
                                        </div>
                                    ) : (
                                        <div className="mobile-menu-user">
                                            <span>Bonsai Hội Quán</span>
                                            <strong>Khách tham quan</strong>
                                        </div>
                                    )}

                                    <div className="mobile-menu-links">
                                        <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                            <i className="fa-solid fa-house"></i>
                                            <span>Sảnh chính</span>
                                        </Link>
                                        <Link href={uploadHref} onClick={() => setMobileMenuOpen(false)}>
                                            <i className="fa-solid fa-circle-plus"></i>
                                            <span>Đăng cây cảnh</span>
                                        </Link>
                                        <Link href="/artisans" onClick={() => setMobileMenuOpen(false)}>
                                            <i className="fa-solid fa-seedling"></i>
                                            <span>Nhà vườn</span>
                                        </Link>
                                        {currentUser && (
                                            <Link href={accountHref} onClick={() => setMobileMenuOpen(false)}>
                                                <i className="fa-solid fa-user"></i>
                                                <span>Tôi</span>
                                            </Link>
                                        )}
                                        {currentUser?.role === "ADMIN" && (
                                            <>
                                                <Link href="/settings" onClick={() => setMobileMenuOpen(false)}>
                                                    <i className="fa-solid fa-sliders"></i>
                                                    <span>Cài đặt</span>
                                                </Link>
                                                <Link href="/admin/moderation" onClick={() => setMobileMenuOpen(false)}>
                                                    <i className="fa-solid fa-shield-halved"></i>
                                                    <span>Duyệt bài</span>
                                                </Link>
                                                <Link href="/admin/artisans" onClick={() => setMobileMenuOpen(false)}>
                                                    <i className="fa-solid fa-user-gear"></i>
                                                    <span>Quản lý nghệ nhân</span>
                                                </Link>
                                            </>
                                        )}
                                        {!currentUser && (
                                            <>
                                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                                    <i className="fa-solid fa-right-to-bracket"></i>
                                                    <span>Đăng nhập</span>
                                                </Link>
                                                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                                    <i className="fa-solid fa-user-plus"></i>
                                                    <span>Đăng ký nghệ nhân</span>
                                                </Link>
                                            </>
                                        )}
                                    </div>

                                    {currentUser && (
                                        <button type="button" className="mobile-menu-logout" onClick={handleLogout}>
                                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            <span>Đăng xuất</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

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
            {!isAuthPage && <nav className="mobile-nav">
                <Link href="/" className={`mobile-nav-link ${isLinkActive("/") && !pathname.includes("upload") && !pathname.includes("settings") && !pathname.includes("artisan") && !pathname.includes("admin") ? "active" : ""}`}>
                    <i className="fa-solid fa-house"></i>
                    <span>{lang === "vi" ? "Sảnh" : lang === "en" ? "Hall" : "本館"}</span>
                </Link>
                <Link href={uploadHref} className={`mobile-nav-link ${isLinkActive("/upload") ? "active" : ""}`}>
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>{lang === "vi" ? "Đăng cây" : lang === "en" ? "Publish" : "登録"}</span>
                </Link>
                <Link href="/artisans" className={`mobile-nav-link ${isLinkActive("/artisans") ? "active" : ""}`}>
                    <i className="fa-solid fa-seedling"></i>
                    <span>{lang === "vi" ? "Nhà vườn" : lang === "en" ? "Garden" : "庭園"}</span>
                </Link>
                {currentUser?.role === "ADMIN" && (
                    <Link href="/settings" className={`mobile-nav-link ${isLinkActive("/settings") ? "active" : ""}`}>
                        <i className="fa-solid fa-sliders"></i>
                        <span>{lang === "vi" ? "Cài đặt" : lang === "en" ? "Settings" : "設定"}</span>
                    </Link>
                )}
                {currentUser?.role === "ADMIN" ? (
                    <Link href="/admin/moderation" className={`mobile-nav-link ${isLinkActive("/admin") ? "active" : ""}`}>
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>{lang === "vi" ? "Duyệt" : lang === "en" ? "Review" : "審査"}</span>
                    </Link>
                ) : currentUser ? (
                    <Link href={accountHref} className={`mobile-nav-link ${gardenHref && pathname === gardenHref ? "active" : ""}`}>
                        <i className="fa-solid fa-user"></i>
                        <span>{lang === "vi" ? "Tôi" : lang === "en" ? "Me" : "私"}</span>
                    </Link>
                ) : (
                    <Link href={authNavHref} className={`mobile-nav-link ${isLoginPage || isRegisterPage ? "active" : ""}`}>
                        <i className={`fa-solid ${authNavIcon}`}></i>
                        <span>{authNavLabel}</span>
                    </Link>
                )}
            </nav>}
        </div>
    );
}
