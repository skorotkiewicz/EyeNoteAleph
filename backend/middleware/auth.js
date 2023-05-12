import { jwt } from "~/backend/djwt.ts";

const verifyToken = async (ctx) => {
  let token = await ctx.request.headers.get("authorization");

  try {
    if (token && token.split(" ")[0] === "Bearer") {
      token = token.split(" ")[1];
    }
    // deno-lint-ignore no-empty
  } catch (_err) {}

  if (!token) return { error: "A token is required for authentication" };
  try {
    const decoded = await jwt(token, 0);
    return decoded;
  } catch (_err) {
    return { error: "Invalid Token" };
  }
};

export default verifyToken;
