"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { readRfid, type RfidResult } from "@/lib/api";

interface ScanRecord {
  id: number;
  timestamp: string;
  result: RfidResult;
}

function formatUidHex(hex: string): string {
  return hex.match(/.{1,2}/g)?.join(" ") || hex;
}

const POLL_INTERVAL_MS = 1500;

export function RfidReader() {
  const t = useTranslations("IdCard");
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<RfidResult | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [autoScan, setAutoScan] = useState(true);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const doScan = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsScanning(true);
    try {
      const result = await readRfid();
      if (!mountedRef.current) return;
      setLastResult(result);
      if (result.success) {
        setHistory((prev) => {
          const isDuplicate = prev.length > 0 && prev[0].result.uid_hex === result.uid_hex;
          if (isDuplicate) return prev;
          return [
            {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString("th-TH"),
              result,
            },
            ...prev,
          ].slice(0, 20);
        });
      }
    } catch (e) {
      if (!mountedRef.current) return;
      setLastResult({ success: false, error: String(e) });
    } finally {
      if (mountedRef.current) setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!autoScan) {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    let active = true;

    const poll = async () => {
      if (!active) return;
      await doScan();
      if (active && autoScan) {
        pollingRef.current = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();

    return () => {
      active = false;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [autoScan, doScan]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Tap Area */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            onClick={() => { if (!isScanning) doScan(); }}
            className={`relative flex flex-col items-center justify-center py-12 px-6 cursor-pointer select-none transition-all duration-300 ${
              isScanning
                ? "bg-emerald-50"
                : lastResult?.success
                  ? "bg-emerald-50/50 hover:bg-emerald-50"
                  : "bg-slate-50 hover:bg-slate-100"
            }`}
          >
            {/* Pulse ring animation when scanning */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full border-4 border-emerald-300 animate-ping opacity-20" />
              </div>
            )}

            <div className={`relative z-10 flex flex-col items-center gap-4 ${isScanning ? "animate-pulse" : ""}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isScanning
                  ? "bg-emerald-100 text-emerald-600"
                  : lastResult?.success
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-200 text-slate-500"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
                </svg>
              </div>

              <div className="text-center space-y-1">
                {isScanning ? (
                  <p className="text-lg font-semibold text-emerald-700">{t("rfidScanning")}</p>
                ) : lastResult?.success ? (
                  <p className="text-lg font-semibold text-emerald-700">{t("rfidFound")}</p>
                ) : lastResult && !lastResult.success && (lastResult.error?.includes("เครื่องอ่านหลุด") || lastResult.error?.toLowerCase().includes("lost") || lastResult.error?.toLowerCase().includes("disconnected")) ? (
                  <p className="text-lg font-semibold text-amber-600">{t("rfidReaderLost")}</p>
                ) : (
                  <p className="text-lg font-semibold text-slate-700">{t("rfidPlaceCard")}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {autoScan ? t("rfidAutoHint") : t("rfidManualHint")}
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                isScanning ? "bg-amber-400 animate-pulse" : autoScan ? "bg-emerald-400" : "bg-slate-300"
              }`} />
              <span className="text-xs text-slate-500">
                {isScanning ? t("rfidStatusScan") : autoScan ? t("rfidStatusAuto") : t("rfidStatusPaused")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setAutoScan(!autoScan)}
          variant={autoScan ? "default" : "outline"}
          size="sm"
          className="flex-1"
        >
          {autoScan ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
              {t("rfidStopAuto")}
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
              {t("rfidStartAuto")}
            </>
          )}
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
          title={t("btnRefreshPage")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </Button>
      </div>

      {/* Error — only show critical errors, not "no card" during auto-scan */}
      {lastResult && !lastResult.success && lastResult.error && 
        !lastResult.error.includes("ไม่พบบัตร") && 
        !lastResult.error.toLowerCase().includes("no card") && 
        !lastResult.error.toLowerCase().includes("empty") && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          {lastResult.error}
        </div>
      )}

      {/* Result */}
      {lastResult?.success && (
        <Card>
          <CardContent className="py-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {t("rfidSuccess")} — {lastResult.card_type}
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t("rfidUidHex")}</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-lg font-mono font-bold text-slate-800 border">
                    {formatUidHex(lastResult.uid_hex!)}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(lastResult.uid_hex!, "hex")}
                    className="shrink-0"
                  >
                    {copied === "hex" ? t("rfidCopied") : t("rfidCopy")}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t("rfidUidDecimal")}</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-xl font-mono font-bold text-indigo-700 border">
                    {lastResult.uid_decimal}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(lastResult.uid_decimal!, "dec")}
                    className="shrink-0"
                  >
                    {copied === "dec" ? t("rfidCopied") : t("rfidCopy")}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 text-xs text-slate-500">
                <span>{t("rfidLength", { length: lastResult.uid_length ?? 0 })}</span>
                <span>Bytes: [{lastResult.uid_bytes?.map(b => `0x${b.toString(16).toUpperCase().padStart(2, "0")}`).join(", ")}]</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">{t("rfidHistory")}</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">{record.timestamp}</span>
                    <code className="font-mono font-medium text-slate-700">
                      {formatUidHex(record.result.uid_hex!)}
                    </code>
                  </div>
                  <span className="font-mono text-indigo-600 font-medium">
                    {record.result.uid_decimal}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
