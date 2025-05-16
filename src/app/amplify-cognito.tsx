"use client";
import { Amplify } from "aws-amplify";
import { authConfig, storageConfig, graphqlConfig } from "../config/auth";

Amplify.configure(
  {
    Auth: authConfig,
    Storage: storageConfig,
    API: graphqlConfig,
  },
  {
    ssr: true,
    // API: {
    //   REST: {
    //     retryStrategy: {
    //       strategy: "no-retry",
    //     },
    //     headers: async () => {
    //       return { Authorization: 'authToken' };
    //   },}
    // },
  }
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
