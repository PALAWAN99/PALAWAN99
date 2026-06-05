"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardReaderStatus } from "@/components/CardReaderStatus";
import { CitizenInfoCard, CitizenInfoSkeleton } from "@/components/CitizenInfo";
import { DiagnosticPanel } from "@/components/DiagnosticPanel";
import { ExportButtons } from "@/components/ExportButtons";
import { PdpaConsentModal } from "@/components/PdpaConsentModal";
import { RfidReader } from "@/components/RfidReader";
import { WinUsbGuide } from "@/components/WinUsbGuide";
import {
  fetchReaders,
  resetReaderConnection,
  subscribeCardEvents,
  type ReaderInfo,
  type CitizenInfo,
  type CardEvent,
} from "@/lib/api";
import { getCardApiBase, getDefaultCardApiBase } from "@/lib/card-api-base";

type ActiveTab = "idcard" | "rfid";

export type SmartCardReaderPageProps = {
  /** When true, hides duplicate page title (use inside Admin shell). */
  embedded?: boolean;
  apiUrl?: string;
};

function StepPill({
  n,
  label,
  state,
}: {
  n: number;
  label: string;
  state: "done" | "active" | "idle";
}) {
  return (
    <div
      className={`flex flex-1 min-w-0 items-center gap-2 rounded-lg px-2 py-2 text-xs sm:text-sm ${
        state === "active"
          ? "bg-sky-50 text-sky-900 ring-1 ring-sky-200"
          : state === "done"
            ? "bg-emerald-50/80 text-emerald-900"
            : "text-slate-500"
      }`}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          state === "done"
            ? "bg-emerald-600 text-white"
            : state === "active"
              ? "bg-sky-600 text-white"
              : "bg-slate-200 text-slate-600"
        }`}
      >
        {state === "done" ? "✓" : n}
      </span>
      <span className="font-medium truncate">{label}</span>
    </div>
  );
}

export function SmartCardReaderPage({
  embedded = false,
  apiUrl,
}: SmartCardReaderPageProps) {
  const cardApiBase = apiUrl ?? getCardApiBase();
  const [readers, setReaders] = useState<ReaderInfo[]>([]);
  const [citizenData, setCitizenData] = useState<CitizenInfo | null>(null);
  const [isLoadingReaders, setIsLoadingReaders] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [pdpaConsented, setPdpaConsented] = useState(false);
  const [showPdpaModal, setShowPdpaModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("idcard");
  const [clientEnv, setClientEnv] = useState<{ os: string; browser: string } | null>(null);
  const clientEnvInit = useRef(false);

  const loadReaders = useCallback(async () => {
    setIsLoadingReaders(true);
    try {
      const response = await fetchReaders();
      setReaders(response.readers);
      setError(null);
    } catch {
      setReaders([]);
      setError("ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบว่า Python server ทำงานอยู่");
    } finally {
      setIsLoadingReaders(false);
    }
  }, []);

  const handleReaderStatusRefresh = useCallback(async () => {
    try {
      await resetReaderConnection();
    } catch {
      // still reload so the page and WebSocket re-initialize
    }
    window.location.reload();
  }, []);

  const partialRef = useRef<Partial<CitizenInfo>>({});

  const handleReadCard = () => {
    setIsReading(true);
    setError(null);
    setCitizenData(null);
    setProgress(0);
    setProgressMsg("กำลังเชื่อมต่อเครื่องอ่าน...");
    partialRef.current = {};
    setReaders((prev) =>
      prev.length > 0
        ? prev.map((r) => ({ ...r, has_card: true }))
        : [{ name: "DUALi DE-620", has_card: true }]
    );

    const evtSource = new EventSource(`${cardApiBase}/api/read-card-stream`);

    evtSource.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.progress !== undefined) {
          setProgress(payload.progress);
          setProgressMsg(payload.message || "");

          if (payload.field && payload.value !== undefined) {
            const f = payload.field as string;
            const v = payload.value;
            if (f === "th_name" && typeof v === "object") {
              partialRef.current = { ...partialRef.current, ...v };
            } else {
              partialRef.current = { ...partialRef.current, [f]: v };
            }
            setCitizenData({
              cid: "",
              th_prefix: "", th_firstname: "", th_middlename: "", th_lastname: "",
              en_prefix: "", en_firstname: "", en_middlename: "", en_lastname: "",
              date_of_birth: "", gender: "", card_issuer: "",
              issue_date: "", expire_date: "", address: "",
              photo_base64: null,
              ...partialRef.current,
            });
          }
        } else if (payload.done && payload.data) {
          const d = payload.data as CitizenInfo;
          setCitizenData(d);
          evtSource.close();
          setIsReading(false);
        } else if (payload.error) {
          setError(payload.error);
          evtSource.close();
          setIsReading(false);
        }
      } catch {
        // ignore
      }
    };

    evtSource.onerror = () => {
      evtSource.close();
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ Backend");
      setIsReading(false);
    };
  };

  const handlePhotoLoaded = (photo: string) => {
    if (citizenData) {
      setCitizenData({ ...citizenData, photo_base64: photo });
    }
  };

  const handleCardEvent = useCallback(
    (event: CardEvent) => {
      if (event.event === "card_inserted") {
        loadReaders();
      } else if (event.event === "card_removed") {
        loadReaders();
        setCitizenData(null);
      }
    },
    [loadReaders]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingReaders(true);
      try {
        const response = await fetchReaders();
        if (cancelled) return;
        setReaders(response.readers);
        setError(null);
      } catch {
        if (cancelled) return;
        setReaders([]);
        setError("ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบว่า Python server ทำงานอยู่");
      } finally {
        if (!cancelled) setIsLoadingReaders(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (isReading) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let reachable = true;

    const schedule = (ms: number) => {
      if (cancelled) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void tick(), ms);
    };

    const tick = async () => {
      if (cancelled) return;
      if (document.hidden) {
        schedule(120_000);
        return;
      }
      try {
        const response = await fetchReaders();
        reachable = true;
        setReaders(response.readers);
      } catch {
        reachable = false;
      }
      schedule(reachable ? 5000 : 45_000);
    };

    void tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [isReading]);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = subscribeCardEvents(handleCardEvent, {
      onConnect: () => {
        if (!cancelled) setWsConnected(true);
      },
      onDisconnect: () => {
        if (!cancelled) setWsConnected(false);
      },
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [handleCardEvent]);

  useEffect(() => {
    if (clientEnvInit.current) return;
    clientEnvInit.current = true;

    const ua = navigator.userAgent;
    let os = "Unknown OS";
    if (ua.includes("Win")) {
      const match = ua.match(/Windows NT (\d+\.\d+)/);
      const ver = match ? (parseFloat(match[1]) >= 10 ? (ua.includes("Windows NT 10.0") ? "10/11" : match[1]) : match[1]) : "";
      os = `Windows ${ver}`.trim();
    } else if (ua.includes("Mac OS X")) {
      const match = ua.match(/Mac OS X ([\d_]+)/);
      os = `macOS ${match ? match[1].replace(/_/g, ".") : ""}`.trim();
    } else if (ua.includes("Linux")) {
      os = "Linux";
    }

    let browser = "Unknown Browser";
    if (ua.includes("Edg/")) {
      const match = ua.match(/Edg\/([\d.]+)/);
      browser = `Edge ${match ? match[1].split(".")[0] : ""}`.trim();
    } else if (ua.includes("Chrome/")) {
      const match = ua.match(/Chrome\/([\d.]+)/);
      browser = `Chrome ${match ? match[1].split(".")[0] : ""}`.trim();
    } else if (ua.includes("Firefox/")) {
      const match = ua.match(/Firefox\/([\d.]+)/);
      browser = `Firefox ${match ? match[1].split(".")[0] : ""}`.trim();
    } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
      const match = ua.match(/Version\/([\d.]+)/);
      browser = `Safari ${match ? match[1].split(".")[0] : ""}`.trim();
    }

    requestAnimationFrame(() => setClientEnv({ os, browser }));
  }, []);

  const isWindows = clientEnv?.os.toLowerCase().includes("windows") ?? false;
  const hasReader = readers.length > 0;
  const isBackendOffline =
    !!error &&
    (error.includes("Backend") || error.includes("ไม่สามารถเชื่อมต่อ"));
  const connectionStep: "done" | "active" | "idle" = isBackendOffline
    ? "active"
    : hasReader
      ? "done"
      : isLoadingReaders
        ? "idle"
        : "active";
  const consentStep: "done" | "active" | "idle" = pdpaConsented
    ? "done"
    : connectionStep === "done"
      ? "active"
      : "idle";
  const readStep: "done" | "active" | "idle" =
    citizenData && !isReading ? "done" : pdpaConsented && hasReader ? "active" : "idle";

  const mainClass = embedded
    ? "w-full px-4 py-4 sm:px-5 sm:py-5"
    : "flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-8";

  return (
    <main className={mainClass}>
      {!embedded && (
        <header className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-slate-800 via-sky-800 to-slate-800 dark:from-slate-100 dark:via-sky-200 dark:to-slate-100 bg-clip-text text-transparent">
            Smart Card Reader
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            DUALi DE-620
          </p>
        </header>
      )}

      {!embedded && (
        <div className="mb-5">
          <DiagnosticPanel />
        </div>
      )}

      <div
        className={
          embedded
            ? "rounded-xl border border-slate-200/90 bg-white overflow-hidden"
            : "rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/25 overflow-hidden mb-6"
        }
      >
        <div className="border-b border-slate-200/70 bg-slate-50/80 px-3 sm:px-4 py-3">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2.5">
            เลือกโหมด
          </p>
      <nav aria-label="โหมดการอ่าน">
        <div className="flex rounded-xl p-1 gap-1 border bg-slate-100/90 border-slate-200/90">
          <button
            type="button"
            onClick={() => setActiveTab("idcard")}
            className={`flex-1 min-h-13 rounded-xl px-3 sm:px-5 py-3 font-semibold text-sm sm:text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
              activeTab === "idcard"
                ? "bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-200 shadow-md border border-sky-200/80 dark:border-sky-500/40 ring-2 ring-sky-100/80 dark:ring-sky-900/50"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50"
            }`}
          >
            <span className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
              <span>บัตรประชาชน</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rfid")}
            className={`flex-1 min-h-13 rounded-xl px-3 sm:px-5 py-3 font-semibold text-sm sm:text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
              activeTab === "rfid"
                ? "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 shadow-md border border-emerald-200/80 dark:border-emerald-500/40 ring-2 ring-emerald-100/80 dark:ring-emerald-900/50"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50"
            }`}
          >
            <span className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span>อ่าน RFID</span>
            </span>
          </button>
        </div>
      </nav>
        </div>

        <div className="p-4 sm:p-5 bg-slate-50/40 space-y-5">
      {activeTab === "rfid" ? (
        <RfidReader />
      ) : (
      <div className="space-y-5">
        <div className="flex gap-2" aria-label="ขั้นตอนการใช้งาน">
          <StepPill n={1} label="เชื่อมต่อ" state={connectionStep} />
          <StepPill n={2} label="ยินยอม PDPA" state={consentStep} />
          <StepPill n={3} label="อ่านบัตร" state={readStep} />
        </div>

        {isBackendOffline && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            <p className="font-semibold">ไม่สามารถเชื่อมต่อ Backend</p>
            <p className="mt-1 text-red-800/90">
              ตรวจสอบว่า Python server ทำงานที่{" "}
              <code className="rounded bg-red-100/80 px-1.5 py-0.5 text-xs">{apiUrl}</code>
            </p>
          </div>
        )}

        <CardReaderStatus
          readers={readers}
          isConnected={wsConnected}
          isLoading={isLoadingReaders}
          onRefresh={handleReaderStatusRefresh}
          backendOffline={isBackendOffline}
          embedded
        />

        <section className="space-y-3">
          {!pdpaConsented ? (
            <Button
              onClick={() => setShowPdpaModal(true)}
              disabled={!hasReader || isBackendOffline}
              className="w-full h-12 shadow-md bg-linear-to-r from-sky-700 to-sky-600 hover:from-sky-600 hover:to-sky-500 text-white"
              size="lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              ให้ความยินยอม PDPA ก่อนอ่านบัตร
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleReadCard}
                disabled={isReading || !hasReader}
                className="flex-1 h-11 sm:h-12 shadow-md bg-linear-to-r from-slate-800 to-sky-800 hover:from-slate-700 hover:to-sky-700 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-500 dark:hover:to-cyan-500"
                size="lg"
              >
                {isReading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    กำลังอ่านบัตร...
                  </>
                ) : (
                  "คลิกเพื่ออ่านบัตร"
                )}
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="lg"
                className="h-11 sm:h-12 shrink-0 border-slate-300 dark:border-slate-600"
                title="รีเฟรชหน้า"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </Button>
            </div>
          )}
        </section>

        {error && !isBackendOffline && (
          <Card className={error.includes("EMPTY") || error.includes("NO IC CARD") || error.includes("ไม่พบบัตร")
            ? "border-amber-300 bg-amber-50"
            : "border-destructive"
          }>
            <CardContent className="py-4 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 shrink-0 ${
                error.includes("EMPTY") || error.includes("NO IC CARD") || error.includes("ไม่พบบัตร")
                  ? "text-amber-500"
                  : "text-destructive"
              }`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <p className={`text-sm font-medium ${
                error.includes("EMPTY") || error.includes("NO IC CARD") || error.includes("ไม่พบบัตร")
                  ? "text-amber-700"
                  : "text-destructive"
              }`}>
                {error.includes("EMPTY") || error.includes("NO IC CARD")
                  ? "กรุณาสอดบัตรประชาชน แล้วคลิกเพื่ออ่าน"
                  : error}
              </p>
            </CardContent>
          </Card>
        )}

        {isReading && !citizenData && (
          <div className="space-y-4">
            <CitizenInfoSkeleton />
            <Card>
              <CardContent className="py-4 space-y-2">
                <div className="w-full bg-muted/80 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden ring-1 ring-inset ring-slate-200/50 dark:ring-slate-600/50">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progressMsg || "กำลังอ่านข้อมูลจากบัตร..."}</span>
                  <span>{progress}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isReading && citizenData && (
          <div className="space-y-4">
            <CitizenInfoCard data={citizenData} onPhotoLoaded={handlePhotoLoaded} loading />
            <Card>
              <CardContent className="py-4 space-y-2">
                <div className="w-full bg-muted/80 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden ring-1 ring-inset ring-slate-200/50 dark:ring-slate-600/50">
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progressMsg || "กำลังอ่านข้อมูลจากบัตร..."}</span>
                  <span>{progress}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isReading && citizenData && (
          <>
            <CitizenInfoCard data={citizenData} onPhotoLoaded={handlePhotoLoaded} />
            <ExportButtons data={citizenData} />
          </>
        )}
      </div>
      )}
        </div>

        <footer
          className={
            embedded
              ? "mt-6 pt-4 border-t border-slate-200/80 text-center text-xs text-muted-foreground space-y-1"
              : "mt-8 pt-5 border-t border-slate-200/80 text-center text-xs text-muted-foreground space-y-1"
          }
        >
        <p>Smart Card Reader : KKU Library</p>
        {clientEnv && (
          <p className="flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              {isWindows ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M3 12V6.5l8-1.1V12H3zm0 .5h8v6.6l-8-1.1V12.5zM12 5.3l9-1.3v8h-9V5.3zm0 7.2h9v8l-9-1.3v-6.7z"/>
                </svg>
              ) : clientEnv.os.includes("macOS") ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              )}
              {clientEnv.os}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              {clientEnv.browser}
            </span>
          </p>
        )}
        </footer>
      </div>

      <PdpaConsentModal
        open={showPdpaModal}
        onConsent={() => {
          setPdpaConsented(true);
          setShowPdpaModal(false);
        }}
        onCancel={() => setShowPdpaModal(false)}
      />

      {isWindows && <WinUsbGuide />}
    </main>
  );
}
