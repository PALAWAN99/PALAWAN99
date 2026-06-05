"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "winusb-dismissed";

export function WinUsbGuide() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleDismissPermanent = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const handleDismissSession = () => {
    setShow(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                <path d="M3 12V6.5l8-1.1V12H3zm0 .5h8v6.6l-8-1.1V12.5zM12 5.3l9-1.3v8h-9V5.3zm0 7.2h9v8l-9-1.3v-6.7z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">ติดตั้ง WinUSB Driver</h2>
              <p className="text-sm text-muted-foreground">จำเป็นสำหรับ Windows เพื่อใช้งาน DE-620</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            <p className="font-medium mb-1">ทำไมต้องติดตั้ง?</p>
            <p>
              DUALi DE-620 ใช้ Vendor Protocol ในการสื่อสาร ซึ่ง Windows ไม่มี driver มาให้ในตัว
              ต้องติดตั้ง WinUSB driver ผ่านโปรแกรม Zadig ก่อนจึงจะใช้งานเครื่องอ่านได้
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700 text-sm">ขั้นตอนการติดตั้ง</h3>

            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div className="text-sm">
                  <p className="font-medium text-slate-700">ดาวน์โหลด Zadig</p>
                  <a
                    href="https://zadig.akeo.ie/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    https://zadig.akeo.ie/
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div className="text-sm">
                  <p className="font-medium text-slate-700">เปิด Zadig และเลือกอุปกรณ์ DE-620</p>
                  <p className="text-muted-foreground">
                    เสียบเครื่องอ่าน → Options → List All Devices → เลือก &quot;DUALi DE-620&quot;
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div className="text-sm">
                  <p className="font-medium text-slate-700">เลือก WinUSB แล้วกด Install Driver</p>
                  <p className="text-muted-foreground">
                    ตรวจสอบให้ Driver เป็น &quot;WinUSB&quot; แล้วกดปุ่ม &quot;Install Driver&quot; หรือ &quot;Replace Driver&quot;
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div className="text-sm">
                  <p className="font-medium text-slate-700">เสร็จสิ้น — Refresh หน้านี้</p>
                  <p className="text-muted-foreground">
                    เมื่อติดตั้งเสร็จ กดปุ่ม &quot;ติดตั้งแล้ว&quot; ด้านล่าง
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleDismissPermanent} className="flex-1">
              ติดตั้งแล้ว
            </Button>
            <Button onClick={handleDismissSession} variant="outline" className="flex-1">
              เตือนภายหลัง
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
