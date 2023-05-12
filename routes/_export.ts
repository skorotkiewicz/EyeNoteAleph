// Exports router modules for serverless env that doesn't support the dynamic import.
// This module will be updated automaticlly in develoment mode, do NOT edit it manually.

import * as $0 from "./_404.tsx";
import * as $1 from "./_app.tsx";
import * as $2 from "./index.tsx";
import * as $3 from "./dashboard.jsx";
import * as $4 from "./entries/index.tsx";
import * as $5 from "./entries/$all+.tsx";
import * as $6 from "./auth/$type.jsx";
import * as $7 from "./entry/$id.tsx";

export default {
  "/_404": $0,
  "/_app": $1,
  "/": $2,
  "/dashboard": $3,
  "/entries/index": $4,
  "/entries/:all+": $5,
  "/auth/:type": $6,
  "/entry/:id": $7,
};
