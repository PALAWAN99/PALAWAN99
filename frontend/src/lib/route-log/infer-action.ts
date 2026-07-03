import { normalizeRoutePattern } from './paths';

const PAGE_ACTIONS: Record<string, string> = {
  '/': 'page.home',
  '/login': 'page.login',
  '/about': 'page.about',
  '/admin': 'page.admin.users',
  '/admin/users': 'page.admin.users',
  '/admin/qr': 'page.admin.qr',
  '/admin/branches': 'page.admin.branches',
  '/admin/gates': 'page.admin.gates',
  '/admin/devices': 'page.admin.devices',
  '/admin/infrastructure': 'page.admin.infrastructure',
  '/admin/members': 'page.admin.members',
  '/admin/idcard': 'page.admin.idcard',
  '/admin/reports': 'page.admin.reports',
  '/admin/history': 'page.admin.history',
  '/admin/logs': 'page.admin.logs',
  '/admin/changelog': 'page.admin.changelog',
  '/admin/security': 'page.admin.security',
  '/admin/settings': 'page.admin.settings',
  '/gate/dashboard': 'page.gate.dashboard',
};

const API_ACTIONS: Record<string, string> = {
  '/api/auth': 'api.auth',
  '/api/health': 'api.health',
  '/api/qr/issue': 'api.qr.issue',
  '/api/qr/validate': 'api.qr.validate',
  '/api/qr/member-search': 'api.qr.member_search',
  '/api/gate/validate': 'api.gate.validate',
  '/api/gate/control': 'api.gate.control',
  '/api/gate/sensor': 'api.gate.sensor',
  '/api/gate/dashboard': 'api.gate.dashboard',
  '/api/idcard/register': 'api.idcard.register',
  '/api/notifications': 'api.notifications',
  '/api/admin/dashboard/stats': 'api.admin.dashboard.stats',
  '/api/admin/dashboard/details': 'api.admin.dashboard.details',
  '/api/admin/members': 'api.admin.members',
  '/api/admin/gates': 'api.admin.gates',
  '/api/admin/branches': 'api.admin.branches',
  '/api/admin/devices': 'api.admin.devices',
  '/api/admin/users': 'api.admin.users',
  '/api/admin/settings': 'api.admin.settings',
  '/api/admin/settings/gates': 'api.admin.settings.gates',
  '/api/admin/events': 'api.admin.events',
  '/api/admin/audit': 'api.admin.audit',
  '/api/admin/route-logs': 'api.admin.route_logs',
  '/api/changelog': 'api.changelog',
  '/api/public/recaptcha-config': 'api.public.recaptcha_config',
  '/api/admin/reports/stats': 'api.admin.reports.stats',
  '/api/admin/history': 'api.admin.history',
  '/api/admin/qr/cleanup': 'api.admin.qr.cleanup',
  '/api/admin/qr-policies': 'api.admin.qr_policies',
  '/api/logs': 'api.logs.ingest',
};

const FASTAPI_ACTIONS: Record<string, string> = {
  '/api/readers': 'card.readers.list',
  '/api/readers/reset': 'card.readers.reset',
  '/api/read-card': 'card.read',
  '/api/read-card-stream': 'card.read_stream',
  '/api/card-events-stream': 'card.events_stream',
  '/api/read-card/photo': 'card.read_photo',
  '/api/rfid/read': 'card.rfid.read',
  '/api/export/json': 'card.export.json',
  '/api/export/csv': 'card.export.csv',
  '/api/diagnostic': 'card.diagnostic',
  '/ws/card-events': 'card.ws.events',
};

function stripLocalePrefix(path: string): string {
  return path.replace(/^\/(en|zh)(?=\/|$)/, '') || '/';
}

export function inferPageAction(pathname: string): string {
  const bare = stripLocalePrefix(pathname);
  const pattern = normalizeRoutePattern(bare);
  return PAGE_ACTIONS[pattern] ?? `page.${pattern.replace(/^\//, '').replace(/\//g, '.') || 'root'}`;
}

export function inferApiAction(method: string, pathname: string): string {
  const pattern = normalizeRoutePattern(pathname);
  const base = API_ACTIONS[pattern];
  if (base) return `${base}.${method.toLowerCase()}`;
  return `api.${pattern.replace(/^\//, '').replace(/\//g, '.')}.${method.toLowerCase()}`;
}

export function inferFastApiAction(method: string, pathname: string): string {
  const pattern = normalizeRoutePattern(pathname);
  const base = FASTAPI_ACTIONS[pattern];
  if (base) return `${base}.${method.toLowerCase()}`;
  return `fastapi.${pattern.replace(/^\//, '').replace(/\//g, '.')}.${method.toLowerCase()}`;
}
