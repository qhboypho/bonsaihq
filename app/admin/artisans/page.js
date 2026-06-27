"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "../../../lib/api-client";
import { useApp } from "../../providers";

const emptyForm = {
    id: "",
    name: "",
    rank: "",
    address: "",
    bio: "",
    avatar: "",
    cover: "",
    phone: "",
    zalo: "",
    accountUsername: "",
    accountPassword: "",
};

export default function AdminArtisansPage() {
    const router = useRouter();
    const pathname = usePathname();
    const { t, localize, showToast, mounted, currentUser } = useApp();
    const [artisans, setArtisans] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState("");
    const isAdmin = currentUser?.role === "ADMIN";

    const loadArtisans = async () => {
        setLoading(true);
        try {
            setArtisans(await api.listAdminArtisans());
        } catch (error) {
            showToast(error.message || "Unable to load artisans.", "error");
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
        loadArtisans();
        /* eslint-enable react-hooks/set-state-in-effect */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const editArtisan = (artisan) => {
        setEditingId(artisan.id);
        setForm({
            id: artisan.id,
            name: artisan.name,
            rank: localize(artisan.rank),
            address: localize(artisan.address),
            bio: localize(artisan.bio),
            avatar: artisan.avatar || "",
            cover: artisan.cover || "",
            phone: artisan.phone || "",
            zalo: artisan.zalo || "",
            accountUsername: "",
            accountPassword: "",
        });
    };

    const resetForm = () => {
        setEditingId("");
        setForm(emptyForm);
    };

    const saveArtisan = async (event) => {
        event.preventDefault();
        setBusyId(editingId || "new");

        const payload = {
            ...form,
            rank: { vi: form.rank, en: form.rank, jp: form.rank },
            address: { vi: form.address, en: form.address, jp: form.address },
            bio: { vi: form.bio, en: form.bio, jp: form.bio },
        };

        try {
            const saved = editingId
                ? await api.updateAdminArtisan(editingId, payload)
                : await api.createAdminArtisan(payload);

            setArtisans(prev => {
                const exists = prev.some(artisan => artisan.id === saved.id);
                if (exists) return prev.map(artisan => artisan.id === saved.id ? saved : artisan);
                return [saved, ...prev];
            });
            resetForm();
            showToast(saved.accountCreated ? `Đã lưu nghệ nhân và tạo tài khoản ${saved.accountUsername}.` : "Đã lưu nghệ nhân.");
        } catch (error) {
            showToast(error.message || "Unable to save artisan.", "error");
        } finally {
            setBusyId("");
        }
    };

    const removeArtisan = async (id) => {
        const confirmed = confirm("Xóa nghệ nhân này? Chỉ xóa được khi nghệ nhân chưa sở hữu cây nào.");
        if (!confirmed) return;

        setBusyId(id);
        try {
            await api.deleteAdminArtisan(id);
            setArtisans(prev => prev.filter(artisan => artisan.id !== id));
            showToast("Đã xóa nghệ nhân.");
        } catch (error) {
            showToast(error.message || "Không thể xóa nghệ nhân đang sở hữu cây.", "error");
        } finally {
            setBusyId("");
        }
    };

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
            <div className="back-link-wrapper">
                <Link href="/admin/moderation" className="btn-back">
                    <i className="fa-solid fa-arrow-left"></i> Quản lý cây
                </Link>
            </div>

            <div className="form-header">
                <h2>Quản Lý Nghệ Nhân</h2>
                <p>Tạo mới, chỉnh sửa hồ sơ và thông tin liên hệ của nhà vườn.</p>
            </div>

            <form className="form-section-card" onSubmit={saveArtisan}>
                <h3>{editingId ? "Sửa nghệ nhân" : "Thêm nghệ nhân"}</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Mã nghệ nhân</label>
                        <input value={form.id} onChange={(e) => updateField("id", e.target.value)} disabled={Boolean(editingId)} placeholder="vd: nguyen_van_ba" />
                    </div>
                    <div className="form-group">
                        <label>Tên nghệ nhân <span className="required">*</span></label>
                        <input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Cấp bậc</label>
                        <input value={form.rank} onChange={(e) => updateField("rank", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ</label>
                        <input value={form.address} onChange={(e) => updateField("address", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Điện thoại/Zalo</label>
                        <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Facebook URL</label>
                        <input value={form.zalo} onChange={(e) => updateField("zalo", e.target.value)} />
                    </div>
                    <div className="form-group-full">
                        <label>Bio</label>
                        <textarea rows="3" value={form.bio} onChange={(e) => updateField("bio", e.target.value)} />
                    </div>
                    <div className="form-group-full">
                        <label>Avatar URL</label>
                        <input value={form.avatar} onChange={(e) => updateField("avatar", e.target.value)} />
                    </div>
                    <div className="form-group-full">
                        <label>Cover URL</label>
                        <input value={form.cover} onChange={(e) => updateField("cover", e.target.value)} />
                    </div>
                    {!editingId && (
                        <div className="form-group-full admin-account-panel">
                            <div className="setting-action-row admin-account-panel-head">
                                <div className="setting-text">
                                    <strong>Tạo tài khoản đăng nhập nhanh</strong>
                                    <p>Không bắt buộc. Dùng cho nghệ nhân chưa rành công nghệ, họ có thể đăng nhập rồi tự cập nhật hồ sơ sau.</p>
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Tên đăng nhập</label>
                                    <input
                                        name="accountUsername"
                                        autoComplete="off"
                                        value={form.accountUsername}
                                        onChange={(e) => updateField("accountUsername", e.target.value)}
                                        placeholder="vd: vuon_sanh_ba"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu tạm</label>
                                    <input
                                        name="accountPassword"
                                        autoComplete="new-password"
                                        type="password"
                                        value={form.accountPassword}
                                        onChange={(e) => updateField("accountPassword", e.target.value)}
                                        placeholder="Tối thiểu 6 ký tự"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="form-submit-row">
                    <button className="btn-primary" disabled={Boolean(busyId)} type="submit">
                        <i className="fa-solid fa-floppy-disk"></i> Lưu nghệ nhân
                    </button>
                    {editingId && (
                        <button className="btn-secondary" type="button" onClick={resetForm}>
                            Hủy sửa
                        </button>
                    )}
                </div>
            </form>

            <div className="form-section-card">
                <h3>Danh sách nghệ nhân</h3>
                {loading ? (
                    <div className="no-results-card">Đang tải nghệ nhân...</div>
                ) : (
                    <div className="artisans-grid">
                        {artisans.map(artisan => (
                            <div className="artisan-card" key={artisan.id}>
                                <div className="artisan-card-banner" style={{ backgroundImage: `url('${artisan.cover}')` }}></div>
                                <div className="artisan-card-content">
                                    <img src={artisan.avatar} alt={artisan.name} className="artisan-card-avatar" />
                                    <div className="artisan-card-info">
                                        <span className="artisan-card-rank">{localize(artisan.rank)}</span>
                                        <h3>{artisan.name}</h3>
                                        <p className="artisan-card-loc"><i className="fa-solid fa-location-dot"></i> {localize(artisan.address)}</p>
                                        <div className="contact-buttons-group" style={{ marginTop: "14px" }}>
                                            <button className="btn-secondary" onClick={() => editArtisan(artisan)}>
                                                <i className="fa-solid fa-pen"></i> Sửa
                                            </button>
                                            <button className="btn-secondary text-danger" disabled={busyId === artisan.id} onClick={() => removeArtisan(artisan.id)}>
                                                <i className="fa-solid fa-trash"></i> Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
