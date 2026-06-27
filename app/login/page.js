"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../lib/api-client";
import { useApp } from "../providers";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useApp();
    const [email, setEmail] = useState("admin@bonsaihoiquan.local");
    const [password, setPassword] = useState("admin123");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await api.login({ email, password });
            showToast("Đăng nhập quản trị thành công.");
            router.push(searchParams.get("next") || "/admin/moderation");
        } catch (error) {
            showToast(error.message || "Không thể đăng nhập.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Đăng Nhập Quản Trị</h2>
                <p>Dùng tài khoản admin để truy cập các màn quản trị.</p>
            </div>

            <form className="form-section-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="form-group-full">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group-full">
                        <label>Mật khẩu</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                </div>
                <div className="form-submit-row">
                    <button className="btn-primary large-btn" disabled={submitting} type="submit">
                        <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="form-container">Đang tải...</div>}>
            <LoginForm />
        </Suspense>
    );
}
