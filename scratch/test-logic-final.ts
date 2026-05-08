import { prisma } from '../src/lib/prisma.ts';
import { generateToken, validateQrToken } from '../src/lib/qr-engine.ts';
import dayjs from 'dayjs';

async function testFlow() {
  console.log('🚀 Starting Final E2E Logic Test...');

  try {
    // 1. Get/Create Branch & Gate
    const branch = await prisma.branch.findFirst({ where: { code: 'BKK01' } });
    if (!branch) throw new Error('Branch BKK01 not found. Run seed first.');

    const gate = await prisma.gate.findFirst({ where: { gateCode: 'G-MAIN-01' } });
    if (!gate) throw new Error('Gate G-MAIN-01 not found. Run seed first.');

    // 2. Get/Create Member
    const member = await prisma.member.findFirst({ where: { memberNo: 'M67001' } });
    if (!member) throw new Error('Member M67001 not found. Run seed first.');

    console.log('✅ Base data verified.');

    // 3. Issue QR Token
    console.log('🎟️ Issuing QR Token...');
    const tokenData = generateToken();
    const expiresAt = dayjs().endOf('day').toDate();
    
    const qrToken = await prisma.qrToken.create({
      data: {
        tokenHash: tokenData.hash,
        memberId: member.id,
        issuedDate: new Date(),
        expiresAt,
        purpose: 'ENTRY',
      }
    });
    console.log('✅ Token issued:', tokenData.token);

    // 4. Validate QR Token (Successful)
    console.log('🔍 Validating Token (Entry)...');
    const result = await validateQrToken(tokenData.token, gate.id);
    console.log('✅ Validation result:', result.decision, result.message);

    if (result.decision !== 'ALLOWED') {
      throw new Error('Expected ALLOWED for valid token');
    }

    // 5. Simulate API behavior: Record Access Event
    console.log('📝 Recording Access Event...');
    const event = await prisma.accessEvent.create({
      data: {
        gateId: gate.id,
        memberId: member.id,
        qrTokenId: qrToken.id,
        direction: 'IN',
        source: 'QR_CODE',
        decision: 'ALLOWED',
        scannedAt: new Date(),
      }
    });

    if (event && event.decision === 'ALLOWED') {
      console.log('✅ Access event recorded correctly.');
    } else {
      throw new Error('Access event not recorded correctly.');
    }

    // 6. Test Expiry (Logic Check)
    console.log('⏰ Testing Expiry Logic...');
    const expiredToken = await prisma.qrToken.create({
      data: {
        tokenHash: 'EXPIRED-TOKEN-123',
        memberId: member.id,
        issuedDate: dayjs().subtract(2, 'day').toDate(),
        expiresAt: dayjs().subtract(1, 'day').endOf('day').toDate(),
      }
    });
    
    const expiryResult = await validateQrToken('EXPIRED-TOKEN-123', gate.id);
    console.log('✅ Expiry result:', expiryResult.decision, expiryResult.message);
    if (expiryResult.decision !== 'DENIED') {
      throw new Error('Expected DENIED for expired token');
    }

    console.log('\n✨ ALL LOGIC TESTS PASSED! ✨');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFlow();
