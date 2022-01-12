const startFetchBlock = require('../../components/graphql');
const sendTelegramBotMsg = require('../../components/telegramBot');

let prevBlockHeight = 0;
let nextBlockHeight = 0;
let warningStack = 0;

let hasuraInfo = {
	isStarted: false,
	interval: null
};

async function getBlockInfo() {
	const result = await startFetchBlock();
	return result;
}

function checkBlock(blockHeight) {
	if (warningStack === 5) {
		sendTelegramBotMsg('hasura', blockHeight);
		warningStack = 0;
		console.log("[warning] send noti telegram bot message at hasura schedule");
		return;
	}

	prevBlockHeight = nextBlockHeight;
	nextBlockHeight = blockHeight;

	if (prevBlockHeight === nextBlockHeight) {
		warningStack++;
		console.log(`[warn] prevHeight: ${prevBlockHeight} | nextHeight: ${nextBlockHeight}`);
	}
}

function startScheduleForHasura(req, res) {
	if (hasuraInfo.isStarted) {
		res.send({
			code: 201,
			type: "hasura",
			message: "already started"
		});

		return ;
	}

	hasuraInfo.isStarted = true;
	hasuraInfo.interval = setInterval(async () => {
		const blockHeight = await getBlockInfo();

		checkBlock(blockHeight);
	}, 10000);

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

		return ;
	}
	
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