"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./providers";
import { getDisplayAvatar, getNameInitials } from "../lib/avatar";

export default function LayoutContent({ children }) {
    const pathname = usePathname();
    const { theme, setTheme, lang, t, mounted, currentUser, logout, showToast, db } = useApp();
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
    const [mobileMenuClosing, setMobileMenuClosing] = React.useState(false);
    const mobileMenuTimerRef = React.useRef(null);
    const mobileDrawerActive = mobileMenuOpen && !mobileMenuClosing;
    const currentUserArtisan = currentUser?.artisanId ? db.artisans[currentUser.artisanId] : null;
    const currentUserName = currentUserArtisan?.name || currentUser?.name || "";
    const currentUserAvatar = getDisplayAvatar(currentUserArtisan?.avatar || currentUser?.avatar);
    const currentUserInitials = getNameInitials(currentUserName || "Bonsai Hội Quán");

    React.useEffect(() => {
        return () => {
            if (mobileMenuTimerRef.current) {
                window.clearTimeout(mobileMenuTimerRef.current);
            }
        };
    }, []);

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
            setMobileMenuClosing(false);
            showToast("Đã đăng xuất.");
        } catch (error) {
            showToast(error.message || "Không thể đăng xuất.", "error");
        }
    };

    const openMobileMenu = () => {
        if (mobileMenuTimerRef.current) {
            window.clearTimeout(mobileMenuTimerRef.current);
        }
        setMobileMenuOpen(true);
        setMobileMenuClosing(false);
    };

    const closeMobileMenu = () => {
        if (!mobileMenuOpen || mobileMenuClosing) return;
        setMobileMenuClosing(true);
        if (mobileMenuTimerRef.current) {
            window.clearTimeout(mobileMenuTimerRef.current);
        }
        mobileMenuTimerRef.current = window.setTimeout(() => {
            setMobileMenuOpen(false);
            setMobileMenuClosing(false);
        }, 320);
    };

    const toggleMobileMenu = () => {
        if (mobileDrawerActive) {
            closeMobileMenu();
            return;
        }
        openMobileMenu();
    };

    return (
        <div className={`layout-wrapper ${mobileDrawerActive ? "mobile-drawer-open" : ""}`}>
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
                                <span className={`session-avatar ${currentUserAvatar ? "has-image" : ""}`} aria-hidden="true">
                                    {currentUserAvatar ? (
                                        <img src={currentUserAvatar} alt="" />
                                    ) : (
                                        currentUserInitials
                                    )}
                                </span>
                                <span className="session-name">{currentUserName}</span>
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

                        {/* Theme Toggle */}
                        <button className="theme-toggle-btn" id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
                        </button>

                        <div className="mobile-header-menu">
                            <button
                                type="button"
                                className={`mobile-menu-trigger ${mobileMenuOpen ? "active" : ""}`}
                                onClick={toggleMobileMenu}
                                aria-label={mobileDrawerActive ? "Đóng menu" : "Mở menu"}
                                aria-expanded={mobileDrawerActive}
                                aria-controls="mobile-header-menu-panel"
                            >
                                <i className={`fa-solid ${mobileDrawerActive ? "fa-xmark" : "fa-bars"}`}></i>
                            </button>
                        </div>

                        {/* Red Seal */}
                        <div className="viet-stamp-seal">
                            <span>{lang === "vi" ? "Hội\nQuán" : lang === "en" ? "Bonsai\nClub" : "盆栽\n会館"}</span>
                        </div>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className={`mobile-menu-stage ${mobileDrawerActive ? "open" : "closing"}`}>
                    <button
                        type="button"
                        className="mobile-menu-backdrop"
                        aria-label="Đóng menu"
                        onClick={closeMobileMenu}
                    />

                    <aside className="mobile-menu-panel" id="mobile-header-menu-panel" role="dialog" aria-modal="true">
                        <div className="mobile-menu-drawer-head">
                            <div>
                                <span>Menu</span>
                                <strong>Hội Quán</strong>
                            </div>
                        </div>

                        <div className="mobile-menu-user">
                            <div className={`mobile-menu-avatar ${currentUserAvatar ? "has-image" : ""}`}>
                                {currentUserAvatar ? (
                                    <img src={currentUserAvatar} alt="" />
                                ) : (
                                    <span>{currentUserInitials}</span>
                                )}
                            </div>
                            <div className="mobile-menu-user-copy">
                                <span>{currentUser ? "Tài khoản" : "Bonsai Hội Quán"}</span>
                                <strong>{currentUserName || "Khách tham quan"}</strong>
                            </div>
                            <span className="mobile-menu-role">
                                {currentUser?.role === "ADMIN" ? "Admin" : currentUser ? "Nghệ nhân" : "Khách"}
                            </span>
                        </div>

                        <div className="mobile-menu-quick-grid">
                            <Link className="mobile-menu-quick primary" href={uploadHref} onClick={closeMobileMenu}>
                                <i className="fa-solid fa-circle-plus"></i>
                                <span>Đăng cây</span>
                            </Link>
                            {currentUser ? (
                                <Link className="mobile-menu-quick" href={accountHref} onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-user"></i>
                                    <span>Tôi</span>
                                </Link>
                            ) : (
                                <Link className="mobile-menu-quick" href="/login" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                    <span>Đăng nhập</span>
                                </Link>
                            )}
                        </div>

                        <div className="mobile-menu-section">
                            <span className="mobile-menu-section-title">Điều hướng</span>
                            <div className="mobile-menu-links">
                                <Link href="/" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-house"></i>
                                    <span>Sảnh chính</span>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </Link>
                                <Link href="/artisans" onClick={closeMobileMenu}>
                                    <i className="fa-solid fa-seedling"></i>
                                    <span>Nhà vườn</span>
                                    <i className="fa-solid fa-chevron-right"></i>
                                </Link>
                                {currentUser && (
                                    <Link href={accountHref} onClick={closeMobileMenu}>
                                        <i className="fa-solid fa-id-badge"></i>
                                        <span>Hồ sơ của tôi</span>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {currentUser?.role === "ADMIN" && (
                            <div className="mobile-menu-section">
                                <span className="mobile-menu-section-title">Quản trị</span>
                                <div className="mobile-menu-links">
                                    <Link href="/admin/moderation" onClick={closeMobileMenu}>
                                        <i className="fa-solid fa-shield-halved"></i>
                                        <span>Duyệt bài</span>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>
                                    <Link href="/admin/artisans" onClick={closeMobileMenu}>
                                        <i className="fa-solid fa-user-gear"></i>
                                        <span>Quản lý nghệ nhân</span>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>
                                    <Link href="/settings" onClick={closeMobileMenu}>
                                        <i className="fa-solid fa-sliders"></i>
                                        <span>Cài đặt hệ thống</span>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {!currentUser && (
                            <div className="mobile-menu-section">
                                <span className="mobile-menu-section-title">Tài khoản</span>
                                <div className="mobile-menu-links">
                                    <Link href="/register" onClick={closeMobileMenu}>
                                        <i className="fa-solid fa-user-plus"></i>
                                        <span>Đăng ký nghệ nhân</span>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {currentUser && (
                            <button type="button" className="mobile-menu-logout" onClick={handleLogout}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                <span>Đăng xuất</span>
                            </button>
                        )}
                    </aside>
                </div>
            )}

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
