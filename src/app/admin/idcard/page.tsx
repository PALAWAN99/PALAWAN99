import IdCardClient from './IdCardClient';

export const metadata = {
  title: 'ระบบบัตรประชาชน | QR Gate Access',
  description: 'จัดการและลงทะเบียนสมาชิกผ่านเครื่องอ่าน Smart Card',
};

export default function IdCardAdminPage() {
  return <IdCardClient />;
}
