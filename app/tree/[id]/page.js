"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApp } from "../../providers";

export default function TreeDetail() {
    const params = useParams();
    const treeId = params.id || "tree_01";
    const { db, t, localize } = useApp();

    const tree = db.trees.find(t => t.id === treeId);
    
    // Set active photo index
    const [activePhotoIdx, setActivePhotoIdx] = useState(0);

    if (!tree) {
        return (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
                <i className="fa-solid fa-wind text-danger" style={{ fontSize: "3rem", marginBottom: "16px" }}></i>
                <h2>{t("detail_back") === "Back" ? "Masterpiece Not Found" : t("detail_back") === "戻る" ? "作品が見つかりません" : "Không tìm thấy tác phẩm"}</h2>
                <Link href="/" className="btn-primary" style={{ marginTop: "20px" }}>{t("detail_back")}</Link>
            </div>
        );
    }

    const owner = db.artisans[tree.ownerId] || { name: "Ẩn danh nhà vườn", phone: "" };
    const ownerPhoneDigits = String(owner.phone || "").replace(/[^\d+]/g, "");

    let statusClass = "training";
    if (tree.status === "Đang giao lưu") statusClass = "sale";
    else if (tree.status === "Trưng bày") statusClass = "exhibit";

    const getStatusText = (status) => {
        if (status === "Trưng bày") return t("status_exhibit");
        if (status === "Đang giao lưu") return t("status_sale");
        return t("status_training");
    };

    let priceText = "";
    if (tree.status === "Đang giao lưu") {
        priceText = tree.price ? `${parseInt(tree.price).toLocaleString('vi-VN')} đ` : t("detail_price_contact");
    } else if (tree.status === "Trưng bày") {
        priceText = t("detail_price_exhibit");
    } else {
        priceText = t("detail_price_training");
    }

    // Pre-formatted Zalo message in matching language
    const getZaloMsg = () => {
        if (t("detail_back") === "Back") {
            return encodeURIComponent(`Hello ${owner.name}, I am interested in your Bonsai masterpiece "${localize(tree.title)}" displayed on Bonsai Club.`);
        }
        if (t("detail_back") === "戻る") {
            return encodeURIComponent(`こんにちは、職人の ${owner.name} さん。「盆栽会館」に掲載されている盆栽作品「${localize(tree.title)}」について詳しく伺いたいです。`);
        }
        return encodeURIComponent(`Chào nghệ nhân ${owner.name}, tôi muốn tìm hiểu giao lưu cây cảnh "${localize(tree.title)}" trên trang Bonsai Hội Quán.`);
    };

    return (
        <div>
            {/* Back Link */}
            <div className="back-link-wrapper">
                <Link href="/" className="btn-back">
                    <i className="fa-solid fa-arrow-left"></i> {t("detail_back")}
                </Link>
            </div>

            <div className="detail-layout">
                {/* Left Column: Image Viewer */}
                <div className="detail-images-panel">
                    <div className="main-image-viewer">
                        <img src={tree.images[activePhotoIdx]} alt={localize(tree.title)} />
                        <span className={`tree-status-badge ${statusClass}`}>{getStatusText(tree.status)}</span>
                    </div>
                    <div className="thumbnail-slider">
                        {tree.images.map((imgUrl, idx) => (
                            <img 
                                key={idx} 
                                src={imgUrl} 
                                alt={`${localize(tree.title)} ảnh ${idx + 1}`}
                                className={`thumb-img ${idx === activePhotoIdx ? 'active' : ''}`}
                                onClick={() => setActivePhotoIdx(idx)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Specs Panel */}
                <div className="detail-info-panel">
                    <div className="tree-title-block">
                        <h2>{localize(tree.title)}</h2>
                        <div className="tree-owner-row">
                            <span>{t("owner_prefix")}</span>
                            <Link href={`/artisan/${tree.ownerId}`} className="artisan-name-link">
                                {owner.name}
                            </Link>
                            <span className="trien-owner">{t("viet_stamp_seal") ? "Triện" : "Seal"}</span>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="specs-grid">
                        <div className="spec-card">
                            <span className="spec-label">{t("detail_species")}</span>
                            <strong className="spec-val">{localize(tree.species)}</strong>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">{t("detail_style")}</span>
                            <strong className="spec-val">{langStyle(tree.style)}</strong>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">{t("detail_size")}</span>
                            <strong className="spec-val">{langSize(tree.size)}</strong>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">{t("detail_age")}</span>
                            <strong className="spec-val">{localize(tree.age)} / {localize(tree.potAge)}</strong>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">{t("detail_origin")}</span>
                            <strong className="spec-val">{localize(tree.origin)}</strong>
                        </div>
                        <div className="spec-card">
                            <span className="spec-label">{t("detail_price")}</span>
                            <strong className={`spec-val ${tree.status === 'Đang giao lưu' ? 'text-primary' : ''}`}>{priceText}</strong>
                        </div>
                    </div>

                    {/* Story block */}
                    <div className="tree-story-block">
                        <h3>{t("detail_story_title")}</h3>
                        <p>{localize(tree.story)}</p>
                    </div>

                    {/* Contact Panel */}
                    {ownerPhoneDigits && (
                        <div className="contact-action-box">
                            <h4>{t("detail_contact_title")}</h4>
                            <p>{t("detail_contact_tip")}</p>
                            <div className="contact-buttons-group">
                                <a href={`tel:${ownerPhoneDigits}`} className="contact-btn phone">
                                    <i className="fa-solid fa-phone"></i> {owner.phone}
                                </a>
                                <a href={`https://zalo.me/${ownerPhoneDigits}?text=${getZaloMsg()}`} className="contact-btn zalo" target="_blank" rel="noopener noreferrer">
                                    <i className="fa-brands fa-whatsapp"></i> {t("detail_zalo")}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tree Evolution Timeline */}
            <div className="section-container tree-evolution-container">
                <div className="section-title-wrap">
                    <h2 className="section-title">{t("detail_timeline_title")}</h2>
                    <div className="bamboo-divider"></div>
                </div>
                <p className="timeline-intro">{t("detail_timeline_tip")}</p>
                
                <div className="evolution-timeline">
                    {tree.evolution.map((step, idx) => (
                        <div className="evolution-step" key={idx}>
                            <div className="evolution-node"></div>
                            <div className="evolution-year">{step.year}</div>
                            <div className="evolution-desc">{localize(step.desc)}</div>
                        </div>
                    ))}
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
