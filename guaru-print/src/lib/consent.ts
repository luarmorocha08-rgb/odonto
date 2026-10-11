export type ConsentValue = "granted" | "denied";

export const CONSENT_KEY = "gp-consent-v1";
export const CONSENT_EVENT = "gp:consent";

export function readConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* armazenamento indisponível (modo privado) — vale só nesta sessão */
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}
