import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials: {
    url: "postgresql://MockDB_owner:qdFRDh1gHz9I@ep-delicate-leaf-a5jqet41.us-east-2.aws.neon.tech/MockDB?sslmode=require",
  },
});
