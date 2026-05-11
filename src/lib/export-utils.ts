import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * ส่งออกข้อมูลเป็นไฟล์ Excel (.xlsx)
 */
export function exportToExcel(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
}

/**
 * ส่งออกข้อมูลเป็นไฟล์ PDF
 * หมายเหตุ: สำหรับภาษาไทยต้องมีการเพิ่ม Font (.ttf) เข้าไปใน jsPDF ก่อน
 */
export function exportToPDF(headers: string[], data: any[][], fileName: string, title: string) {
  const doc = new jsPDF();
  
  // เพิ่มหัวข้อรายงาน
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 8 }, // ในงานจริงต้องเปลี่ยนเป็น Font ภาษาไทย
    headStyles: { fillColor: [30, 58, 95] }
  });

  doc.save(`${fileName}_${new Date().getTime()}.pdf`);
}

/**
 * ส่งออกข้อมูลเป็นไฟล์ CSV
 */
export function exportToCSV(data: any[], fileName: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const val = row[header];
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(','))
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
