import { fetchAuthSession } from "aws-amplify/auth";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Sha256 } from "@aws-crypto/sha256-js";
import { generateClient } from "aws-amplify/api";
import { sendMessage, getMessages } from "./graphql";
const client = generateClient();
export const getAuthSession = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken;
  const userEmail = session.tokens?.idToken?.payload.email?.toString();
  const userId = session.tokens?.accessToken?.payload.sub;
  console.log(session);
  return {
    credentials: session.credentials,
    tokens: token?.toString(),
    userEmail,
    userId,
  };
};
export const invokeLambda = async (credentials: any, question: string) => {
  if (!credentials) {
    throw new Error("Failed to retrieve session or credentials");
  }

  const lambdaUrl = process.env.NEXT_PUBLIC_FUNCTION_URL as string;
  const url = new URL(lambdaUrl);
  const request = new HttpRequest({
    method: "POST",
    hostname: url.hostname,
    path: url.pathname || "/",
    headers: {
      "Content-Type": "application/json",
      Host: url.hostname, // Explicitly set Host header
    },
    body: JSON.stringify({ question }),
  });

  const signer = new SignatureV4({
    credentials,
    region: "ap-southeast-2",
    service: "lambda",
    sha256: Sha256,
  });

  const signedRequest = await signer.sign(request);
  const signedUrl = formatUrl(signedRequest);

  const response = await fetch(signedUrl, {
    method: signedRequest.method,
    headers: signedRequest.headers as Record<string, string>,
    body: signedRequest.body,
  });
  return response;
};
export const getAIReposnse = async (question: string) => {
  const { credentials, tokens } = await getAuthSession();
  const response = await invokeLambda(credentials, question);
  return response;
};
export const postMessage = async (content: string, role: string) => {
  const { userId } = await getAuthSession();
  const res = await client.graphql({
    query: sendMessage,
    variables: {
      userId,
      role: role,
      content: content,
    },
  });
  return res;
};
export const fetchMessages = async () => {
  const { userId } = await getAuthSession();
  const res: any = await client.graphql({
    query: getMessages,
    variables: {
      userId,
    },
  });
  return res;
};
