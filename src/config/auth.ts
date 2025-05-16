import { type ResourcesConfig } from "aws-amplify";

export const authConfig: ResourcesConfig["Auth"] = {
  Cognito: {
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    identityPoolId: String(process.env.NEXT_PUBLIC_IDENTITY_POOL_ID),
  },
};
export const storageConfig: ResourcesConfig["Storage"] = {
  S3: {
    bucket: String(process.env.NEXT_PUBLIC_BUCKET),
    region: String(process.env.NEXT_PUBLIC_BUCKET_REGION),
  },
};
export const graphqlConfig: ResourcesConfig["API"] = {
  GraphQL: {
    endpoint: String(process.env.NEXT_PUBLIC_GRAPHQL_API_URL),
    defaultAuthMode: "apiKey",
    apiKey: String(process.env.NEXT_PUBLIC_GRAPHQL_API_KEY),
  },
};
export const restConfig: ResourcesConfig["API"] = {
  REST: {
    myApi: {
      endpoint: String(process.env.NEXT_PUBLIC_API_ENDPOINT),
    },
  },
};
