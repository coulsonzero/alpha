import { useEffect, useRef } from "react";
import { recordVisit, sendVisitHeartbeat } from "@/api/visitor";
import { useAuth } from "./AuthProvider";
import { useLocation } from "react-router-dom";

const VISITOR_ID_KEY = "visitor_id";
const VISITOR_START_KEY = "visitor_started_at";
const VISITOR_PROFILE_KEY = "visitor_profile";

function getVisitorBucket(userId: number | string | null | undefined) {
  return userId ? `user:${userId}` : "guest";
}

type VisitorProfile = {
  ip?: string;
  visitorId?: string;
};

function getProfileKey(bucket: string) {
  return `${VISITOR_PROFILE_KEY}:${bucket}`;
}

function readProfile(bucket: string): VisitorProfile | null {
  try {
    const raw = localStorage.getItem(getProfileKey(bucket));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeProfile(bucket: string, profile: VisitorProfile) {
  try {
    localStorage.setItem(getProfileKey(bucket), JSON.stringify(profile));
  } catch {
    /* ignore storage errors */
  }
}

function getOrCreateVisitorId(bucket: string, ip?: string) {
  const profile = readProfile(bucket);
  if (ip && profile?.ip === ip && profile.visitorId) return profile.visitorId;

  try {
    const existing = localStorage.getItem(`${VISITOR_ID_KEY}:${bucket}:${ip || "pending"}`);
    if (existing) return existing;
    const next = crypto.randomUUID();
    localStorage.setItem(`${VISITOR_ID_KEY}:${bucket}:${ip || "pending"}`, next);
    return next;
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function getStartTime(bucket: string, visitorId: string) {
  try {
    const saved = localStorage.getItem(`${VISITOR_START_KEY}:${bucket}:${visitorId}`);
    if (saved) return Number(saved) || Date.now();
    const now = Date.now();
    localStorage.setItem(`${VISITOR_START_KEY}:${bucket}:${visitorId}`, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

function buildPayload(visitorId: string, startAt: number) {
  const duration = Math.max(0, Math.floor((Date.now() - startAt) / 1000));
  return {
    visitor_id: visitorId,
    duration,
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    title: document.title || undefined,
    user_agent: navigator.userAgent,
  };
}

function heartbeatUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  return `${base.replace(/\/$/, "")}/visit/heartbeat`;
}

export const VisitorTracker = () => {
  const location = useLocation();
  const { user } = useAuth();
  const bucket = getVisitorBucket(user?.id);
  const profileRef = useRef<VisitorProfile>(readProfile(bucket) || {});
  const visitorIdRef = useRef<string>(getOrCreateVisitorId(bucket, profileRef.current.ip));
  const startAtRef = useRef<number>(getStartTime(bucket, visitorIdRef.current));
  const heartbeatRef = useRef<number | null>(null);
  const sentFirstRef = useRef(false);

  useEffect(() => {
    const profile = readProfile(bucket) || {};
    profileRef.current = profile;
    visitorIdRef.current = getOrCreateVisitorId(bucket, profile.ip);
    startAtRef.current = getStartTime(bucket, visitorIdRef.current);
    sentFirstRef.current = false;
  }, [bucket]);

  useEffect(() => {
    const visitorId = visitorIdRef.current;
    const startAt = startAtRef.current;

    const applyServerProfile = (response: any) => {
      const data = response?.data?.data || response?.data || {};
      const ip = data?.ip || data?.client_ip || data?.clientIp || data?.remote_ip || data?.remoteIp || data?.visitor_ip || null;
      if (!ip) return;
      const nextVisitorId = getOrCreateVisitorId(bucket, ip);
      if (nextVisitorId !== visitorIdRef.current) {
        visitorIdRef.current = nextVisitorId;
        startAtRef.current = getStartTime(bucket, nextVisitorId);
      }
      profileRef.current = { ip, visitorId: nextVisitorId };
      writeProfile(bucket, profileRef.current);
    };

    const sendVisit = async () => {
      const res = await recordVisit(buildPayload(visitorId, startAt)).catch(() => null);
      if (res) applyServerProfile(res);
    };
    const sendHeartbeat = async () => {
      const res = await sendVisitHeartbeat(buildPayload(visitorId, startAt)).catch(() => null);
      if (res) applyServerProfile(res);
    };

    if (!sentFirstRef.current) {
      sentFirstRef.current = true;
      sendVisit();
    }

    heartbeatRef.current = window.setInterval(sendHeartbeat, 45000);

    const handlePageHide = () => {
      navigator.sendBeacon?.(
        heartbeatUrl(),
        new Blob([JSON.stringify(buildPayload(visitorId, startAt))], { type: "application/json" }),
      );
    };

    window.addEventListener("beforeunload", handlePageHide);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
      window.removeEventListener("beforeunload", handlePageHide);
      window.removeEventListener("pagehide", handlePageHide);
      void sendHeartbeat();
    };
  }, [location.pathname, bucket]);

  return null;
};
