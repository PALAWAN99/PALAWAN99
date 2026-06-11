import { EventEmitter } from 'events';
import { prisma } from './prisma';
import { getSqlServerPool, isSqlServerConfigured } from './sqlserver';
import { loadGateDisplayRegistry } from './gate-display-registry';
import { pennuengSqlDateToIso } from './pennueng-datetime';
import { pennuengStatusToDirection } from './pennueng-dashboard';
import sql from 'mssql';

const globalForEmitter = globalThis as unknown as {
  eventEmitter?: EventEmitter;
  isPollingStarted?: boolean;
};

export const eventEmitter = globalForEmitter.eventEmitter ?? new EventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEmitter.eventEmitter = eventEmitter;
}

export async function emitAccessEvent(eventId: string) {
  // If SQL Server is configured, we rely entirely on SQL Server gatestatement polling to prevent duplicates
  if (isSqlServerConfigured()) {
    return;
  }

  try {
    const event = await prisma.accessEvent.findUnique({
      where: { id: eventId },
      include: {
        gate: {
          select: {
            gateCode: true,
          },
        },
        member: {
          select: {
            firstNameTh: true,
            lastNameTh: true,
            memberType: true,
            metadata: true,
          },
        },
      },
    });

    if (!event) return;

    const metadata = (event.member?.metadata as any) || {};
    const department = metadata.department || metadata.departmentCode || metadata.school || '';

    const formattedEvent = {
      id: event.id,
      gateId: event.gateId,
      memberId: event.memberId,
      qrTokenId: event.qrTokenId,
      direction: event.direction,
      source: event.source,
      decision: event.decision,
      reasonCode: event.reasonCode,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      scannedAt: event.scannedAt,
      createdAt: event.createdAt,
      gate: event.gate,
      member: event.member
        ? {
            firstNameTh: event.member.firstNameTh,
            lastNameTh: event.member.lastNameTh,
            memberType: event.member.memberType,
            department,
          }
        : null,
    };

    eventEmitter.emit('access-event', formattedEvent);
  } catch (error) {
    console.error('Error emitting access event:', error);
  }
}

// ─── SQL Server Real-time Polling ──────────────────────────────────────────────

let lastProcessedId: number | null = null;
let isPolling = false;

async function pollSqlServer() {
  if (isPolling) return;
  isPolling = true;

  try {
    if (!isSqlServerConfigured()) {
      isPolling = false;
      return;
    }

    const listenersCount = eventEmitter.listenerCount('access-event');
    if (listenersCount === 0) {
      isPolling = false;
      return;
    }

    const pool = await getSqlServerPool();

    // 1. Initialize lastProcessedId if null
    if (lastProcessedId === null) {
      const initResult = await pool.request().query<{ maxId: number }>(`
        SELECT MAX(id) AS maxId FROM gatestatement WITH (NOLOCK)
      `);
      lastProcessedId = initResult.recordset[0]?.maxId ?? 0;
      isPolling = false;
      return;
    }

    // 2. Query new rows
    const req = pool.request();
    req.input('lastId', sql.Int, lastProcessedId);
    
    const result = await req.query<any>(`
      SELECT
        gs.id,
        gs.operate_date,
        gs.status,
        gs.success,
        gs.name,
        gs.surname,
        RTRIM(gs.gate_id) AS gate_id,
        COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(gs.gate_id)) AS gate_name,
        RTRIM(gs.member_no) AS member_no,
        RTRIM(gs.member_key) AS member_key,
        RTRIM(gs.member_type) AS member_type,
        COALESCE(NULLIF(RTRIM(mt.description), ''), NULLIF(RTRIM(gs.member_type), ''), N'—') AS member_type_label,
        RTRIM(m.department_code) AS department_code,
        RTRIM(dept.department_desc) AS department_desc,
        RTRIM(gs.remark) AS remark
      FROM gatestatement gs WITH (NOLOCK)
      LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
      LEFT JOIN mbmembtype mt ON RTRIM(gs.member_type) = RTRIM(mt.member_type)
      LEFT JOIN mbmembmaster m ON RTRIM(gs.member_no) = RTRIM(m.member_no)
      LEFT JOIN mbdepartment dept ON RTRIM(m.department_code) = RTRIM(dept.department_code)
      WHERE gs.id > @lastId
      ORDER BY gs.id ASC
    `);

    if (result.recordset.length > 0) {
      const gateLabels = await loadGateDisplayRegistry('th');
      for (const row of result.recordset) {
        const gateCode = row.gate_name?.trim() || row.gate_id?.trim() || '—';
        const resolvedGate = gateLabels.resolve(gateCode);
        const iso = pennuengSqlDateToIso(new Date(row.operate_date));

        const mapped = {
          id: String(row.id),
          gateId: row.gate_id?.trim() || '',
          memberId: row.member_no?.trim() || '',
          direction: pennuengStatusToDirection(row.status),
          decision: row.success === 1 ? 'ALLOWED' : 'DENIED' as const,
          reasonCode: row.remark?.trim() || null,
          scannedAt: iso,
          gate: {
            gateCode: resolvedGate.displayName || gateCode,
          },
          member: {
            firstNameTh: row.name?.trim() || '—',
            lastNameTh: row.surname?.trim() || '',
            memberType: row.member_type?.trim() || 'EXTERNAL',
            department: row.department_desc?.trim() || null,
          },
        };

        eventEmitter.emit('access-event', mapped);
        lastProcessedId = row.id;
      }
    }
  } catch (error) {
    console.error('Error polling SQL Server for access events:', error);
  } finally {
    isPolling = false;
  }
}

// Start polling loop
if (!globalForEmitter.isPollingStarted) {
  globalForEmitter.isPollingStarted = true;
  setInterval(() => {
    void pollSqlServer();
  }, 1500); // Check every 1.5 seconds
}
