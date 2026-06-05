"use client";

import { Button } from "@/components/ui/button";
import type { CitizenInfo } from "@/lib/api";

interface ExportButtonsProps {
  data: CitizenInfo | null;
}

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toExportObject(data: CitizenInfo) {
  const { photo_base64: _, ...rest } = data;
  return rest;
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const disabled = !data;

  const handleExportJson = () => {
    if (!data) return;
    const obj = toExportObject(data);
    const content = JSON.stringify(obj, null, 2);
    const ts = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
    downloadBlob(content, `thai_id_${data.cid}_${ts}.json`, "application/json");
  };

  const handleExportCsv = () => {
    if (!data) return;
    const obj = toExportObject(data);
    const keys = Object.keys(obj) as (keyof typeof obj)[];
    const header = keys.join(",");
    const values = keys
      .map((k) => {
        const v = String(obj[k] ?? "");
        return v.includes(",") || v.includes('"') || v.includes("\n")
          ? `"${v.replace(/"/g, '""')}"`
          : v;
      })
      .join(",");
    const bom = "\uFEFF";
    const content = bom + header + "\n" + values + "\n";
    const ts = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
    downloadBlob(content, `thai_id_${data.cid}_${ts}.csv`, "text/csv");
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={handleExportJson}
        disabled={disabled}
        className="flex-1"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export JSON
      </Button>
      <Button
        variant="outline"
        onClick={handleExportCsv}
        disabled={disabled}
        className="flex-1"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export CSV
      </Button>
    </div>
  );
}
