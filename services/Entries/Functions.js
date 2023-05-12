import { RequestQL } from "~/RequestQL.js";
import {
  POST_ENTRIE,
  GET_ENTRIES,
  POST_COMMENT,
  GET_ENTRIE,
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  UPDATE_COMMENT,
  VOTE_COMMENT,
  DELETE_COMMENT,
  VOTE_ENTRY,
  WELCOME,
} from "~/services/Entries/Graphql.js";

export const getWelcome = async ({ token }) => {
  const res = await RequestQL(WELCOME, null, {
    authorization: `Bearer ${token}`,
  });
  return res;
};

export const createEntrie = async ({ post, token }) => {
  const res = await RequestQL(
    POST_ENTRIE,
    { post },
    { authorization: `Bearer ${token}` }
  );
  return res;
};

export const getEntries = async (page) => {
  const res = await RequestQL(GET_ENTRIES, { page: Number(page) });
  return res;
};

export const createComment = async ({
  entrieId,
  message,
  parentId = null,
  token,
}) => {
  const res = await RequestQL(
    POST_COMMENT,
    { entrieId, message, parentId },
    { authorization: `Bearer ${token}` }
  );
  return res;
};

export const voteComment = async ({ entrieId, token }) => {
  const res = await RequestQL(
    VOTE_COMMENT,
    { entrieId },
    { authorization: `Bearer ${token}` }
  );
  return res;
};

export const voteEntry = async ({ entrieId, token }) => {
  const res = await RequestQL(
    VOTE_ENTRY,
    { entrieId },
    { authorization: `Bearer ${token}` }
  );
  return res;
};

export const deleteComment = async ({ uniqId, token }) => {
  const res = await RequestQL(
    DELETE_COMMENT,
    { uniqId },
    { authorization: `Bearer ${token}` }
  );
  return res;
};

export const updateComment = async ({ uniqId, message, token }) => {
  const res = await RequestQL(
    UPDATE_COMMENT,
    { uniqId, message },
    { authorization: `Bearer ${token}` }
  );
  return res;
};

export const getEntrie = async (entrieId) => {
  const res = await RequestQL(
    GET_ENTRIE,
    { entrieId: entrieId }
    //   { authorization: `Bearer ${auth.token}` }
  );
  return res;
};

export const authFn = async ({ type, variables }) => {
  const res = await RequestQL(
    type == 1 ? REGISTER_MUTATION : LOGIN_MUTATION,
    variables
  );
  return res;
};
