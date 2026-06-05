const NATIVE_HOST = 'com.kku.lib.smartaccess.card';
const PAGE_SOURCE = 'kku-smart-access-page';
const BRIDGE_SOURCE = 'kku-card-bridge';

/** @type {chrome.runtime.Port | null} */
let nativePort = null;
/** @type {Map<string, { resolve: Function, reject: Function }>} */
const pending = new Map();

function connectNative() {
  if (nativePort) return nativePort;
  try {
    nativePort = chrome.runtime.connectNative(NATIVE_HOST);
  } catch (err) {
    nativePort = null;
    throw err;
  }

  nativePort.onMessage.addListener((msg) => {
    if (msg.type === 'cardEvent') {
      chrome.tabs.query({ url: ['https://lib.kku.ac.th/smart-access/*'] }, (tabs) => {
        for (const tab of tabs) {
          if (tab.id != null) {
            chrome.tabs.sendMessage(tab.id, { type: 'cardEvent', payload: msg }).catch(() => {});
          }
        }
      });
      return;
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error));
      else resolve(msg.result);
    }
  });

  nativePort.onDisconnect.addListener(() => {
    nativePort = null;
    for (const [, { reject }] of pending) {
      reject(new Error(chrome.runtime.lastError?.message || 'Native host disconnected'));
    }
    pending.clear();
  });

  return nativePort;
}

function nativeRequest(method, params) {
  return new Promise((resolve, reject) => {
    let port;
    try {
      port = connectNative();
    } catch (err) {
      reject(err);
      return;
    }
    const id = crypto.randomUUID();
    pending.set(id, { resolve, reject });
    port.postMessage({ id, method, params: params || {} });
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error('Native host timeout (30s)'));
      }
    }, 30000);
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'nativeRequest') {
    nativeRequest(message.method, message.params)
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: String(err.message || err) }));
    return true;
  }
  if (message.type === 'pingNative') {
    nativeRequest('ping', {})
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: String(err.message || err) }));
    return true;
  }
  if (message.type === 'disconnectNative') {
    nativePort?.disconnect();
    nativePort = null;
    sendResponse({ ok: true });
    return false;
  }
  return false;
});
