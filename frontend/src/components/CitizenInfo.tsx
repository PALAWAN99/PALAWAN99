"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import JsBarcode from "jsbarcode";
import type { CitizenInfo as CitizenInfoType } from "@/lib/api";
import { readPhoto } from "@/lib/api";
import { publicAssetPath } from "@/lib/base-path";

/** `frontend/public/thai-id-card-bg.png` with deploy basePath (e.g. /smart-access). */
const THAI_ID_CARD_BG = publicAssetPath("/thai-id-card-bg.png");

interface CitizenInfoProps {
  data: CitizenInfoType;
  onPhotoLoaded?: (photo: string) => void;
  loading?: boolean;
  /** After text fields load, auto-call Card API for photo (fallback if stream omitted photo). */
  autoFetchPhoto?: boolean;
}

/** Virtual Thai ID card surface (aspect ratio; PNG via ThaiIdCardBackground). */
export function getThaiIdCardSurface(): CSSProperties {
  return {
    aspectRatio: "1024 / 645",
    containerType: "inline-size",
  };
}

function ThaiIdCardBackground() {
  return (
    <Image
      src={THAI_ID_CARD_BG}
      alt=""
      fill
      unoptimized
      priority
      sizes="(max-width: 768px) 100vw, 42rem"
      className="pointer-events-none z-0 object-cover object-center"
      aria-hidden
    />
  );
}

/** Font size scales with card width (cqw), not viewport (vw). */
function cardFontSize(cqw: number, minRem = 0.5, maxRem = 1.125): string {
  return `clamp(${minRem}rem, ${cqw}cqw, ${maxRem}rem)`;
}

function cardFieldStyle(
  top: string,
  left: string,
  opts?: {
    maxWidth?: string;
    cqw?: number;
    minRem?: number;
    maxRem?: number;
    centerX?: boolean;
  },
): CSSProperties {
  const cqw = opts?.cqw ?? 2.6;
  return {
    top,
    left,
    maxWidth: opts?.maxWidth,
    fontSize: cardFontSize(cqw, opts?.minRem, opts?.maxRem),
    lineHeight: 1.25,
    overflow: "hidden",
    wordBreak: "break-word",
    ...(opts?.centerX ? { transform: "translateX(-50%)" } : {}),
  };
}

function formatThaiDate(raw: string): string {
  if (!raw) return "";
  const cleaned = raw.replace(/-/g, "");
  if (cleaned.length !== 8) return raw;
  const d = cleaned.slice(6, 8);
  const m = cleaned.slice(4, 6);
  const y = cleaned.slice(0, 4);
  const months = [
    "", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const mi = parseInt(m, 10);
  return `${parseInt(d, 10)} ${months[mi] || m} ${y}`;
}

function formatCID(cid: string): string {
  if (cid.length !== 13) return cid;
  return `${cid[0]} ${cid.slice(1, 5)} ${cid.slice(5, 10)} ${cid.slice(10, 12)} ${cid[12]}`;
}

function VerticalBarcode({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = useCallback(() => {
    if (!canvasRef.current || !value) return;
    try {
      JsBarcode(canvasRef.current, value, {
        format: "CODE128",
        displayValue: false,
        margin: 0,
        width: 1,
        height: 30,
        background: "transparent",
        lineColor: "#1e1b4b",
      });
    } catch {
      // ignore invalid value
    }
  }, [value]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div
      className="absolute"
      style={{
        top: "28%",
        left: "2%",
        width: "4.5%",
        height: "50%",
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: "3px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center center",
          maxWidth: "none",
        }}
      />
    </div>
  );
}

const SKELETON_CLASS = "absolute rounded bg-slate-300/40 animate-pulse";

export function CitizenInfoSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto @container">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={getThaiIdCardSurface()}
      >
        <ThaiIdCardBackground />
        <div className="absolute inset-0 z-10">
          <div className={SKELETON_CLASS} style={{ top: "19.5%", left: "55%", width: "30%", height: "4%" }} />
          <div className={SKELETON_CLASS} style={{ top: "33.5%", left: "53%", width: "25%", height: "3.5%" }} />
          <div className={SKELETON_CLASS} style={{ top: "41.5%", left: "53%", width: "20%", height: "3.5%" }} />
          <div className={SKELETON_CLASS} style={{ top: "48.5%", left: "53%", width: "22%", height: "3.5%" }} />
          <div className={SKELETON_CLASS} style={{ top: "56.5%", left: "53%", width: "10%", height: "3.5%" }} />
          <div className={SKELETON_CLASS} style={{ top: "70%", left: "25%", width: "40%", height: "7%" }} />
          <div className="absolute rounded bg-slate-300/30 animate-pulse" style={{ top: "28%", left: "2%", width: "4.5%", height: "50%" }} />
          <div className={SKELETON_CLASS} style={{ top: "85.5%", left: "12%", width: "14%", height: "3%" }} />
          <div className={SKELETON_CLASS} style={{ top: "85.5%", left: "35%", width: "16%", height: "3%" }} />
          <div className={SKELETON_CLASS} style={{ top: "85.5%", left: "62%", width: "14%", height: "3%" }} />
          <div className="absolute rounded-sm bg-slate-300/30 animate-pulse" style={{ top: "33%", right: "3.5%", width: "18%", aspectRatio: "3 / 4" }} />
        </div>
      </div>
    </div>
  );
}

