import { GraphQLClient } from "graphql-request";
import { API_URL } from "~/utils.js";

export const RequestQL = async (query, variables, requestHeaders) => {
  try {
    const client = new GraphQLClient(API_URL);
    return await client.request(query, variables, requestHeaders);
  } catch (error) {
    const err = JSON.stringify(error, undefined, 2);
    const errMsg = JSON.parse(err);

    // throw new Error(error);
    return errMsg.response.errors;
  }
};
