"use client";

import { supabase } from "./supabase";

export interface WayfareUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider?: string;
}

const AUTH_STORAGE_KEY = "wayfare_user";
const AUTH_EVENT_NAME = "wayfare_auth_state_changed";

/**
 * Get current stored user synchronously from localStorage
 */
export function getStoredUser(): WayfareUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacyEmail = localStorage.getItem("wayfare_user_email");
    if (legacyEmail) {
      return { id: "voyager-guest", email: legacyEmail, name: legacyEmail.split("@")[0] };
    }
  } catch (e) {
    console.warn("Error reading stored user:", e);
  }
  return null;
}

/**
 * Save user locally and dispatch an event so all UI components update instantly
 */
export function setStoredUser(user: WayfareUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("wayfare_user_email", user.email);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem("wayfare_user_email");
    }
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: user }));
  } catch (e) {
    console.warn("Error storing user:", e);
  }
}

/**
 * Subscribe to auth changes across any component
 */
export function onAuthChanged(callback: (user: WayfareUser | null) => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: any) => {
    callback(e.detail ?? null);
  };
  window.addEventListener(AUTH_EVENT_NAME, handler);
  return () => window.removeEventListener(AUTH_EVENT_NAME, handler);
}

/**
 * Helper to convert Supabase User to WayfareUser
 */
export function toWayfareUser(sbUser: any): WayfareUser {
  const metadata = sbUser.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    (sbUser.email ? sbUser.email.split("@")[0] : "Voyager");
  const avatar = metadata.avatar_url || metadata.picture || "";
  return {
    id: sbUser.id,
    email: sbUser.email || "",
    name,
    avatar,
    provider: sbUser.app_metadata?.provider || "google",
  };
}
