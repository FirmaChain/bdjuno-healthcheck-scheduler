// Start monitoring
const START_HASURA_SCHEDULING = () => {
  return `[ ◎ START HASURA SCHEDULING ◎ ]`;
}

const STOP_HASURA_SCHEDULING = () => {
  return `[ ◎ STOP HASURA SCHEDULING ◎ ]`;
}

// Now height of recent block
const NOW_BLOCK_HEIGHT_MESSAGE = (height) => {
  return `[ ◇ NOW BLOCK HEIGHT ◇ - ${height}]`;
}

// The height of the block is not updated.
const WARNING_NOT_UPDATE_HIEGHT = (prevHeight, nowHeight) => {
  return `
[ ▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦ \n
\t NOT UPDATE HEIGHT \n
\t height: ${prevHeight} \n
▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦ ]`;
}

// Stop block update height
const STOP_BLOCK_HEIGHT = (height) => {
  return `
[ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■\n
\t STOP BLOCK HEIGHT \n
\t height: ${height} \n
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ]`;
}

// Restart BDJuno service
const RESTART_BDJUNO_SERVICE = () => {
  return `[ ◎ RESTART BDJUNO SERVICE ◎ ]`;
}

module.exports = {
  START_HASURA_SCHEDULING,
  STOP_HASURA_SCHEDULING,
  NOW_BLOCK_HEIGHT_MESSAGE,
  WARNING_NOT_UPDATE_HIEGHT,
  STOP_BLOCK_HEIGHT,
  RESTART_BDJUNO_SERVICE
}