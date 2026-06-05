const statusEl = document.getElementById('status');
const toggleBtn = document.getElementById('toggle');
const testBtn = document.getElementById('test');

function setStatus(text, ok) {
  statusEl.textContent = text;
  statusEl.className = 'status ' + (ok ? 'ok' : 'err');
}

async function refresh() {
  const { bridgeEnabled } = await chrome.storage.local.get(['bridgeEnabled']);
  toggleBtn.textContent = bridgeEnabled ? 'ปิด Bridge' : 'เปิดใช้งาน Bridge';
  if (bridgeEnabled) {
    setStatus('Bridge เปิด — รีเฟรชหน้าอ่านบัตร', true);
  } else {
    setStatus('Bridge ปิด', false);
  }
}

toggleBtn.addEventListener('click', async () => {
  const { bridgeEnabled } = await chrome.storage.local.get(['bridgeEnabled']);
  const next = !bridgeEnabled;
  await chrome.storage.local.set({ bridgeEnabled: next });
  await refresh();
  if (next) {
    setStatus('Bridge เปิด — รีเฟรชหน้าอ่านบัตร (Ctrl+Shift+R)', true);
  }
});

testBtn.addEventListener('click', () => {
  setStatus('กำลังทดสอบ…', true);
  chrome.runtime.sendMessage({ type: 'pingNative' }, (response) => {
    if (chrome.runtime.lastError) {
      setStatus(chrome.runtime.lastError.message, false);
      return;
    }
    if (response?.ok) {
      setStatus('Native Host พร้อม — ' + JSON.stringify(response.result), true);
    } else {
      setStatus(
        response?.error ||
          'Native Host ไม่พบ — รัน install-native-host และตรวจ Extension ID',
        false,
      );
    }
  });
});

refresh();
