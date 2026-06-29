"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "./providers";
import { getDisplayAvatar, getNameInitials } from "../lib/avatar";
import { matchesSearch, normalizeSearchText } from "../lib/home-search";

export default function Home() {
    const { db, t, localize } = useApp();
    const [searchVal, setSearchVal] = useState("");
    const [activeStyle, setActiveStyle] = useState("all");
    const [activeSize, setActiveSize] = useState("all");
    const hasSearch = normalizeSearchText(searchVal).length > 0;

    // Localized statuses helper
    const getStatusText = (status) => {
        if (status === "Trưng bày") return t("status_exhibit");
        if (status === "Đang giao lưu") return t("status_sale");
        return t("status_training");
    };

    // Filter logic
    const filteredTrees = db.trees.filter(tree => {
        // Only show approved trees on home page
        if (!tree.approved) return false;

        // Filter by style
        if (activeStyle !== "all" && tree.style !== activeStyle) return false;

        // Filter by size
        if (activeSize !== "all" && tree.size !== activeSize) return false;

        if (!matchesTreeSearch(tree)) {
            return false;
        }

        return true;
    });
    const visibleArtisans = getVisibleArtisans();
    const totalSearchResults = visibleArtisans.length + filteredTrees.length;

    function handleSearchSubmit(event) {
        event.preventDefault();
        document.getElementById("home-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div>
            {/* Hero Search Banner */}
            <div className="hero-banner">
                <div className="hero-overlay"></div>
                <div className="hero-text-content">
                    <h2>{t("hero_title")}</h2>
                    <p>{t("hero_subtitle")}</p>
                    
                    {/* Search Bar */}
                    <form className="search-container" onSubmit={handleSearchSubmit} role="search">
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                        <input 
                            type="text" 
                            placeholder={t("search_placeholder")}
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            aria-label="Tìm kiếm tác phẩm, dáng thế, nghệ nhân hoặc địa phương"
                        />
                        <button type="submit">{t("search_btn")}</button>
                    </form>
                </div>
                {/* Traditional Clouds SVGs */}
                <div className="cloud-pattern cloud-1"></div>
                <div className="cloud-pattern cloud-2"></div>
            </div>

            {/* Quick Filters */}
            <div className="filter-section">
                <div className="filter-group">
                    <h3>{t("filter_style_title")}</h3>
                    <div className="filter-chips">
                        <button className={`chip ${activeStyle === "all" ? "active" : ""}`} onClick={() => setActiveStyle("all")}>{t("filter_all_styles")}</button>
                        <button className={`chip ${activeStyle === "Trực" ? "active" : ""}`} onClick={() => setActiveStyle("Trực")}>{langStyle("Trực")}</button>
                        <button className={`chip ${activeStyle === "Trực Lắc" ? "active" : ""}`} onClick={() => setActiveStyle("Trực Lắc")}>{langStyle("Trực Lắc")}</button>
                        <button className={`chip ${activeStyle === "Huyền / Thác Đổ" ? "active" : ""}`} onClick={() => setActiveStyle("Huyền / Thác Đổ")}>{langStyle("Huyền / Thác Đổ")}</button>
                        <button className={`chip ${activeStyle === "Hoành" ? "active" : ""}`} onClick={() => setActiveStyle("Hoành")}>{langStyle("Hoành")}</button>
                        <button className={`chip ${activeStyle === "Xiêu / Tà" ? "active" : ""}`} onClick={() => setActiveStyle("Xiêu / Tà")}>{langStyle("Xiêu / Tà")}</button>
                        <button className={`chip ${activeStyle === "Bạt Phong" ? "active" : ""}`} onClick={() => setActiveStyle("Bạt Phong")}>{langStyle("Bạt Phong")}</button>
                    </div>
                </div>

                <div className="filter-group">
                    <h3>{t("filter_size_title")}</h3>
                    <div className="filter-chips">
                        <button className={`chip ${activeSize === "all" ? "active" : ""}`} onClick={() => setActiveSize("all")}>{t("filter_all_sizes")}</button>
                        <button className={`chip ${activeSize === "Siêu Mini" ? "active" : ""}`} onClick={() => setActiveSize("Siêu Mini")}>{langSize("Siêu Mini")}</button>
                        <button className={`chip ${activeSize === "Mini" ? "active" : ""}`} onClick={() => setActiveSize("Mini")}>{langSize("Mini")}</button>
                        <button className={`chip ${activeSize === "Trung" ? "active" : ""}`} onClick={() => setActiveSize("Trung")}>{langSize("Trung")}</button>
                        <button className={`chip ${activeSize === "Đại" ? "active" : ""}`} onClick={() => setActiveSize("Đại")}>{langSize("Đại")}</button>
                        <button className={`chip ${activeSize === "Cổ Thụ" ? "active" : ""}`} onClick={() => setActiveSize("Cổ Thụ")}>{langSize("Cổ Thụ")}</button>
                    </div>
                </div>
            </div>

            <div id="home-results">
                {hasSearch && (
                    <div className="search-results-summary">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>
                            Tìm thấy <strong>{totalSearchResults}</strong> kết quả cho <strong>&quot;{searchVal.trim()}&quot;</strong>
                        </span>
                    </div>
                )}
            </div>

            {/* Section: Featured Artisans */}
            <div className="section-container">
                <div className="section-title-wrap">
                    <h2 className="section-title">
                        <i className="fa-solid fa-award"></i>
                        {t("section_artisans")}
                    </h2>
                    <Link href="/artisans" className="section-view-all">
                        Xem tất cả nhà vườn <i className="fa-solid fa-angle-right"></i>
                    </Link>
                </div>
                
                <div className="featured-artisan-list">
                    {visibleArtisans.length === 0 ? (
                        <div className="no-results-card home-search-empty">
                            <i className="fa-solid fa-user-magnifying-glass text-secondary" style={{ fontSize: "2.2rem", marginBottom: "12px", display: "block" }}></i>
                            <p>Không tìm thấy nghệ nhân phù hợp với từ khóa hiện tại.</p>
                        </div>
                    ) : visibleArtisans.map(({ artisan, source }) => {
                        const ownerTrees = db.trees.filter(t => t.ownerId === artisan.id && t.approved);
                        const totalTrees = ownerTrees.length;
                        const forSale = ownerTrees.filter(t => t.status === "Đang giao lưu").length;
                        const artisanAvatar = getDisplayAvatar(artisan.avatar);

                        return (
                            <Link href={`/artisan/${artisan.id}`} key={artisan.id} className="featured-artisan-card">
                                <div
                                    className="featured-artisan-cover"
                                    style={{ backgroundImage: `url('${artisan.cover}')` }}
                                >
                                    <div className={`featured-artisan-avatar ${artisanAvatar ? "has-image" : ""}`}>
                                        {artisanAvatar ? (
                                            <img src={artisanAvatar} alt={artisan.name} />
                                        ) : (
                                            <span>{getNameInitials(artisan.name)}</span>
                                        )}
                                        <span
                                            className={`avatar-featured-badge ${source === "pinned" ? "pinned" : ""}`}
                                            aria-label={source === "pinned" ? "Tiêu biểu" : "Hoạt động nổi bật"}
                                            title={source === "pinned" ? "Tiêu biểu" : "Hoạt động nổi bật"}
                                        >
                                            <i className="fa-solid fa-award"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="featured-artisan-content">
                                    <div className="featured-artisan-copy">
                                        <h3>{artisan.name}</h3>
                                        <p><i className="fa-solid fa-location-dot"></i> {localize(artisan.address)}</p>
                                    </div>
                                    <div className="featured-artisan-stats">
                                        <span>Toàn vườn: <strong>{totalTrees}</strong></span>
                                        <span>Giao lưu: <strong>{forSale}</strong></span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Section: Recent Trees (Showcases) */}
            <div className="section-container">
                <div className="section-title-wrap">
                    <h2 className="section-title">
                        <i className="fa-solid fa-tree"></i>
                        {t("section_trees")}
                    </h2>
                </div>
                
                <div className="trees-grid">
                    {filteredTrees.length === 0 ? (
                        <div className="no-results-card">
                            <i className="fa-solid fa-wind text-secondary" style={{ fontSize: "2.5rem", marginBottom: "12px", display: "block" }}></i>
                            <p>{t("filter_empty") || "Không tìm thấy tác phẩm nào phù hợp với bộ lọc hiện tại."}</p>
                        </div>
                    ) : (
                        filteredTrees.map(tree => {
                            const owner = db.artisans[tree.ownerId] || { name: "Ẩn danh" };
                            let statusClass = "training";
                            if (tree.status === "Đang giao lưu") statusClass = "sale";
                            else if (tree.status === "Trưng bày") statusClass = "exhibit";

                            const priceText = getTreePriceText(tree);

                            return (
                                <Link href={`/tree/${tree.id}`} key={tree.id} className="tree-card">
                                    <div className="tree-card-img-wrap">
                                        <img src={tree.images[0]} alt={localize(tree.title)} className="tree-card-img" />
                                        <span className={`tree-status-tag ${statusClass}`}>{getStatusText(tree.status)}</span>
                                    </div>
                                    <div className="tree-card-content">
                                        <div className="tree-card-owner">
                                            <i className="fa-solid fa-seedling"></i>
                                            <span>{t("owner_prefix")}<strong>{owner.name}</strong></span>
                                        </div>
                                        <h3 className="tree-card-title">{localize(tree.title)}</h3>
                                        <div className="tree-card-specs">
                                            <span className="spec-tag">{localize(tree.species)}</span>
                                            <span className="spec-tag">{langStyle(tree.style)}</span>
                                            <span className="spec-tag">{langSize(tree.size)}</span>
                                        </div>
                                        <div className="tree-card-footer">
                                            <span className={`tree-card-price ${tree.status !== 'Đang giao lưu' ? 'contact' : ''}`}>{priceText}</span>
                                            <button className="tree-card-btn">{t("detail_back") === "Back" ? "View Details" : t("detail_back") === "戻る" ? "詳細を見る" : "Xem chi tiết"} <i className="fa-solid fa-angle-right"></i></button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );

    // Helpers to translate styles & sizes dynamically
    function langStyle(style) {
        if (style === "Trực") return t("style_formal") || (t("detail_back") === "Back" ? "Formal Upright" : t("detail_back") === "戻る" ? "直幹" : "Dáng Trực");
        if (style === "Trực Lắc") return t("style_informal") || (t("detail_back") === "Back" ? "Informal Upright" : t("detail_back") === "戻る" ? "模様木" : "Trực Lắc");
        if (style === "Huyền / Thác Đổ") return t("style_cascade") || (t("detail_back") === "Back" ? "Cascade" : t("detail_back") === "戻る" ? "懸崖" : "Thác Đổ (Huyền)");
        if (style === "Hoành") return t("style_semi_cascade") || (t("detail_back") === "Back" ? "Semi-cascade" : t("detail_back") === "戻る" ? "斜幹" : "Dáng Hoành");
        if (style === "Xiêu / Tà") return t("style_slanting") || (t("detail_back") === "Back" ? "Slanting" : t("detail_back") === "戻る" ? "吹流し" : "Dáng Xiêu");
        if (style === "Bạt Phong") return t("style_windswept") || (t("detail_back") === "Back" ? "Windswept" : t("detail_back") === "戻る" ? "風化" : "Bạt Phong");
        return style;
    }

    function langSize(size) {
        if (size === "Siêu Mini") return t("detail_back") === "Back" ? "Keshitsubo (<10cm)" : t("detail_back") === "戻る" ? "豆盆栽 (<10cm)" : "Siêu Mini (<10cm)";
        if (size === "Mini") return t("detail_back") === "Back" ? "Shohin (10-25cm)" : t("detail_back") === "戻る" ? "ミニ盆栽 (10-25cm)" : "Mini (10-25cm)";
        if (size === "Trung") return t("detail_back") === "Back" ? "Medium (25-60cm)" : t("detail_back") === "戻る" ? "中品盆栽 (25-60cm)" : "Cỡ Trung (25-60cm)";
        if (size === "Đại") return t("detail_back") === "Back" ? "Large (60-120cm)" : t("detail_back") === "戻る" ? "大物盆栽 (60-120cm)" : "Cỡ Đại (60-120cm)";
        if (size === "Cổ Thụ") return t("detail_back") === "Back" ? "Imperial (>120cm)" : t("detail_back") === "戻る" ? "巨大盆栽 (>120cm)" : "Cổ Thụ (>120cm)";
        return size;
    }

    function getTreePriceText(tree) {
        if (tree.status === "Đang giao lưu") {
            return tree.price ? `${parseInt(tree.price).toLocaleString('vi-VN')} đ` : t("detail_price_contact");
        }
        if (tree.status === "Trưng bày") return t("detail_price_exhibit");
        return t("detail_price_training");
    }

    function matchesTreeSearch(tree) {
        const owner = db.artisans[tree.ownerId] || {};
        return matchesSearch([
            localize(tree.title),
            localize(tree.species),
            localize(tree.style),
            langStyle(tree.style),
            localize(tree.size),
            langSize(tree.size),
            tree.status,
            getStatusText(tree.status),
            getTreePriceText(tree),
            owner.name,
            localize(owner.rank),
            localize(owner.address),
            localize(owner.bio),
            "tác phẩm",
            "bonsai",
        ], searchVal);
    }

    function getVisibleArtisans() {
        if (!hasSearch) return getFeaturedArtisans();

        return Object.values(db.artisans || {})
            .map((artisan) => ({
                artisan,
                source: artisan.featuredOverride ? "pinned" : "auto",
            }))
            .filter(({ artisan, source }) => matchesArtisanSearch(artisan, source));
    }

    function matchesArtisanSearch(artisan, source) {
        const ownerTrees = db.trees.filter(tree => tree.ownerId === artisan.id && tree.approved);
        const forSale = ownerTrees.filter(tree => tree.status === "Đang giao lưu").length;
        const sourceText = source === "pinned" ? "Tiêu biểu" : "Hoạt động nổi bật";
        const treeParts = ownerTrees.flatMap(tree => [
            localize(tree.title),
            localize(tree.species),
            localize(tree.style),
            langStyle(tree.style),
            localize(tree.size),
            langSize(tree.size),
            tree.status,
            getStatusText(tree.status),
        ]);

        return matchesSearch([
            artisan.id,
            artisan.name,
            localize(artisan.rank),
            localize(artisan.address),
            localize(artisan.bio),
            artisan.phone,
            artisan.zaloUrl,
            artisan.facebookUrl,
            sourceText,
            "nghệ nhân",
            "nhà vườn",
            "toàn vườn",
            ownerTrees.length,
            "giao lưu",
            forSale,
            ...treeParts,
        ], searchVal);
    }

    function getFeaturedArtisans() {
        return Object.values(db.artisans || {})
            .map((artisan) => {
                const ownerTrees = db.trees.filter(tree => tree.ownerId === artisan.id && tree.approved);
                const recentTrees = ownerTrees.filter(isRecentTree);
                const likes = ownerTrees.reduce((sum, tree) => sum + getTreeLikeCount(tree), 0);
                const activityScore = recentTrees.length * 12 + ownerTrees.length * 3 + likes;

                return {
                    artisan,
                    source: artisan.featuredOverride ? "pinned" : "auto",
                    score: (artisan.featuredOverride ? 100000 : 0) + activityScore,
                    recentAt: getLatestTreeTime(ownerTrees),
                };
            })
            .sort((a, b) => b.score - a.score || b.recentAt - a.recentAt || a.artisan.name.localeCompare(b.artisan.name, "vi"))
            .slice(0, 3);
    }

    function isRecentTree(tree) {
        const timestamp = getTreeTime(tree);
        if (!timestamp) return false;
        return Date.now() - timestamp <= 7 * 24 * 60 * 60 * 1000;
    }

    function getLatestTreeTime(trees) {
        return trees.reduce((latest, tree) => Math.max(latest, getTreeTime(tree)), 0);
    }

    function getTreeTime(tree) {
        const dateValue = tree.approvedAt || tree.updatedAt || tree.createdAt || "";
        const timestamp = Date.parse(dateValue);
        return Number.isFinite(timestamp) ? timestamp : 0;
    }

    function getTreeLikeCount(tree) {
        if (Array.isArray(tree.likedBy)) return tree.likedBy.length;
        if (Array.isArray(tree.likes)) return tree.likes.length;
        return Number(tree.likeCount || tree.likes || 0) || 0;
    }
}
