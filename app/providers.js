"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../lib/translations";
import { getDbState, saveDbState } from "../lib/db";
import { api } from "../lib/api-client";

// Contexts
const AppContext = createContext(null);

export function AppProvider({ children }) {
    // Theme and Language states (Client-side initialized to prevent SSR mismatch)
    const [theme, setThemeState] = useState(() => {
        if (typeof window === "undefined") return "light";
        return localStorage.getItem("bh_theme") || "light";
    });
    const [lang, setLangState] = useState(() => {
        if (typeof window === "undefined") return "vi";
        return localStorage.getItem("bh_lang") || "vi";
    });
    const [db, setDb] = useState({ artisans: {}, trees: [], moderationRequired: false });
    const [currentUser, setCurrentUser] = useState(null);
    const [mounted, setMounted] = useState(false);

    const refreshDb = async () => {
        const dbState = await api.bootstrap();
        setDb(dbState);
        saveDbState(dbState);
        return dbState;
    };

    const refreshSession = async () => {
        try {
            const user = await api.me();
            setCurrentUser(user);
            return user;
        } catch {
            setCurrentUser(null);
            return null;
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        // Load server-backed database state, with the original local seed as a dev fallback.
        Promise.allSettled([refreshDb(), refreshSession()])
            .then((results) => {
                const dbResult = results[0];
                if (dbResult.status === "rejected") {
                    throw dbResult.reason;
                }
            })
            .catch(() => {
                const dbState = getDbState();
                setDb(dbState);
            })
            .finally(() => {
                setMounted(true);
            });
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem("bh_theme", newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const setLang = (newLang) => {
        setLangState(newLang);
        localStorage.setItem("bh_lang", newLang);
    };

    const updateDb = (updater) => {
        setDb(prev => {
            const nextDb = typeof updater === "function" ? updater(prev) : updater;
            saveDbState(nextDb);
            return nextDb;
        });
    };

    const logout = async () => {
        await api.logout();
        setCurrentUser(null);
    };

    // Translation helper
    const t = (key) => {
        const text = translations[lang] && translations[lang][key];
        return text || key;
    };

    // Get localized text from database values (e.g. tree.title has vi, en, jp subfields)
    const localize = (obj) => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        return obj[lang] || obj["vi"] || "";
    };

    // Toast notification manager
    const [toasts, setToasts] = useState([]);
    const showToast = (message, type = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        // Auto remove
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3800);
    };

    const value = {
        theme,
        setTheme,
        lang,
        setLang,
        db,
        updateDb,
        refreshDb,
        currentUser,
        refreshSession,
        logout,
        t,
        localize,
        showToast,
        mounted
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast ${toast.type === "error" ? "toast-error" : ""}`}>
                        <i className={`toast-icon fa-solid ${toast.type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}`}></i>
                        <span className="toast-msg">{toast.message}</span>
                    </div>
                ))}
            </div>
        </AppContext.Provider>
    );
}

// Custom hooks
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
