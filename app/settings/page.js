"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "../providers";
import { api } from "../../lib/api-client";

export default function Settings() {
    const { db, updateDb, t, showToast } = useApp();

    const handleModerationChange = async (e) => {
        const checked = e.target.checked;
        try {
            const settings = await api.updateModeration(checked);
            updateDb(prev => ({
                ...prev,
                moderationRequired: settings.moderationRequired
            }));
            showToast(checked ? t("toast_moderation_on") : t("toast_moderation_off"));
        } catch (error) {
            showToast(error.message || "Unable to update moderation settings.", "error");
        }
    };

    const handleResetData = async () => {
        const confirmMsg = t("detail_back") === "Back" 
            ? "Are you sure you want to reset all garden data back to the default template?" 
            : t("detail_back") === "戻る" 
                ? "すべての庭園データをデフォルトのテンプレートにリセットしてもよろしいですか？"
                : "Bạn có chắc chắn muốn khôi phục dữ liệu cây cảnh và nghệ nhân về trạng thái mặc định ban đầu?";
                
        if (confirm(confirmMsg)) {
            try {
                const dbState = await api.resetData();
                localStorage.clear();
                updateDb(dbState);
                showToast(t("toast_reset_success"));
                
                // Wait brief moment and reload to trigger server re-hydration
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
            } catch (error) {
                showToast(error.message || "Unable to reset data.", "error");
            }
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>{t("settings_title")}</h2>
                <p>{t("settings_subtitle")}</p>
            </div>

            {/* Moderation Settings */}
            <div className="form-section-card">
                <h3>{t("settings_moderation_title")}</h3>
                <div className="setting-toggle-row">
                    <div className="setting-text">
                        <strong>{t("settings_moderation_title")}</strong>
                        <p>{t("settings_moderation_desc")}</p>
                    </div>
                    <label className="switch-toggle">
                        <input 
                            type="checkbox" 
                            checked={db.moderationRequired || false}
                            onChange={handleModerationChange}
                        />
                        <span className="slider-round"></span>
                    </label>
                </div>
            </div>

            {/* Admin Moderation */}
            <div className="form-section-card">
                <h3>{t("admin_moderation_title")}</h3>
                <div className="setting-action-row">
                    <div className="setting-text">
                        <strong>{t("admin_pending_queue")}</strong>
                        <p>{t("admin_moderation_subtitle")}</p>
                    </div>
                    <Link className="btn-primary" href="/admin/moderation">
                        <i className="fa-solid fa-shield-halved"></i> {t("nav_admin")}
                    </Link>
                </div>
            </div>

            {/* Reset Data Settings */}
            <div className="form-section-card">
                <h3>{t("settings_data_title")}</h3>
                <div className="setting-action-row">
                    <div className="setting-text">
                        <strong>{t("settings_data_title")}</strong>
                        <p>{t("settings_data_desc")}</p>
                    </div>
                    <button className="btn-secondary text-danger" onClick={handleResetData}>
                        <i className="fa-solid fa-rotate-left"></i> {t("settings_data_btn")}
                    </button>
                </div>
            </div>
        </div>
    );
}
