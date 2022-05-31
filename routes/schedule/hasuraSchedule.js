const { execCommand } = require('../../components/bashCommand');
const startFetchBlock = require('../../components/graphql');
const sendTelegramBotMessage = require('../../components/telegramBot');
const { BDJUNO_STOP_COMMAND, BDJUNO_START_COMMAND } = require('../../constants/commands');
const { START_HASURA_SCHEDULING, STOP_BLOCK_HEIGHT, STOP_HASURA_SCHEDULING, NOW_BLOCK_HEIGHT_MESSAGE, WARNING_NOT_UPDATE_HIEGHT, RESTART_BDJUNO_SERVICE } = require('../../constants/messages');

let prevBlockHeight = 0;
let nextBlockHeight = 0;
let warningStack = 0;

let hasuraInfo = {
	isStarted: false,
	interval: null
};

async function getBlockInfo() {
	// Get block height
	const result = await startFetchBlock();
	return result;
}

function checkBlock(blockHeight) {
	if (warningStack === 5) {
		warningStack = 0;

		// Send stop block update height
		sendTelegramBotMessage(STOP_BLOCK_HEIGHT(blockHeight));

		execCommand(BDJUNO_STOP_COMMAND(), (result) => {
			setTimeout(execCommand(BDJUNO_START_COMMAND()), 3000);
		});
		
		return;
	}

	prevBlockHeight = nextBlockHeight;
	nextBlockHeight = blockHeight;

	if (prevBlockHeight === nextBlockHeight) {
		warningStack++;

		// Send not block update height
		sendTelegramBotMessage(WARNING_NOT_UPDATE_HIEGHT(prevBlockHeight, nextBlockHeight));
	} else {
		warningStack = 0;
	}
}

function startScheduleForHasura(req, res) {
	// Check scheduler started
	if (hasuraInfo.isStarted) {
		res.send({
			code: 201,
			type: "hasura",
			message: "already started"
		});

		return;
	}

	// Send start message
	sendTelegramBotMessage(START_HASURA_SCHEDULING());

	hasuraInfo.isStarted = true;
	hasuraInfo.interval = setInterval(async () => {
		const blockHeight = await getBlockInfo();

		// Send now block height message
		if (warningStack === 0 && prevBlockHeight !== nextBlockHeight)
			sendTelegramBotMessage(NOW_BLOCK_HEIGHT_MESSAGE(blockHeight));

		checkBlock(blockHeight);
	}, 1000 * 10);

	res.send({
		code: 200,
		type: "hasura",
		message: "scheduling start"
	});
}

function stopScheduleForHasura(req, res) {
	if (!hasuraInfo.isStarted) {
		res.send({
			code: 200,
			type: "hasura",
			message: "already stoped"
		});

		return;
	}

	sendTelegramBotMessage(STOP_HASURA_SCHEDULING());

	hasuraInfo.isStarted = false;
	clearInterval(hasuraInfo.interval);

	res.send({
		code: 201,
		type: "hasura",
		message: "scheduling stop"
	});
}

module.exports = {
	startScheduleForHasura,
	stopScheduleForHasura
}