function InlineSkeleton({ w, h }: { w: string; h: string }) {
  return <span className="inline-block rounded bg-slate-300/40 animate-pulse align-middle" style={{ width: w, height: h }} />;
}

export function CitizenInfoCard({
  data,
  onPhotoLoaded,
  loading,
  autoFetchPhoto = true,
}: CitizenInfoProps) {
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const photoFetchStarted = useRef(false);

  const thName = [data.th_prefix, data.th_firstname, data.th_middlename]
    .filter(Boolean)
    .join(" ");
  const thLastname = data.th_lastname || "";

  const handleLoadPhoto = useCallback(async () => {
    if (loadingPhoto || data.photo_base64) return;
    setLoadingPhoto(true);
    setPhotoError(false);
    try {
      const result = await readPhoto();
      if (result.success && result.photo_base64) {
        onPhotoLoaded?.(result.photo_base64);
      } else {
        setPhotoError(true);
      }
    } catch {
      setPhotoError(true);
    } finally {
      setLoadingPhoto(false);
    }
  }, [data.photo_base64, loadingPhoto, onPhotoLoaded]);

  useEffect(() => {
    photoFetchStarted.current = false;
    setPhotoError(false);
  }, [data.cid]);

  useEffect(() => {
    if (
      !autoFetchPhoto ||
      loading ||
      !data.cid ||
      data.photo_base64 ||
      loadingPhoto ||
      photoFetchStarted.current
    ) {
      return;
    }
    photoFetchStarted.current = true;
    void handleLoadPhoto();
  }, [autoFetchPhoto, loading, data.cid, data.photo_base64, loadingPhoto, handleLoadPhoto]);

  return (
    <div className="w-full max-w-2xl mx-auto @container">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={getThaiIdCardSurface()}
      >
        <ThaiIdCardBackground />
        <div className="absolute inset-0 z-10">
          {data.cid ? <VerticalBarcode value={data.cid} /> : (
            <div className="absolute rounded bg-slate-300/30 animate-pulse" style={{ top: "28%", left: "2%", width: "4.5%", height: "50%" }} />
          )}

          {/* CID */}
          <div
            className="absolute font-bold text-indigo-950 tracking-tighter font-mono whitespace-nowrap"
            style={cardFieldStyle("19.5%", "72%", { cqw: 3.1, minRem: 0.45, maxRem: 1.25, centerX: true })}
          >
            {data.cid ? (
              <span className="animate-in fade-in duration-500">{formatCID(data.cid)}</span>
            ) : (
              <InlineSkeleton w="55%" h="1.2em" />
            )}
          </div>

          {/* Name (Thai) */}
          <div
            className="absolute font-semibold text-indigo-950"
            style={{ top: "33.5%", left: "53%", maxWidth: "38%", fontSize: "clamp(0.5rem, 2.7cqw, 1.125rem)", lineHeight: 1.25, overflow: "hidden", wordBreak: "break-word" }}
          >
            {thName ? (
              <span className="animate-in fade-in duration-500">{thName}</span>
            ) : (
              <InlineSkeleton w="45%" h="1.2em" />
            )}
          </div>

          {/* Last Name */}
          <div
            className="absolute font-semibold text-indigo-950"
            style={{ top: "41.5%", left: "53%", maxWidth: "38%", fontSize: "clamp(0.5rem, 2.7cqw, 1.125rem)", lineHeight: 1.25, overflow: "hidden", wordBreak: "break-word" }}
          >
            {thLastname ? (
              <span className="animate-in fade-in duration-500">{thLastname}</span>
            ) : (
              <InlineSkeleton w="40%" h="1.2em" />
            )}
          </div>

          {/* Date of Birth */}
          <div
            className="absolute font-semibold text-indigo-950"
            style={{ top: "48.5%", left: "53%", maxWidth: "38%", fontSize: "clamp(0.5rem, 2.7cqw, 1.125rem)", lineHeight: 1.25, overflow: "hidden", wordBreak: "break-word" }}
          >
            {data.date_of_birth ? (
              <span className="animate-in fade-in duration-500">{formatThaiDate(data.date_of_birth)}</span>
            ) : (
              <InlineSkeleton w="42%" h="1.2em" />
            )}
          </div>

          {/* Gender */}
          <div
            className="absolute font-semibold text-indigo-950"
            style={{ top: "56.5%", left: "53%", maxWidth: "20%", fontSize: "clamp(0.5rem, 2.7cqw, 1.125rem)", lineHeight: 1.25, overflow: "hidden", wordBreak: "break-word" }}
          >
            {data.gender ? (
              <span className="animate-in fade-in duration-500">{data.gender === "male" ? "ชาย" : "หญิง"}</span>
            ) : (
              <InlineSkeleton w="18%" h="1.2em" />
            )}
          </div>

          {/* Address */}
          <div
            className="absolute font-semibold text-indigo-950 leading-snug line-clamp-3"
            style={{ top: "70%", left: "25%", maxWidth: "48%", fontSize: "clamp(0.5rem, 2.5cqw, 1rem)", lineHeight: 1.25, overflow: "hidden", wordBreak: "break-word" }}
          >
            {data.address ? (
              <span className="animate-in fade-in duration-500">{data.address}</span>
            ) : (
              <span className="space-y-1 block">
                <InlineSkeleton w="90%" h="1em" />
                <br />
                <InlineSkeleton w="70%" h="1em" />
              </span>
            )}
          </div>

          {/* Date of Issue */}
          <div
            className="absolute font-semibold text-indigo-950"
            style={{ top: "85.5%", left: "12%", fontSize: "clamp(0.4rem, 2.1cqw, 0.85rem)" }}
          >
            {data.issue_date ? (
              <span className="animate-in fade-in duration-500">{formatThaiDate(data.issue_date)}</span>
            ) : (
              <InlineSkeleton w="35%" h="1em" />
            )}
          </div>

          {/* Gov. Officer */}
          <div
            className="absolute font-semibold text-indigo-950 line-clamp-2"
            style={{ top: "85.5%", left: "35%", maxWidth: "26%", fontSize: "clamp(0.35rem, 1.9cqw, 0.75rem)", lineHeight: 1.2, overflow: "hidden", wordBreak: "break-word" }}
          >
            {data.card_issuer ? (
              <span className="animate-in fade-in duration-500">{data.card_issuer}</span>
            ) : (
              <InlineSkeleton w="38%" h="1em" />
            )}
          </div>

          {/* Date of Expiry */}
          <div
            className="absolute font-semibold text-indigo-950"
            style={{ top: "85.5%", left: "62%", fontSize: "clamp(0.4rem, 2.1cqw, 0.85rem)" }}
          >
            {data.expire_date ? (
              <span className="animate-in fade-in duration-500">{formatThaiDate(data.expire_date)}</span>
            ) : (
              <InlineSkeleton w="35%" h="1em" />
            )}
          </div>

          {/* Photo */}
          <div
            className="absolute overflow-hidden bg-white/30 rounded-sm"
            style={{ top: "33%", right: "3.5%", width: "18%", aspectRatio: "3 / 4" }}
          >
            {loading ? (
              <div className="w-full h-full bg-slate-300/30 animate-pulse" />
            ) : data.photo_base64 ? (
              <img
                src={`data:image/jpeg;base64,${data.photo_base64}`}
                alt="รูปถ่าย"
                className="w-full h-full object-cover"
              />
            ) : (
              <button
                onClick={handleLoadPhoto}
                disabled={loadingPhoto}
                className="w-full h-full flex flex-col items-center justify-center gap-1 text-sky-800/60 hover:text-sky-900 hover:bg-white/40 transition-colors cursor-pointer disabled:cursor-wait"
              >
                {loadingPhoto ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span style={{ fontSize: "clamp(0.35rem, 1.2cqw, 0.6rem)" }}>กำลังดึงรูป...</span>
                  </>
                ) : photoError ? (
                  <>
                    <span style={{ fontSize: "clamp(0.35rem, 1.2cqw, 0.6rem)" }}>ดึงรูปไม่สำเร็จ</span>
                    <span style={{ fontSize: "clamp(0.3rem, 1cqw, 0.55rem)" }} className="underline">ลองอีกครั้ง</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                    </svg>
                    <span style={{ fontSize: "clamp(0.35rem, 1.2cqw, 0.6rem)" }}>ดึงรูป</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
