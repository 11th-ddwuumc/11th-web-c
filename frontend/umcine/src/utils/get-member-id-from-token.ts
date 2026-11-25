// 로그인 응답과 내 정보 응답에는 memberId가 없어서 JWT payload의 sub에서 꺼낸다.
export function getMemberIdFromToken(accessToken: string | null): number | null {
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")));
    const memberId = Number(decoded.sub ?? decoded.memberId);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
