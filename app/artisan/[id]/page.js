"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "../../providers";
import { api } from "../../../lib/api-client";

export default function ArtisanProfile() {
    const params = useParams();
    const artisanId = params.id || "nguyen_van_ba";
    const { db, updateDb, t, localize, showToast } = useApp();
    const [activeTab, setActiveTab] = useState("all-garden");

    // Guestbook form states
    const [gbName, setGbName] = useState("");
    const [gbTitle, setGbTitle] = useState("");
    const [gbContent, setGbContent] = useState("");

    const artisan = db.artisans[artisanId];
    if (!artisan) {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <i className="fa-solid fa-tree-deciduous text-danger" style={{ fontSize: "3rem", marginBottom: "16px" }}></i>
                <h2>{t("detail_back") === "Back" ? "Artisan Not Found" : t("detail_back") === "戻る" ? "職人が見つかりません" : "Không tìm thấy nghệ nhân"}</h2>
                <Link href="/" className="btn-primary" style={{ marginTop: "20px" }}>{t("detail_back")}</Link>
            </div>
        );
    }

    // Get all trees for this artisan
    const allTrees = db.trees.filter(t => t.ownerId === artisanId);
    
    // Logged in user mock check (Ba is logged in by default)
    const isOwner = (artisanId === "nguyen_van_ba");
    const visibleTrees = isOwner ? allTrees : allTrees.filter(t => t.approved);

    const exhibitTrees = visibleTrees.filter(t => t.status === "Trưng bày");
    const saleTrees = visibleTrees.filter(t => t.status === "Đang giao lưu");

    const getStatusText = (status) => {
        if (status === "Trưng bày") return t("status_exhibit");
        if (status === "Đang giao lưu") return t("status_sale");
        return t("status_training");
    };

    const handleGuestbookSubmit = async (e) => {
        e.preventDefault();
        if (!gbName.trim() || !gbContent.trim()) return;

        try {
            const newComment = await api.addGuestbook(artisanId, {
                name: gbName.trim(),
                contact: gbTitle.trim(),
                content: gbContent.trim(),
            });

            updateDb(prev => {
                const nextArtisans = { ...prev.artisans };
                nextArtisans[artisanId] = {
                    ...nextArtisans[artisanId],
                    guestbook: [newComment, ...(nextArtisans[artisanId].guestbook || [])]
                };
                return {
                    ...prev,
                    artisans: nextArtisans
                };
            });

            // Reset
            setGbName("");
            setGbTitle("");
            setGbContent("");
            showToast(t("toast_guestbook_success"));
        } catch (error) {
            showToast(error.message || "Unable to save guestbook entry.", "error");
        }
    };

    // Dynamic grid renderer for trees in tab
    const renderTreeList = (list) => {
        if (list.length === 0) {
            return (
                <div className="no-results-card" style={{ gridColumn: "1 / -1", padding: "40px 20px" }}>
                    <p>{t("artisan_bio_empty") === "Artisan biography is being updated..." ? "No trees declared in this section." : t("artisan_bio_empty") === "職人の略歴は現在更新中です..." ? "このセクションには盆栽が登録されていません。" : "Nhà vườn chưa đăng tải tác phẩm nào trong mục này."}</p>
                </div>
            );
        }

        return list.map(tree => {
            let statusClass = "training";
            if (tree.status === "Đang giao lưu") statusClass = "sale";
            else if (tree.status === "Trưng bày") statusClass = "exhibit";

            let priceText = "";
            if (tree.status === "Đang giao lưu") {
                priceText = tree.price ? `${parseInt(tree.price).toLocaleString('vi-VN')} đ` : t("detail_price_contact");
            } else if (tree.status === "Trưng bày") {
                priceText = t("detail_price_exhibit");
            }

            return (
                <Link href={`/tree/${tree.id}`} key={tree.id} className="tree-card">
                    <div className="tree-card-img-wrap">
                        <img src={tree.images[0]} alt={localize(tree.title)} className="tree-card-img" />
                        <span className={`tree-status-tag ${statusClass}`}>{getStatusText(tree.status)}</span>
                        {!tree.approved && (
                            <span style={{ background: "var(--color-accent)", color: "var(--color-primary)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", position: "absolute", top: "12px", right: "12px", zIndex: "10" }}>
                                <i className="fa-solid fa-clock"></i> {t("detail_back") === "Back" ? "Pending" : t("detail_back") === "戻る" ? "保留中" : "Chờ duyệt"}
                            </span>
                        )}
                    </div>
                    <div className="tree-card-content">
                        <h3 className="tree-card-title">{localize(tree.title)}</h3>
                        <div className="tree-card-specs">
                            <span className="spec-tag">{localize(tree.species)}</span>
                            <span className="spec-tag">{langStyle(tree.style)}</span>
                            <span className="spec-tag">{langSize(tree.size)}</span>
                        </div>
                        <div className="tree-card-footer">
                            <span className={`tree-card-price ${tree.status !== 'Đang giao lưu' ? 'contact' : ''}`}>{priceText}</span>
                            <button className="tree-card-btn">{t("detail_back") === "Back" ? "View" : t("detail_back") === "戻る" ? "見る" : "Xem"} <i className="fa-solid fa-angle-right"></i></button>
                        </div>
                    </div>
                </Link>
            );
        });
    };

    return (
        <div>
            {/* Back Button */}
            <div className="back-link-wrapper">
                <Link href="/" className="btn-back">
                    <i className="fa-solid fa-arrow-left"></i> {t("detail_back")}
                </Link>
            </div>

            {/* Profile Info block */}
            <div className="profile-header">
                <div className="profile-cover" style={{ backgroundImage: `url('${artisan.cover}')` }}></div>
                <div className="profile-info-block">
                    <div className="avatar-wrapper">
                        <img src={artisan.avatar} alt={artisan.name} className="artisan-avatar-img" />
                        <div className="artisan-trien-son">{t("viet_stamp_seal") || "Nghệ\nNhân"}</div>
                    </div>
                    <div className="profile-text-details">
                        <div className="artisan-title-row">
                            <h2>{artisan.name}</h2>
                            <span className="artisan-badge">{localize(artisan.rank)}</span>
                        </div>
                        <p className="artisan-location"><i className="fa-solid fa-location-dot"></i> {localize(artisan.address)}</p>
                        <p className="artisan-bio">{localize(artisan.bio) || t("artisan_bio_empty")}</p>
                        
                        <div className="artisan-stats">
                            <div className="stat-item"><strong>{visibleTrees.length}</strong> <span>{t("artisan_total_trees")}</span></div>
                            <div className="stat-item"><strong>{exhibitTrees.length}</strong> <span>{t("artisan_exhibit")}</span></div>
                            <div className="stat-item"><strong>{saleTrees.length}</strong> <span>{t("artisan_sale")}</span></div>
                        </div>
                    </div>
                    <div className="profile-actions">
                        <a href={`tel:${artisan.phone.replace(/\./g, '')}`} className="btn-primary contact-zalo-btn">
                            <i className="fa-solid fa-phone"></i> {t("artisan_call")}
                        </a>
                    </div>
                </div>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs-wrapper">
                <div className="profile-tabs">
                    <button className={`tab-link ${activeTab === "all-garden" ? "active" : ""}`} onClick={() => setActiveTab("all-garden")}>
                        <i className="fa-solid fa-tree"></i> {t("artisan_tab_all")}
                    </button>
                    <button className={`tab-link ${activeTab === "sale-garden" ? "active" : ""}`} onClick={() => setActiveTab("sale-garden")}>
                        <i className="fa-solid fa-tags"></i> {t("artisan_tab_sale")}
                    </button>
                    <button className={`tab-link ${activeTab === "exhibit-garden" ? "active" : ""}`} onClick={() => setActiveTab("exhibit-garden")}>
                        <i className="fa-solid fa-trophy"></i> {t("artisan_tab_exhibit")}
                    </button>
                    <button className={`tab-link ${activeTab === "timeline-garden" ? "active" : ""}`} onClick={() => setActiveTab("timeline-garden")}>
                        <i className="fa-solid fa-clock-rotate-left"></i> {t("artisan_tab_timeline")}
                    </button>
                    <button className={`tab-link ${activeTab === "guestbook-garden" ? "active" : ""}`} onClick={() => setActiveTab("guestbook-garden")}>
                        <i className="fa-solid fa-comments"></i> {t("artisan_tab_guestbook")}
                    </button>
                </div>
            </div>

            {/* Tab Contents */}
            <div className="tab-content-container">
                {/* 1. All Garden */}
                <div className={`tab-pane ${activeTab === "all-garden" ? "active" : ""}`}>
                    <div className="trees-grid">
                        {renderTreeList(visibleTrees)}
                    </div>
                </div>

                {/* 2. For Sale */}
                <div className={`tab-pane ${activeTab === "sale-garden" ? "active" : ""}`}>
                    <div className="trees-grid">
                        {renderTreeList(saleTrees)}
                    </div>
                </div>

                {/* 3. Showcase */}
                <div className={`tab-pane ${activeTab === "exhibit-garden" ? "active" : ""}`}>
                    <div className="trees-grid">
                        {renderTreeList(exhibitTrees)}
                    </div>
                </div>

                {/* 4. Garden timeline blog */}
                <div className={`tab-pane ${activeTab === "timeline-garden" ? "active" : ""}`}>
                    <div className="timeline-garden-list">
                        {!artisan.blog || artisan.blog.length === 0 ? (
                            <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "30px 0" }}>
                                {t("artisan_bio_empty") === "Artisan biography is being updated..." ? "No timeline logs published." : t("artisan_bio_empty") === "職人の略歴は現在更新中です..." ? "ブログの投稿はありません。" : "Nhà vườn chưa chia sẻ nhật ký tạo tác nào."}
                            </p>
                        ) : (
                            artisan.blog.map((post, idx) => (
                                <div className="timeline-blog-item" key={idx}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-blog-card">
                                        <span className="timeline-date-label">{post.date}</span>
                                        <h4>{localize(post.title)}</h4>
                                        <p className="timeline-blog-content">{localize(post.content)}</p>
                                        {post.media && (
                                            <div className="timeline-blog-media">
                                                <img src={post.media} alt={localize(post.title)} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 5. Guestbook comment list & form */}
                <div className={`tab-pane ${activeTab === "guestbook-garden" ? "active" : ""}`}>
                    <div className="guestbook-section">
                        <h3>{t("guestbook_title")}</h3>
                        <form className="comment-form" onSubmit={handleGuestbookSubmit}>
                            <div className="form-row">
                                <input 
                                    type="text" 
                                    placeholder={t("guestbook_name_placeholder")}
                                    value={gbName}
                                    onChange={(e) => setGbName(e.target.value)}
                                    required 
                                />
                                <input 
                                    type="text" 
                                    placeholder={t("guestbook_contact_placeholder")}
                                    value={gbTitle}
                                    onChange={(e) => setGbTitle(e.target.value)}
                                />
                            </div>
                            <textarea 
                                rows="3" 
                                placeholder={t("guestbook_msg_placeholder")}
                                value={gbContent}
                                onChange={(e) => setGbContent(e.target.value)}
                                required
                            ></textarea>
                            <div>
                                <button type="submit" className="btn-primary">{t("guestbook_submit")}</button>
                            </div>
                        </form>

                        <div className="comments-list">
                            {!artisan.guestbook || artisan.guestbook.length === 0 ? (
                                <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px 0" }}>{t("guestbook_empty")}</p>
                            ) : (
                                artisan.guestbook.map((entry, idx) => (
                                    <div className="comment-item" key={idx}>
                                        <div className="comment-meta">
                                            <strong>{entry.name} {entry.contact && <span style={{ fontWeight: "normal", fontSize: "0.8rem", color: "var(--text-secondary)" }}>({entry.contact})</span>}</strong>
                                            <span>{entry.date}</span>
                                        </div>
                                        <p className="comment-content">{entry.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
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
}
