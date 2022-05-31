const BDJUNO_STOP_COMMAND = () => {
  return "sudo systemctl stop bdjuno.service";
}

const BDJUNO_START_COMMAND = () => {
  return "sudo systemctl start bdjuno.service";
}

module.exports = {
  BDJUNO_STOP_COMMAND, BDJUNO_START_COMMAND
}