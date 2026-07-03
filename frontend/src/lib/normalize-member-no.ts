/** ตัดช่องว่างหัว-ท้ายรหัสสมาชิก ให้ตรงกับรูปแบบที่เก็บใน mbmembmaster (RTRIM ทุกจุดที่ query) */
export function normalizeMemberNo(memberNo: string): string {
  return memberNo.trim();
}
