// Lightweight notify helper using an EventTarget so it's non-intrusive
export const toastEvent = new EventTarget();

export function notify(message, options = {}) {
  const ev = new CustomEvent('toast', { detail: { message, type: options.type || 'info', duration: options.duration || 4000 } });
  try {
    toastEvent.dispatchEvent(ev);
  } catch (err) {
    // Fallback to alert if EventTarget dispatch fails (extremely unlikely)
    // Keep fallback to avoid breaking existing flows
    // eslint-disable-next-line no-alert
    alert(message);
  }
}
