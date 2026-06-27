"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "../../../lib/api-client";
import { useApp } from "../../providers";

export default function ModerationPage() {
    const router = useRouter();
    const pathname = usePathname();
    const { t, localize, showToast, mounted, currentUser } = useApp();
    const [trees, setTrees] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState("");
    const isAdmin = currentUser?.role === "ADMIN";

    const loadTrees = async () => {
        setLoading(true);
        try {
            const data = await api.listAdminTrees();
            setTrees(data);
        } catch (error) {
            showToast(error.message || "Unable to load tree manager.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!mounted) return;
        if (!isAdmin) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [mounted, isAdmin, pathname, router]);

    useEffect(() => {
        if (!isAdmin) return;
        /* eslint-disable react-hooks/set-state-in-effect */
        loadTrees();
        /* eslint-enable react-hooks/set-state-in-effect */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    const handleApproval = async (treeId, approved) => {
        setBusyId(treeId);
        try {
            const updatedTree = await api.updateAdminTree(treeId, { approved });
            setTrees(prev => prev.map(tree => tree.id === treeId ? updatedTree : tree));
            showToast(approved ? "Đã duyệt tác phẩm." : "Đã ẩn tác phẩm khỏi sảnh chính.");
        } catch (error) {
            showToast(error.message || "Unable to update tree.", "error");
        } finally {
            setBusyId("");
        }
    };

    const handleDelete = async (treeId) => {
        const confirmed = confirm("Xóa tác phẩm này khỏi hệ thống?");
        if (!confirmed) return;

        setBusyId(treeId);
        try {
            await api.deleteAdminTree(treeId);
            setTrees(prev => prev.filter(tree => tree.id !== treeId));
            showToast("Đã xóa tác phẩm.");
        } catch (error) {
            showToast(error.message || "Unable to delete tree.", "error");
        } finally {
            setBusyId("");
        }
    };

    const visibleTrees = trees.filter(tree => {
        if (filter === "pending") return !tree.approved;
        if (filter === "public") return tree.approved;
        return true;
    });

    if (!mounted || !isAdmin) {
        return (
            <div className="admin-page-shell">
                <div className="form-section-card auth-redirect-card">
                    <i className="fa-solid fa-shield-halved"></i>
                    <p>Đang chuyển tới trang đăng nhập quản trị...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-shell">
            <div className="form-header">
                <h2>{t("admin_moderation_title") || "Quản Lý Cây"}</h2>
                <p>{t("admin_moderation_subtitle") || "Quản lý bài đăng cây cảnh, trạng thái hiển thị và hàng chờ duyệt."}</p>
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                    <Link className="btn-secondary" href="/admin/artisans">
                        <i className="fa-solid fa-user-pen"></i> Quản lý nghệ nhân
                    </Link>
                </div>
            </div>

            <div className="form-section-card">
                <div className="setting-action-row" style={{ marginBottom: "18px" }}>
                    <div className="setting-text">
                        <strong>{t("admin_pending_queue") || "Danh sách cây"}</strong>
                        <p>{visibleTrees.length} / {trees.length} tác phẩm</p>
                    </div>
                    <button className="btn-secondary" onClick={loadTrees} disabled={loading}>
                        <i className="fa-solid fa-rotate"></i> {t("admin_refresh") || "Tải lại"}
                    </button>
                </div>

                <div className="filter-chips" style={{ marginBottom: "18px" }}>
                    <button className={`chip ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Tất cả</button>
                    <button className={`chip ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>Chờ duyệt</button>
                    <button className={`chip ${filter === "public" ? "active" : ""}`} onClick={() => setFilter("public")}>Đang công khai</button>
                </div>

                {loading ? (
                    <div className="no-results-card">
                        <p>{t("admin_loading") || "Đang tải danh sách chờ duyệt..."}</p>
                    </div>
                ) : visibleTrees.length === 0 ? (
                    <div className="no-results-card">
                        <i className="fa-solid fa-circle-check text-secondary" style={{ fontSize: "2.2rem", marginBottom: "12px", display: "block" }}></i>
                        <p>{t("admin_empty") || "Không có tác phẩm nào trong bộ lọc này."}</p>
                    </div>
                ) : (
                    <div className="trees-grid">
                        {visibleTrees.map(tree => (
                            <div className="tree-card" key={tree.id}>
                                <div className="tree-card-img-wrap">
                                    <img src={tree.images?.[0]} alt={localize(tree.title)} className="tree-card-img" />
                                    <span className={`tree-status-tag ${tree.approved ? "exhibit" : "training"}`}>
                                        <i className={`fa-solid ${tree.approved ? "fa-eye" : "fa-clock"}`}></i> {tree.approved ? "Công khai" : (t("admin_pending") || "Chờ duyệt")}
                                    </span>
                                </div>
                                <div className="tree-card-content">
                                    <h3 className="tree-card-title">{localize(tree.title)}</h3>
                                    <div className="tree-card-specs">
                                        <span className="spec-tag">{localize(tree.species)}</span>
                                        <span className="spec-tag">{tree.style}</span>
                                        <span className="spec-tag">{tree.size}</span>
                                    </div>
                                    <p className="tree-card-owner">
                                        <i className="fa-solid fa-seedling"></i>
                                        <span>{tree.ownerId}</span>
                                    </p>
                                    <div className="contact-buttons-group" style={{ marginTop: "14px" }}>
                                        {tree.approved ? (
                                            <button
                                                className="btn-secondary"
                                                disabled={busyId === tree.id}
                                                onClick={() => handleApproval(tree.id, false)}
                                            >
                                                <i className="fa-solid fa-eye-slash"></i> Ẩn
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-primary"
                                                disabled={busyId === tree.id}
                                                onClick={() => handleApproval(tree.id, true)}
                                            >
                                                <i className="fa-solid fa-check"></i> {t("admin_approve") || "Duyệt"}
                                            </button>
                                        )}
                                        <button
                                            className="btn-secondary text-danger"
                                            disabled={busyId === tree.id}
                                            onClick={() => handleDelete(tree.id)}
                                        >
                                            <i className="fa-solid fa-trash"></i> Xóa
                                        </button>
                                    </div>
                                    <Link href={`/tree/${tree.id}`} className="tree-card-btn" style={{ marginTop: "12px" }}>
                                        {t("detail_back") === "Back" ? "Preview" : t("detail_back") === "戻る" ? "プレビュー" : "Xem trước"} <i className="fa-solid fa-angle-right"></i>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
