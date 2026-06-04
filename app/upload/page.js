"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";

const MOCK_BONSAI_PHOTOS = [
    "https://images.unsplash.com/photo-1613143714311-6677f5f90382?w=800&q=80",
    "https://images.unsplash.com/photo-1520302873425-2404eb5212d7?w=800&q=80",
    "https://images.unsplash.com/photo-1512428813824-7b9e29a290a0?w=800&q=80",
    "https://images.unsplash.com/photo-1566908829550-e6551b00979b?w=800&q=80",
    "https://images.unsplash.com/photo-1510253687831-0f982d7862fc?w=800&q=80"
];

export default function UploadTree() {
    const router = useRouter();
    const { db, updateDb, t, showToast } = useApp();

    // Form states
    const [title, setTitle] = useState("");
    const [species, setSpecies] = useState("");
    const [style, setStyle] = useState("");
    const [size, setSize] = useState("");
    const [age, setAge] = useState("");
    const [origin, setOrigin] = useState("");
    const [status, setStatus] = useState("Đang giao lưu");
    const [price, setPrice] = useState("");
    const [story, setStory] = useState("");
    
    // Timeline steps
    const [timelineSteps, setTimelineSteps] = useState([
        { year: "2024", desc: "" }
    ]);

    // Simulated images selected
    const [selectedImages, setSelectedImages] = useState([]);

    const simulateImageUpload = () => {
        if (selectedImages.length >= 5) {
            showToast(t("toast_upload_image_error") === "Please click the image upload box to attach at least 1 mockup photo!" ? "Maximum 5 photos allowed!" : "Bạn chỉ được chọn tối đa 5 ảnh!", "error");
            return;
        }
        
        const nextImgUrl = MOCK_BONSAI_PHOTOS[selectedImages.length % MOCK_BONSAI_PHOTOS.length];
        setSelectedImages(prev => [...prev, nextImgUrl]);
        showToast(
            t("toast_upload_image_error") === "Please click the image upload box to attach at least 1 mockup photo!" 
                ? `Attached photo #${selectedImages.length + 1}`
                : `Đã đính kèm ảnh chụp góc cây số ${selectedImages.length + 1}`
        );
    };

    const addTimelineRow = () => {
        setTimelineSteps(prev => [...prev, { year: "", desc: "" }]);
    };

    const updateTimelineRow = (idx, field, val) => {
        setTimelineSteps(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: val };
            return next;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedImages.length === 0) {
            showToast(t("toast_upload_image_error"), "error");
            return;
        }

        const newId = `tree_${Date.now()}`;
        const isApproved = !db.moderationRequired;

        const newTree = {
            id: newId,
            title: {
                vi: title,
                en: title,
                jp: title
            },
            species: {
                vi: species,
                en: species,
                jp: species
            },
            style: style,
            size: size,
            age: {
                vi: age || "Chưa xác định",
                en: age || "Unknown",
                jp: age || "不明"
            },
            potAge: {
                vi: "Mới lên chậu",
                en: "Recently potted",
                jp: "新鉢植え"
            },
            origin: {
                vi: origin || "Việt Nam",
                en: origin || "Vietnam",
                jp: origin || "ベトナム"
            },
            status: status,
            price: price ? parseFloat(price) : 0,
            story: {
                vi: story || "Tác phẩm cây cảnh Bonsai nghệ thuật.",
                en: story || "An artistic Bonsai plant masterpiece.",
                jp: story || "芸術的な盆栽作品。"
            },
            images: [...selectedImages],
            ownerId: "nguyen_van_ba", // Default logged in artisan
            approved: isApproved,
            evolution: timelineSteps.map(step => ({
                year: step.year,
                desc: {
                    vi: step.desc,
                    en: step.desc,
                    jp: step.desc
                }
            }))
        };

        // Update Global Database
        updateDb(prev => ({
            ...prev,
            trees: [newTree, ...prev.trees]
        }));

        if (isApproved) {
            showToast(t("toast_upload_success_public"));
            router.push("/");
        } else {
            showToast(t("toast_upload_success_pending"), "success");
            router.push("/artisan/nguyen_van_ba");
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>{t("upload_title")}</h2>
                <p>{t("upload_subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* 1. General Specs */}
                <div className="form-section-card">
                    <h3>{t("upload_section_info")}</h3>
                    <div className="form-grid">
                        <div className="form-group-full">
                            <label>{t("upload_field_title")} <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="VD: Si cổ Thác Đổ - Long Thăng"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("upload_field_species")} <span className="required">*</span></label>
                            <input 
                                type="text" 
                                placeholder="VD: Sanh Nam Điền, Linh Sam..."
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("upload_field_style")} <span className="required">*</span></label>
                            <select value={style} onChange={(e) => setStyle(e.target.value)} required>
                                <option value="">-- {t("detail_back") === "Back" ? "Select Style" : t("detail_back") === "戻る" ? "樹形を選択" : "Chọn dáng thế"} --</option>
                                <option value="Trực">{t("detail_back") === "Back" ? "Formal Upright" : t("detail_back") === "戻る" ? "直幹" : "Dáng Trực"}</option>
                                <option value="Trực Lắc">{t("detail_back") === "Back" ? "Informal Upright" : t("detail_back") === "戻る" ? "模様木" : "Trực Lắc"}</option>
                                <option value="Xiêu / Tà">{t("detail_back") === "Back" ? "Slanting" : t("detail_back") === "戻る" ? "斜幹" : "Dáng Xiêu"}</option>
                                <option value="Hoành">{t("detail_back") === "Back" ? "Semi-cascade" : t("detail_back") === "戻る" ? "吹流し" : "Dáng Hoành"}</option>
                                <option value="Huyền / Thác Đổ">{t("detail_back") === "Back" ? "Cascade" : t("detail_back") === "戻る" ? "懸崖" : "Dáng Thác Đổ"}</option>
                                <option value="Song Thụ">{t("detail_back") === "Back" ? "Twin Trunk" : t("detail_back") === "戻る" ? "双幹" : "Song Thụ"}</option>
                                <option value="Tam Đa">{t("detail_back") === "Back" ? "Triple Trunk" : t("detail_back") === "戻る" ? "三幹" : "Tam Đa"}</option>
                                <option value="Bạt Phong">{t("detail_back") === "Back" ? "Windswept" : t("detail_back") === "戻る" ? "風化" : "Bạt Phong"}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t("upload_field_size")} <span className="required">*</span></label>
                            <select value={size} onChange={(e) => setSize(e.target.value)} required>
                                <option value="">-- {t("detail_back") === "Back" ? "Select Size" : t("detail_back") === "戻る" ? "サイズを選択" : "Chọn kích thước"} --</option>
                                <option value="Siêu Mini">{t("detail_back") === "Back" ? "Keshitsubo (<10cm)" : t("detail_back") === "戻る" ? "豆盆栽 (<10cm)" : "Siêu Mini (<10cm)"}</option>
                                <option value="Mini">{t("detail_back") === "Back" ? "Shohin (10-25cm)" : t("detail_back") === "戻る" ? "ミニ盆栽 (10-25cm)" : "Mini (10-25cm)"}</option>
                                <option value="Trung">{t("detail_back") === "Back" ? "Medium (25-60cm)" : t("detail_back") === "戻る" ? "中品盆栽 (25-60cm)" : "Cỡ Trung (25-60cm)"}</option>
                                <option value="Đại">{t("detail_back") === "Back" ? "Large (60-120cm)" : t("detail_back") === "戻る" ? "大物盆栽 (60-120cm)" : "Cỡ Đại (60-120cm)"}</option>
                                <option value="Cổ Thụ">{t("detail_back") === "Back" ? "Imperial (>120cm)" : t("detail_back") === "戻る" ? "巨大盆栽 (>120cm)" : "Cổ Thụ (>120cm)"}</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{t("upload_field_age")}</label>
                            <input 
                                type="text" 
                                placeholder="VD: ~25 năm, tuổi chậu 10 năm"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("upload_field_origin")}</label>
                            <input 
                                type="text" 
                                placeholder="VD: Nam Định, Vĩnh Long..."
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>{t("upload_field_status")} <span className="required">*</span></label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                                <option value="Đang giao lưu">{t("status_sale")}</option>
                                <option value="Trưng bày">{t("status_exhibit")}</option>
                                <option value="Đang tạo tác">{t("status_training")}</option>
                            </select>
                        </div>
                        {status === "Đang giao lưu" && (
                            <div className="form-group">
                                <label>{t("upload_field_price")}</label>
                                <input 
                                    type="number" 
                                    placeholder="VD: 50000000"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Photo Gallery & Concept */}
                <div className="form-section-card">
                    <h3>{t("upload_section_media")}</h3>
                    <div className="form-group-full">
                        <label>{t("detail_timeline_title")} (Tối đa 5 ảnh) <span className="required">*</span></label>
                        <div className="image-upload-simulation" onClick={simulateImageUpload}>
                            <i className="fa-solid fa-images upload-box-icon"></i>
                            <p>{t("upload_media_box")}</p>
                            <span className="upload-tip">{t("upload_media_tip")}</span>
                        </div>
                        <div className="uploaded-previews-list">
                            {selectedImages.map((imgUrl, idx) => (
                                <img key={idx} src={imgUrl} className="preview-thumbnail" alt="Preview" />
                            ))}
                        </div>
                    </div>

                    <div className="form-group-full" style={{ marginTop: "16px" }}>
                        <label>{t("upload_field_story")}</label>
                        <textarea 
                            rows="4" 
                            placeholder="Ý tưởng, lịch sử đi dây tạo cành..."
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* 3. Evolution Timeline */}
                <div className="form-section-card">
                    <h3>{t("upload_section_timeline")}</h3>
                    <p className="form-help-text">{t("upload_timeline_tip")}</p>
                    
                    <div id="timeline-input-list">
                        {timelineSteps.map((step, idx) => (
                            <div className="timeline-input-row" key={idx}>
                                <input 
                                    type="text" 
                                    className="tl-year" 
                                    placeholder="Year" 
                                    value={step.year}
                                    onChange={(e) => updateTimelineRow(idx, "year", e.target.value)}
                                    required 
                                />
                                <input 
                                    type="text" 
                                    className="tl-desc" 
                                    placeholder="Description" 
                                    value={step.desc}
                                    onChange={(e) => updateTimelineRow(idx, "desc", e.target.value)}
                                    required 
                                />
                            </div>
                        ))}
                    </div>
                    <button type="button" className="btn-secondary" onClick={addTimelineRow}>
                        <i className="fa-solid fa-plus"></i> {t("upload_timeline_add")}
                    </button>
                </div>

                {/* Submit Row */}
                <div className="form-submit-row">
                    <button type="submit" className="btn-primary large-btn">
                        <i className="fa-solid fa-floppy-disk"></i> {t("upload_submit")}
                    </button>
                </div>
            </form>
        </div>
    );
}
