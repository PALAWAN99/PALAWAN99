const PAGE_SOURCE = 'kku-smart-access-page';
const BRIDGE_SOURCE = 'kku-card-bridge';

let bridgeEnabled = false;

chrome.storage.local.get(['bridgeEnabled'], (data) => {
  bridgeEnabled = Boolean(data.bridgeEnabled);
  if (bridgeEnabled) signalReady();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.bridgeEnabled) {
    bridgeEnabled = Boolean(changes.bridgeEnabled.newValue);
    if (bridgeEnabled) signalReady();
  }
});

function signalReady() {
  chrome.runtime.sendMessage({ type: 'pingNative' }, (response) => {
    if (chrome.runtime.lastError) {
      window.postMessage(
        {
          source: BRIDGE_SOURCE,
          type: 'ready',
          nativeOk: false,
          nativeError: chrome.runtime.lastError.message,
        },
        '*',
      );
      return;
    }
    if (response?.ok) {
      window.postMessage(
        { source: BRIDGE_SOURCE, type: 'ready', nativeOk: true },
        '*',
      );
      return;
    }
    window.postMessage(
      {
        source: BRIDGE_SOURCE,
        type: 'ready',
        nativeOk: false,
        nativeError: response?.error || 'Native host error',
      },
      '*',
    );
  });
}

function formatRuntimeError(message) {
  if (message.includes('Extension context invalidated')) {
    return 'Extension ถูก reload — กรุณารีเฟรชหน้าอ่านบัตร (Ctrl+Shift+R)';
  }
  if (
    message.includes('communicating with the native messaging host') ||
    message.includes('Native host disconnected')
  ) {
    return (
      'Native Host ทำงานไม่สำเร็จ — รัน Install-Windows.bat ใหม่, ทดสอบ Native Host ใน popup, ' +
      'ดู log ที่ %APPDATA%\\KKU-Card-Bridge\\native-host-errors.log'
    );
  }
  return message;
}

function postBridgeError(requestId, message) {
  const text = formatRuntimeError(message);
  if (text.includes('รีเฟรช')) {
    window.postMessage({ source: BRIDGE_SOURCE, type: 'contextInvalidated' }, '*');
  }
  window.postMessage(
    { source: BRIDGE_SOURCE, id: requestId, error: text },
    '*',
  );
}

function sendNativeRequest(data) {
  try {
    chrome.runtime.sendMessage(
      { type: 'nativeRequest', method: data.method, params: data.params },
      (response) => {
        if (chrome.runtime.lastError) {
          postBridgeError(data.id, chrome.runtime.lastError.message);
          return;
        }
        if (!response?.ok) {
          postBridgeError(data.id, response?.error || 'Bridge error');
          return;
        }
        window.postMessage(
          { source: BRIDGE_SOURCE, id: data.id, result: response.result },
          '*',
        );
      },
    );
  } catch (err) {
    postBridgeError(
      data.id,
      err instanceof Error ? err.message : 'Extension context invalidated',
    );
  }
}

window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  const data = event.data;
  if (!data || data.source !== PAGE_SOURCE) return;

  if (data.type === 'ping') {
    if (bridgeEnabled) signalReady();
    return;
  }

  if (data.type !== 'request' || !bridgeEnabled) return;

  sendNativeRequest(data);
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'cardEvent' && bridgeEnabled) {
    window.postMessage(
      {
        source: BRIDGE_SOURCE,
        type: 'cardEvent',
        payload: message.payload,
      },
      '*',
    );
  }
});
