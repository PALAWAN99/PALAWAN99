import type { CitizenInfo } from '@/lib/api';
import type { ThaiIdData } from './reader';

function joinName(parts: string[]): string {
  return parts.filter((p) => p && p.trim()).join(' ').trim();
}

function formatCitizenId(cid: string): string {
  const d = cid.replace(/\D/g, '');
  if (d.length !== 13) return cid;
  return `${d[0]}-${d.slice(1, 5)}-${d.slice(5, 10)}-${d.slice(10, 12)}-${d[12]}`;
}

export const EMPTY_CITIZEN_INFO: CitizenInfo = {
  cid: '',
  th_prefix: '',
  th_firstname: '',
  th_middlename: '',
  th_lastname: '',
  en_prefix: '',
  en_firstname: '',
  en_middlename: '',
  en_lastname: '',
  date_of_birth: '',
  gender: '',
  card_issuer: '',
  issue_date: '',
  expire_date: '',
  address: '',
  photo_base64: null,
};

export function mergeCitizenInfo(partial: Partial<CitizenInfo>): CitizenInfo {
  return { ...EMPTY_CITIZEN_INFO, ...partial };
}

export function hasCitizenPreview(partial: Partial<CitizenInfo>): boolean {
  return Boolean(
    partial.cid ||
      partial.th_firstname ||
      partial.th_lastname ||
      partial.en_firstname ||
      partial.address,
  );
}

/** Map Python backend CitizenInfo → admin IdCard UI shape */
export function citizenInfoToThaiIdData(c: CitizenInfo): ThaiIdData {
  return {
    citizenId: formatCitizenId(c.cid),
    fullNameTh: joinName([c.th_prefix, c.th_firstname, c.th_middlename, c.th_lastname]),
    fullNameEn: joinName([c.en_prefix, c.en_firstname, c.en_middlename, c.en_lastname]),
    birthDate: c.date_of_birth,
    gender: c.gender === 'male' ? 'ชาย' : c.gender === 'female' ? 'หญิง' : c.gender,
    address: c.address,
    expireDate: c.expire_date,
    photoBase64: c.photo_base64,
  };
}
