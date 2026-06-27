"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../providers";
import { api } from "../../lib/api-client";

export default function Settings() {
    const router = useRouter();
    const pathname = usePathname();
    const { db, updateDb, t, showToast, currentUser, mounted } = useApp();
    const [googleForm, setGoogleForm] = useState({
        clientId: "",
        clientSecret: "",
        redirectUri: "",
        hasClientSecret: false,
        configured: false,
    });
    const [savingGoogle, setSavingGoogle] = useState(false);
    const isAdmin = currentUser?.role === "ADMIN";

    useEffect(() => {
        if (!mounted) return;
        if (!isAdmin) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [mounted, isAdmin, pathname, router]);

    useEffect(() => {
        if (!isAdmin) return;
        let active = true;
        api.getGoogleSettings()
            .then((settings) => {
                if (!active) return;
                setGoogleForm({
                    clientId: settings.clientId || "",
                    clientSecret: "",
                    redirectUri: settings.redirectUri || "",
                    hasClientSecret: Boolean(settings.hasClientSecret),
                    configured: Boolean(settings.configured),
                });
            })
            .catch((error) => {
                showToast(error.message || "Unable to load Google OAuth settings.", "error");
            });
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

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

    const updateGoogleField = (field, value) => {
        setGoogleForm(prev => ({ ...prev, [field]: value }));
    };

    const handleGoogleSubmit = async (event) => {
        event.preventDefault();
        setSavingGoogle(true);
        try {
            const settings = await api.updateGoogleSettings({
                clientId: googleForm.clientId,
                clientSecret: googleForm.clientSecret,
                redirectUri: googleForm.redirectUri,
                keepSecret: googleForm.hasClientSecret && !googleForm.clientSecret,
            });
            setGoogleForm(prev => ({
                ...prev,
                clientSecret: "",
                hasClientSecret: Boolean(settings.hasClientSecret),
                configured: Boolean(settings.configured),
            }));
            showToast("Đã lưu cấu hình Google OAuth.");
        } catch (error) {
            showToast(error.message || "Unable to save Google OAuth settings.", "error");
        } finally {
            setSavingGoogle(false);
        }
    };

    if (!mounted || !isAdmin) {
        return (
            <div className="form-container">
                <div className="form-section-card auth-redirect-card">
                    <i className="fa-solid fa-shield-halved"></i>
                    <p>Đang chuyển tới trang đăng nhập quản trị...</p>
                </div>
            </div>
        );
    }

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

            <form className="form-section-card" onSubmit={handleGoogleSubmit}>
                <h3>Google OAuth</h3>
                <div className="setting-action-row oauth-status-row">
                    <div className="setting-text">
                        <strong>{googleForm.configured ? "Google login đang bật" : "Google login chưa cấu hình đủ"}</strong>
                        <p>Lưu Client ID, Client Secret và Redirect URI vào server store để không bị mất sau khi refresh/restart.</p>
                    </div>
                    <span className={`status-pill ${googleForm.configured ? "public" : "pending"}`}>
                        {googleForm.configured ? "Ready" : "Missing"}
                    </span>
                </div>
                <div className="form-grid">
                    <div className="form-group-full">
                        <label>Google Client ID</label>
                        <input value={googleForm.clientId} onChange={(e) => updateGoogleField("clientId", e.target.value)} placeholder="...apps.googleusercontent.com" />
                    </div>
                    <div className="form-group-full">
                        <label>Google Client Secret</label>
                        <input
                            type="password"
                            value={googleForm.clientSecret}
                            onChange={(e) => updateGoogleField("clientSecret", e.target.value)}
                            placeholder={googleForm.hasClientSecret ? "Đã lưu. Nhập mới nếu muốn thay đổi." : "Nhập client secret"}
                        />
                    </div>
                    <div className="form-group-full">
                        <label>Redirect URI</label>
                        <input value={googleForm.redirectUri} onChange={(e) => updateGoogleField("redirectUri", e.target.value)} placeholder="http://localhost:3000/api/auth/callback" />
                        <span className="form-help-text">Để trống thì hệ thống tự dùng /api/auth/callback theo domain hiện tại.</span>
                    </div>
                </div>
                <div className="form-submit-row">
                    <button className="btn-primary" type="submit" disabled={savingGoogle}>
                        <i className="fa-solid fa-floppy-disk"></i> Lưu Google OAuth
                    </button>
                </div>
            </form>

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
