import fetch from 'node-fetch';
import config from '../../config.json';
import { ErrorLog } from '../utils/logger.util';

const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || config.HASURA_ADMIN_SECRET || undefined;
const GRAPHQL_URL = process.env.GRAPHQL_URL || config.GRAPHQL_URL || undefined;

export const getBlockFromHasura = async () => {
  const headers = {
    "content-type": "application/json",
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET!
  }

  const graphqlQuery = {
    "operationName": "block",
    "query": `query block {
                block(order_by: {height: desc}, limit: 1) {
                  height
                }
              }`,
    "variables": {}
  }

  const options = {
    "method": "POST",
    "headers": headers,
    "body": JSON.stringify(graphqlQuery)
  };

  try {
    if (GRAPHQL_URL !== undefined) {
      const response = await fetch(GRAPHQL_URL, options);
      const data = await response.json();
  
      return data.data.block[0].height;
    }
  } catch (e) {
    ErrorLog(`Failed to look up data in Hasura | HASURA URL - ${GRAPHQL_URL}`);
    throw e;
  }
}