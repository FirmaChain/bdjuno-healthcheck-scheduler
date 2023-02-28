const MSG_START_SCHEDULING = `◎ START SCHEDULING ◎`;
const MSG_STOP_SCHEDULING = `◎ STOP SCHEDULING ◎`;
const MSG_RESTART_BDJUNO = `◎ RESTART BDJUNO SERVICE ◎`;

const MSG_BLOCK_HEIGHT = (height) => { return `[INFO] BLOCK HEIGHT - ${height}`; };
const MSG_WARNING_NOT_UPDATE = (height, stack) => {
  return `⚠️ [WARNING] - NOT UPDATE BLOCK HEIGHT\nHeight - ${height}\nStack - ${stack}`;
}
const MSG_ERROR_NOT_UPDATE = (height) => {
  return `❌ [ERROR] - NOT UPDATE BLOCK HEIGHT\nHeight - ${height}`;
}

module.exports = {
  MSG_START_SCHEDULING, MSG_STOP_SCHEDULING, MSG_RESTART_BDJUNO,
  MSG_BLOCK_HEIGHT, MSG_WARNING_NOT_UPDATE, MSG_ERROR_NOT_UPDATE
}