import { prisma } from "~/backend/database.ts";
import { GraphQLError } from "https://esm.sh/graphql@16.6.0";
import { createPaginator } from "prisma-pagination";
import verifyToken from "~/backend/middleware/auth.js";
import { COMMENT_SELECT_FIELDS } from "~/backend/graphql/resolvers/CPrisma.ts";

export const welcome = async (_, _req, ctx) => {
  const verify = await verifyToken(ctx);
  if (verify?.error) return new GraphQLError(verify?.error);

  return "OK";
};

export const getEntries = async (_, req, _ctx) => {
  try {
    const page = req.page;
    const paginate = createPaginator({ perPage: 6 });

    const entries = await paginate(
      prisma.entrie,
      {
        select: {
          added: true,
          post: true,
          uniqId: true,
          votes: true,
          User: {
            select: {
              username: true,
              lastSeen: true,
            },
          },
          //   likes: true,
        },
        orderBy: {
          id: "desc",
        },
      },
      { page }
    );

    const likesCount = await prisma.likeEntry.groupBy({
      by: ["entrieId"],
      where: {
        entrieId: {
          in: entries.data.map((entry) => entry.uniqId),
          //   in: ["aBrP7qVlZfj", "P2VBPVAwjUr", "kqOYyn5gGcp"],
        },
      },
      _count: {
        entrieId: true,
      },
    });

    const entriesWithLikesCount = entries.data.map((entry) => {
      const entryLikesCount = likesCount.find(
        (likes) => likes.entrieId === entry.uniqId
      );
      return {
        ...entry,
        likes: entryLikesCount?._count || 0,
      };
    });

    // const entries = await paginate(
    //   prisma.entrie,
    //   {
    //     select: {
    //       added: true,
    //       post: true,
    //       uniqId: true,
    //       //   likes: true,
    //       User: {
    //         select: {
    //           username: true,
    //           lastSeen: true,
    //         },
    //       },
    //     },
    //     orderBy: {
    //       id: "desc",
    //     },
    //   },
    //   { page }
    // );

    return { data: entriesWithLikesCount, meta: entries.meta };
  } catch (_err) {
    // console.log(_err);
    return new GraphQLError("Error, try again.");
  }
};

export const getEntrie = async (_, req, ctx) => {
  const verify = await verifyToken(ctx);
  //   if (verify?.error) return new Error(verify?.error);
  const { userId } = verify;

  return await prisma.entrie
    .findUnique({
      where: { uniqId: req.entrieId },
      select: {
        uniqId: true,
        post: true,
        added: true,
        // likes: true,
        votes: true,
        User: {
          select: {
            username: true,
            joined: true,
            lastSeen: true,
          },
        },
        comments: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            ...COMMENT_SELECT_FIELDS,
            _count: { select: { likes: true } },
          },
        },
      },
    })
    .then(async (post) => {
      try {
        const likes = await prisma.likeComment.findMany({
          where: {
            userId,
            entrieId: { in: post.comments.map((comment) => comment.uniqId) },
          },
        });

        return {
          ...post,
          comments: post.comments.map((comment) => {
            const { _count, ...restOfFields } = comment;
            return {
              ...restOfFields,
              likeByMe:
                likes.find((like) => like.entrieId === comment.uniqId)
                  ?.userId === userId,
              likeCount: _count.likes,
            };
          }),
        };
      } catch (_err) {
        return new GraphQLError("Error, try again.");
      }
    });
};

export default { getEntries, getEntrie, welcome };

// const resolvers = {
//   Query: {
//     hello: () => `Hello World!`,
//   },
// };

// export default { hello };
