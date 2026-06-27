"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../providers";

export default function ArtisansPage() {
    const { db, t, localize, currentUser } = useApp();
    const allArtisans = Object.values(db.artisans || {});
    const artisans = currentUser?.artisanId
        ? allArtisans.filter((artisan) => artisan.id !== currentUser.artisanId)
        : allArtisans;

    return (
        <div>
            <div className="form-header">
                <h2>Nhà vườn</h2>
                <p>Danh sách các nghệ nhân và nhà vườn đang sinh hoạt trong Hội Quán.</p>
            </div>

            {artisans.length === 0 ? (
                <div className="no-results-card">
                    <i className="fa-solid fa-seedling text-secondary" style={{ fontSize: "2.4rem", marginBottom: "12px", display: "block" }}></i>
                    <p>Chưa có nhà vườn khác để hiển thị.</p>
                </div>
            ) : (
                <div className="artisans-grid">
                    {artisans.map((artisan) => {
                        const approvedTrees = db.trees.filter((tree) => tree.ownerId === artisan.id && tree.approved);
                        const forSale = approvedTrees.filter((tree) => tree.status === "Đang giao lưu").length;

                        return (
                            <Link href={`/artisan/${artisan.id}`} key={artisan.id} className="artisan-card">
                                <div className="artisan-card-banner" style={{ backgroundImage: `url('${artisan.cover}')` }}></div>
                                <div className="artisan-card-content">
                                    <img src={artisan.avatar} alt={artisan.name} className="artisan-card-avatar" />
                                    <div className="artisan-card-seal viet-stamp-seal">
                                        <span>{t("viet_stamp_seal") || "Nghệ\nNhân"}</span>
                                    </div>
                                    <div className="artisan-card-info">
                                        <span className="artisan-card-rank">{localize(artisan.rank).split(" ")[0]}</span>
                                        <h3>{artisan.name}</h3>
                                        <p className="artisan-card-loc"><i className="fa-solid fa-location-dot"></i> {localize(artisan.address)}</p>
                                        <div className="artisan-card-stats">
                                            <span>{t("artisan_tab_all")}: <strong>{approvedTrees.length}</strong></span>
                                            <span>{t("status_sale")}: <strong>{forSale}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
