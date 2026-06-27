"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api-client";
import { getUserHomePath } from "../../lib/auth-navigation";
import { useApp } from "../providers";

export default function RegisterPage() {
    const router = useRouter();
    const { showToast, refreshSession, refreshDb, currentUser, mounted } = useApp();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        facebook: "",
        address: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!mounted || !currentUser) return;
        router.replace(getUserHomePath(currentUser));
    }, [currentUser, mounted, router]);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await api.register(form);
            const [sessionUser] = await Promise.all([
                refreshSession(),
                refreshDb(),
            ]);
            showToast("Đã tạo tài khoản nghệ nhân.");
            router.replace(sessionUser?.artisanId ? `/artisan/${sessionUser.artisanId}` : "/upload");
        } catch (error) {
            showToast(error.message || "Không thể tạo tài khoản.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page-shell">
            <div className="form-header">
                <h2>Đăng ký nghệ nhân</h2>
                <p>Tạo hồ sơ nhà vườn để đăng cây, nhận liên hệ và quản lý bài viết.</p>
            </div>

            <form className="form-section-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group-full">
                        <label>Tên nghệ nhân <span className="required">*</span></label>
                        <input name="name" autoComplete="name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
                    </div>
                    <div className="form-group-full">
                        <label>Tên đăng nhập <span className="required">*</span></label>
                        <input name="username" autoComplete="username" value={form.username} onChange={(e) => updateField("username", e.target.value)} required placeholder="vd: vuon_sanh_ba" />
                    </div>
                    <div className="form-group-full">
                        <label>Mật khẩu <span className="required">*</span></label>
                        <input name="new-password" autoComplete="new-password" type="password" minLength={6} value={form.password} onChange={(e) => updateField("password", e.target.value)} required />
                    </div>
                    <div className="form-group-full">
                        <label>Email <span className="form-help-text">(không bắt buộc)</span></label>
                        <input name="email" autoComplete="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Điện thoại/Zalo</label>
                        <input name="tel" autoComplete="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Facebook URL</label>
                        <input name="url" autoComplete="url" value={form.facebook} onChange={(e) => updateField("facebook", e.target.value)} placeholder="https://facebook.com/..." />
                    </div>
                    <div className="form-group-full">
                        <label>Địa chỉ vườn</label>
                        <input name="street-address" autoComplete="street-address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                </div>
                <div className="form-submit-row">
                    <button className="btn-primary large-btn" type="submit" disabled={submitting}>
                        <i className="fa-solid fa-user-plus"></i> Tạo tài khoản
                    </button>
                </div>
                <div className="auth-divider"><span>hoặc</span></div>
                <a className="google-auth-btn" href="/api/auth/google">
                    <i className="fa-brands fa-google"></i> Tiếp tục bằng Google
                </a>
                <p className="auth-footer-text">
                    Đã có tài khoản? <Link href="/login">Đăng nhập</Link>.
                </p>
            </form>
        </div>
    );
}
