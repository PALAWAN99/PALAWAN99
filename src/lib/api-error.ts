import { NextResponse } from 'next/server';

interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

export function handleApiError(error: unknown) {
  console.error('[API_ERROR]', error);

  let message = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง';
  let status = 500;

  if (error && typeof error === 'object') {
    const err = error as PrismaError;
    
    if (err.code === 'P2002') {
      message = 'ข้อมูลนี้มีอยู่ในระบบแล้ว (Duplicate entry)';
      status = 400;
    } else if (err.code === 'P2025') {
      message = 'ไม่พบข้อมูลที่ต้องการ';
      status = 404;
    } else if (err.message?.includes('Can\'t reach database')) {
      message = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาติดต่อผู้ดูแลระบบ';
      status = 503;
    } else if (err.message) {
      message = err.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return NextResponse.json({ 
    error: message, 
    details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined 
  }, { status });
}
