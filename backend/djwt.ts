import {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.8/mod.ts";
import { config } from "https://deno.land/std@0.163.0/dotenv/mod.ts";
const envVars = await config();

export const jwt = async (data: any, action: number) => {
  const secret = envVars.TOKEN_KEY;

  const enc = new TextEncoder();
  const body = { ...data, exp: getNumericDate(60 * 60) };

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"]
  );

  if (action === 1)
    return await create({ alg: "HS512", typ: "JWT" }, body, key);

  if (action === 0) return await verify(data, key);
};

// const qqq = await jwt({ ala: "112233" }, 1); // create
// const aaa = await jwt(qqq, 0); // verify
