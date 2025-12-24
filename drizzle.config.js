import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",

  dbCredentials:{
    url: 'postgresql://neondb_owner:npg_VU8OflELI0wc@ep-twilight-grass-a44oy1sj-pooler.us-east-1.aws.neon.tech/Ai-Interview-Mocker?sslmode=require&channel_binding=require',
  }
});
