"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../lib/api-client";
import { useApp } from "../providers";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast, refreshSession } = useApp();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await api.login({ username, password });
            await refreshSession();
            showToast("Đăng nhập quản trị thành công.");
            router.push(searchParams.get("next") || "/admin/moderation");
        } catch (error) {
            showToast(error.message || "Không thể đăng nhập.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page-shell">
            <div className="form-header">
                <h2>Đăng nhập</h2>
                <p>Admin quản trị hệ thống, nghệ nhân đăng nhập để đăng cây và quản lý hồ sơ vườn.</p>
            </div>

            <form className="form-section-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group-full">
                        <label>Tên đăng nhập</label>
                        <input name="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="form-group-full">
                        <label>Mật khẩu</label>
                        <input name="current-password" autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <div className="form-submit-row">
                    <button className="btn-primary large-btn" disabled={submitting} type="submit">
                        <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập
                    </button>
                </div>
                <div className="auth-divider"><span>hoặc</span></div>
                <a className="google-auth-btn" href="/api/auth/google">
                    <i className="fa-brands fa-google"></i> Đăng nhập bằng Google
                </a>
                {searchParams.get("error") && (
                    <p className="auth-error-text">
                        {searchParams.get("error") === "GOOGLE_AUTH_NOT_CONFIGURED"
                            ? "Google OAuth chưa được cấu hình. Admin vào Cài đặt để lưu Client ID/Secret."
                            : "Không thể đăng nhập bằng Google. Kiểm tra lại cấu hình OAuth."}
                    </p>
                )}
                <p className="auth-footer-text">
                    Nghệ nhân chưa có tài khoản? <Link href="/register">Đăng ký tại đây</Link>.
                </p>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="auth-page-shell">Đang tải...</div>}>
            <LoginForm />
        </Suspense>
    );
}
