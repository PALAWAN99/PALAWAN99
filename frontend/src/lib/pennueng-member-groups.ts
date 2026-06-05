/** กลุ่มประเภทสมาชิก Pennueng (mbmembtype.group_detail) */
export function isExternalPennuengGroup(groupDetail: string | null | undefined): boolean {
  return groupDetail?.trim() === 'ภายนอก';
}

export function groupDetailForMemberType(
  types: { memberType: string; groupDetail: string | null }[],
  memberType: string,
): string | null {
  return types.find((t) => t.memberType === memberType)?.groupDetail ?? null;
}
