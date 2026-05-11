import { NextResponse } from 'next/server';

export function handleApiError(error: any) {
  console.error('[API_ERROR]', error);

  let message = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ กรุณาลองใหม่อีกครั้ง';
  let status = 500;

  if (error.code === 'P2002') {
    message = 'ข้อมูลนี้มีอยู่ในระบบแล้ว (Duplicate entry)';
    status = 400;
  } else if (error.code === 'P2025') {
    message = 'ไม่พบข้อมูลที่ต้องการ';
    status = 404;
  } else if (error.message?.includes('Can\'t reach database')) {
    message = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาติดต่อผู้ดูแลระบบ';
    status = 503;
  }

  return NextResponse.json({ 
    error: message, 
    details: process.env.NODE_ENV === 'development' ? error.message : undefined 
  }, { status });
}
