"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
};

export default function AdminArtisansPage() {
    const { t, localize, showToast } = useApp();
    const [artisans, setArtisans] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState("");

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
        /* eslint-disable react-hooks/set-state-in-effect */
        loadArtisans();
        /* eslint-enable react-hooks/set-state-in-effect */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            showToast("Đã lưu nghệ nhân.");
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

    return (
        <div className="form-container">
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
                        <label>Điện thoại</label>
                        <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Zalo URL</label>
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
