"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../providers";
import { getDisplayAvatar, getNameInitials } from "../../lib/avatar";

export default function ArtisansPage() {
    const { db, t, localize, currentUser } = useApp();
    const [viewMode, setViewMode] = React.useState("compact");
    const allArtisans = Object.values(db.artisans || {});
    const artisans = currentUser?.artisanId
        ? allArtisans.filter((artisan) => artisan.id !== currentUser.artisanId)
        : allArtisans;
    const isCompact = viewMode === "compact";

    return (
        <div>
            <div className="garden-directory-head">
                <div className="form-header garden-directory-title">
                    <h2>Nhà vườn</h2>
                    <p>Danh sách các nghệ nhân và nhà vườn đang sinh hoạt trong Hội Quán.</p>
                </div>
                <div className="garden-view-switch" aria-label="Chọn kiểu hiển thị nhà vườn">
                    <button
                        type="button"
                        className={isCompact ? "active" : ""}
                        onClick={() => setViewMode("compact")}
                        aria-label="Hiển thị dạng ngang"
                        aria-pressed={isCompact}
                        title="Dạng ngang"
                    >
                        <i className="fa-solid fa-bars-staggered"></i>
                    </button>
                    <button
                        type="button"
                        className={!isCompact ? "active" : ""}
                        onClick={() => setViewMode("grid")}
                        aria-label="Hiển thị dạng lưới"
                        aria-pressed={!isCompact}
                        title="Dạng lưới"
                    >
                        <i className="fa-solid fa-table-cells-large"></i>
                    </button>
                </div>
            </div>

            {artisans.length === 0 ? (
                <div className="no-results-card">
                    <i className="fa-solid fa-seedling text-secondary" style={{ fontSize: "2.4rem", marginBottom: "12px", display: "block" }}></i>
                    <p>Chưa có nhà vườn khác để hiển thị.</p>
                </div>
            ) : (
                <div className={`garden-directory-list ${isCompact ? "compact" : "grid"}`}>
                    {artisans.map((artisan) => {
                        const approvedTrees = db.trees.filter((tree) => tree.ownerId === artisan.id && tree.approved);
                        const forSale = approvedTrees.filter((tree) => tree.status === "Đang giao lưu").length;
                        const artisanAvatar = getDisplayAvatar(artisan.avatar);
                        const rank = localize(artisan.rank);
                        const address = localize(artisan.address);
                        const bio = localize(artisan.bio);

                        return (
                            <Link href={`/artisan/${artisan.id}`} key={artisan.id} className="garden-directory-card">
                                <div
                                    className="garden-directory-cover"
                                    style={{ backgroundImage: `url('${artisan.cover}')` }}
                                    aria-label={`Ảnh bìa nhà vườn ${artisan.name}`}
                                >
                                    <div className={`garden-directory-avatar ${artisanAvatar ? "has-image" : ""}`}>
                                        {artisanAvatar ? (
                                            <img src={artisanAvatar} alt={artisan.name} />
                                        ) : (
                                            <span>{getNameInitials(artisan.name)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="garden-directory-content">
                                    <div className="garden-directory-copy">
                                        <span className="garden-directory-rank">{rank.split(" ")[0]}</span>
                                        <h3>{artisan.name}</h3>
                                        <p className="garden-directory-loc"><i className="fa-solid fa-location-dot"></i> {address}</p>
                                        <p className="garden-directory-bio">{bio}</p>
                                    </div>
                                    <div className="garden-directory-stats">
                                        <span>Toàn vườn <strong>{approvedTrees.length}</strong></span>
                                        <span>Giao lưu <strong>{forSale}</strong></span>
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
