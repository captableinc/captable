import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  spec: {
    url: "/api/v1/schema",
  },
  theme: "deepSpace",
  metaData: {
    title: "Captable API Docs",
    description: "Captable API Docs",
  },
};

export const GET = ApiReference(config);
