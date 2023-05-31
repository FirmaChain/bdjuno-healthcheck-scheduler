export const MSG_START_SCHEDULING = `◎ START SCHEDULING ◎`;
export const MSG_STOP_SCHEDULING = `◎ STOP SCHEDULING ◎`;
export const MSG_RESTART_BDJUNO = `◎ RESTART BDJUNO SERVICE ◎`;

export const MSG_BLOCK_HEIGHT = (height: number) => { return `[INFO] BLOCK HEIGHT - ${height}`; };
export const MSG_WARNING_NOT_UPDATE = (height: number, stack: number) => {
  return `⚠️ [WARNING] - NOT UPDATE BLOCK HEIGHT\nHeight - ${height}\nStack - ${stack}`;
}
export const MSG_ERROR_NOT_UPDATE = (height: number) => {
  return `❌ [ERROR] - NOT UPDATE BLOCK HEIGHT\nHeight - ${height}`;
}