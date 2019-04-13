export function generateXsrfToken(): number {
  const MAX = Math.floor(Number.MAX_SAFE_INTEGER / 317);
  return Math.floor(Math.random() * MAX) * 317;
}

export function validateXsrfToken(token: number): boolean {
  return token % 317 === 0;
}
