let counter = Date.now();
export function genId(): string {
  return (++counter).toString(36);
}
