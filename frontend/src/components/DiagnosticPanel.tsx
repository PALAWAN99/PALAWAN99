"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDiagnostic, type DiagnosticInfo } from "@/lib/api";

const MODE_LABELS: Record<string, { label: string; color: string }> = {
  ccid: { label: "CCID (Standard)", color: "text-green-600" },
  duali_pcsc: { label: "DUALi PC/SC (Vendor Protocol)", color: "text-green-600" },
  vendor: { label: "Vendor Mode (Vendor Protocol)", color: "text-green-600" },
  not_found: { label: "ไม่พบ", color: "text-muted-foreground" },
  unknown: { label: "ไม่ทราบ", color: "text-muted-foreground" },
};

export function DiagnosticPanel() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const runDiagnostic = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDiagnostic();
      setDiagnostic(data);
    } catch {
      setDiagnostic(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchDiagnostic()
      .then((data) => {
        if (cancelled) return;
        setDiagnostic(data);
      })
      .catch(() => {
        if (!cancelled) setDiagnostic(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!diagnostic) return null;

  const mode = diagnostic.usb_mode ?? "not_found";
  const modeInfo = MODE_LABELS[mode] ?? MODE_LABELS.unknown;
  const isReady =
    diagnostic.usb_detected &&
    (diagnostic.vendor_protocol_available || mode === "ccid");

  return (
    <Card
      className={
        isReady
          ? "border-green-400 bg-green-50 dark:bg-green-950/20"
          : diagnostic.usb_detected
            ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
            : ""
      }
    >
      <CardContent className="py-2 px-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                isReady
                  ? "bg-green-500"
                  : diagnostic.usb_detected
                    ? "bg-amber-500"
                    : "bg-gray-400"
              }`}
            />
            <span className="text-xs font-medium truncate">
              {diagnostic.usb_detected
                ? `DE-620 (${modeInfo.label})`
                : "ไม่พบเครื่องอ่าน"}
            </span>
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="h-6 px-1.5 gap-0.5 text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                {expanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                )}
              </svg>
              {expanded ? "ซ่อน" : "ดูเพิ่ม"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={runDiagnostic}
              disabled={loading}
              className="h-6 px-1.5 gap-0.5 text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              ตรวจสอบ
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">USB</span>
              <span>
                {diagnostic.usb_detected
                  ? `VID: ${diagnostic.usb_vid}, PID: ${diagnostic.usb_pid}`
                  : "ไม่พบ"}
              </span>

              <span className="text-muted-foreground">โหมด</span>
              <span className={modeInfo.color}>{modeInfo.label}</span>

              <span className="text-muted-foreground">Vendor Protocol</span>
              <span className={diagnostic.vendor_protocol_available ? "text-green-600" : "text-muted-foreground"}>
                {diagnostic.vendor_protocol_available ? "พร้อมใช้งาน" : "ไม่พร้อม"}
              </span>

              <span className="text-muted-foreground">Interface Class</span>
              <span>{diagnostic.usb_interface_class ?? "-"}</span>

              <span className="text-muted-foreground">Serial</span>
              <span>{diagnostic.usb_serial ?? "-"}</span>

              <span className="text-muted-foreground">PC/SC (pyscard)</span>
              <span>
                {diagnostic.pcsc_available ? "พร้อมใช้งาน" : "ไม่พร้อม"}
              </span>
            </div>

            {isReady && (
              <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-3 text-xs">
                <p className="font-medium text-green-800 dark:text-green-300">
                  พร้อมอ่านบัตร — สื่อสารผ่าน Vendor Protocol
                </p>
                <p className="text-green-700 dark:text-green-400 mt-1">
                  {diagnostic.message}
                </p>
              </div>
            )}

            {!isReady && diagnostic.usb_detected && (
              <div className="rounded-md bg-amber-100 dark:bg-amber-900/30 p-3 text-xs">
                <p className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                  พบเครื่องอ่านแต่ Vendor Protocol ยังไม่พร้อม
                </p>
                <p className="text-amber-700 dark:text-amber-400">
                  {diagnostic.message}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
