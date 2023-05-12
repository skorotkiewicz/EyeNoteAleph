import Hashids from "hashids";
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";
import { prisma } from "~/backend/database.ts";
import { GraphQLError } from "https://esm.sh/graphql@16.6.0";
import verifyToken from "~/backend/middleware/auth.js";
import { jwt } from "~/backend/djwt.ts";
import {
  COMMENT_SELECT_FIELDS,
  timeControlor,
} from "~/backend/graphql/resolvers/CPrisma.ts";

const hashids = new Hashids("ae(Ibc]_b`|:=`9U^eF", 11); // salt, length 11

export const postEntrie = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);

  const { post } = req;
  const { userId } = verify;
  const uniqId = hashids.encode(Date.now(), 5);

  if (!(post && userId)) throw new GraphQLError("All input is required");

  try {
    const entriePost = await prisma.entrie.create({
      data: {
        uniqId,
        post,
        userId,
      },
      select: {
        uniqId: true,
        post: true,
        added: true,
        userId: true,
      },
    });

    return entriePost;
  } catch (_err) {
    return new GraphQLError("Error, try again.");
  }
};

export const postEntrieComment = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);
  const { userId } = verify;

  const uniqId = hashids.encode(Date.now(), 5);

  if (req.message === "" || req.message === null) {
    return new GraphQLError("Comment is required");
  }
  return await prisma.comment
    .create({
      data: {
        uniqId,
        comment: req.message,
        parentId: req.parentId,
        userId,
        entrieId: req.entrieId,
      },
      select: COMMENT_SELECT_FIELDS,
    })
    .then((comment) => {
      return {
        ...comment,
        likeCount: 0,
        likeByMe: false,
      };
    });
};

export const updateEntrie = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);

  console.log(req, ctx);

  const { message, uniqId } = req;

  if (message === "" || message === null) {
    return new GraphQLError("update comment is required");
  }

  const { userId, createdAt, comment } = await prisma.comment.findUnique({
    where: { uniqId },
    select: { userId: true, createdAt: true, comment: true },
  });

  if (!timeControlor(createdAt))
    return { comment, error: "Time's Up for editing!" };

  if (userId !== verify.userId) {
    return new GraphQLError("You don't have permission to edit this comment");
  }

  return await prisma.comment.update({
    where: { uniqId },
    data: { comment: message },
    select: { comment: true },
  });
};

export const voteComment = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);

  const data = {
    userId: verify.userId,
    entrieId: req.entrieId,
  };

  const like = await prisma.likeComment.findUnique({
    where: { userId_entrieId: data },
  });

  if (like == null) {
    return await prisma.likeComment.create({ data }).then(() => {
      return { addLike: true };
    });
  } else {
    return await prisma.likeComment
      .delete({ where: { userId_entrieId: data } })
      .then(() => {
        return { addLike: false };
      });
  }
};

export const voteEntry = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);

  const data = {
    userId: verify.userId,
    entrieId: req.entrieId,
  };

  const like = await prisma.likeEntry.findUnique({
    where: { userId_entrieId: data },
  });

  if (like == null) {
    //
    const vres = await prisma.entrie.update({
      where: { uniqId: req.entrieId },
      data: { votes: { increment: 1 } },
      select: { votes: true },
    });

    return await prisma.likeEntry.create({ data }).then(() => {
      return { addLike: true, votes: vres.votes };
    });
  } else {
    //
    const vres = await prisma.entrie.update({
      where: { uniqId: req.entrieId },
      data: { votes: { decrement: 1 } },
      select: { votes: true },
    });

    return await prisma.likeEntry
      .delete({ where: { userId_entrieId: data } })
      .then(() => {
        return { addLike: false, votes: vres.votes };
      });
  }
};

export const deleteEntrie = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);

  const { userId } = await prisma.comment.findUnique({
    where: { uniqId: req.uniqId },
    select: { userId: true },
  });

  if (userId !== verify.userId) {
    return new GraphQLError("You are not allowed to delete this comment");
  }

  try {
    return await prisma.comment.delete({
      where: { uniqId: req.uniqId },
      select: { uniqId: true },
    });
  } catch (_error) {
    // console.log(error);
  }
};

export const register = async (_, req, _ctx) => {
  try {
    const { username, password, password2 } = req;
    const email = req.email.toLowerCase();

    if (password !== password2) {
      return new GraphQLError("Password not matches.");
    }

    if (!(username && password && email)) {
      return new GraphQLError("All input is required");
    }

    // check if user already exist
    const oldUser = await prisma.user.findFirst({
      where: { email },
    });

    if (oldUser) {
      return new GraphQLError("User already exist. Please Login");
    }

    // encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: encryptedPassword,
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        joined: true,
      },
    });

    const token = await jwt({ userId: user.id, email }, 1);

    delete user.password;

    // save use token
    user.token = token;

    return user;
    // deno-lint-ignore no-empty
  } catch (_err) {}
};

export const login = async (_, req, _ctx) => {
  try {
    const email = req.email.toLowerCase();
    const password = req.password;

    if (!(email && password)) {
      return new GraphQLError("All input is required");
    }

    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const lastSeen = new Date();

      // create token
      const token = await jwt({ userId: user.id, email }, 1);

      await prisma.user.update({
        where: { email },
        data: { lastSeen },
      });

      user.lastSeen = lastSeen;
      delete user.password;

      // save use token
      user.token = token;

      return user;
      // return JSON.parse(user);
    }

    return new GraphQLError("Invalid Credentials");

    // deno-lint-ignore no-empty
  } catch (_err) {}
};

export default {
  register,
  login,
  postEntrie,
  postEntrieComment,
  updateEntrie,
  voteComment,
  voteEntry,
  deleteEntrie,
};
