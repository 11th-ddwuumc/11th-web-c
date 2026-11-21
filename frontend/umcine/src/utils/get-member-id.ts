export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) {
    return null;
  }

  try {
    const payload = accessToken.split(".")[1];
    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    const decoded: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof decoded !== "object" || decoded === null || !("sub" in decoded)) {
      return null;
    }

    const subject = decoded.sub;
    if (typeof subject !== "string" && typeof subject !== "number") {
      return null;
    }

    const memberId = Number(subject);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
