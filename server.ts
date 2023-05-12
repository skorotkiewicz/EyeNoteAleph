import { serve } from "aleph/server";
import react from "aleph/plugins/react";
import denoDeploy from "aleph/plugins/deploy";
import modules from "~/routes/_export.ts";
import unocss from "aleph/plugins/unocss";
import config from "~/unocss.config.ts";

import { typeDefs } from "~/backend/graphql/typeDefs.js";
import Query from "~/backend/graphql/resolvers/Query.js";
import Mutation from "~/backend/graphql/resolvers/Mutation.js";
import { createYoga, createSchema } from "https://esm.sh/graphql-yoga@3.9.1";
// import { prisma } from "~/backend/database.ts";

const resolvers = {
  Query,
  Mutation,
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  // context: {
  //   prisma,
  //   // aaa: "aaa",
  // },
});

// ServeQL(yoga, {
//   port: 4000,
//   onListen({ hostname, port }: any) {
//     console.log(
//       `Listening on http://${hostname}:${port}${yoga.graphqlEndpoint}`
//     );
//   },
// });

serve({
  plugins: [denoDeploy({ modules }), react({ ssr: true }), unocss(config)],
  middlewares: [
    {
      name: "graphql",
      fetch: (req, ctx) => {
        const url = new URL(req.url);

        if (url.pathname == "/api/graphql") return yoga(req);
        else return ctx.next();
      },
    },
  ],
});
