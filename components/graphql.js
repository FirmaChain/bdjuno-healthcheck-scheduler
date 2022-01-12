const axios = require('axios');
const config = require('../config.json');

const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || config.HASURA_ADMIN_SECRET || undefined;
const GRAPHQL_URL = process.env.GRAPHQL_URL || config.GRAPHQL_URL || undefined;

const METHOD = "post";
const HEADERS = {
  "content-type": "application/json",
  "x-hasura-admin-secret": HASURA_ADMIN_SECRET
}
const operationsDoc = `
  query block {
    block(order_by: {height: desc}, limit: 1) {
      height
    }
  }
`;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  return await axios({
    method: METHOD,
    url: GRAPHQL_URL,
    headers: HEADERS,
    data: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  });
}

function fetchBlock() {
  return fetchGraphQL(
    operationsDoc,
    "block"
  );
}

async function startFetchBlock() {
  const { errors, data } = await fetchBlock();

  if (errors) {
    // handle those errors like a pro
    console.error("ERROR : ", errors);
    return;
  }

  // do something great with this precious data
  return data.data.block[0].height;
}

module.exports = startFetchBlock;