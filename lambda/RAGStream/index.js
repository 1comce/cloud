import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateStreamCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION1,
});

export const handler = awslambda.streamifyResponse(
  async (event, responseStream) => {
    try {
      const body =
        typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      const question = body?.question;
      if (!question) {
        responseStream.write("Missing 'question' in request body.");
        return responseStream.end();
      }
      const prompt = `provided with the following knowledge do your best to answer the question below. Don't try to make up an answer. If the knowledge is insufficient, say you don't know. Question: ${question}`;
      const input = {
        input: {
          text: prompt,
        },
        retrieveAndGenerateConfiguration: {
          type: "KNOWLEDGE_BASE",
          knowledgeBaseConfiguration: {
            knowledgeBaseId: process.env.KNOWLEDGE_BASE_ID,
            modelArn: process.env.BEDROCK_MODEL_ARN,
          },
        },
      };

      const command = new RetrieveAndGenerateStreamCommand(input);
      const response = await client.send(command);
      const chunks = [];
      for await (const eventChunk of response.stream) {
        if (eventChunk.output?.text) {
          responseStream.write(eventChunk.output.text);
          //await new Promise(r => setTimeout(r, 300));
          chunks.push(eventChunk.output.text);
        }
        //else if (eventChunk.citation) {
        //  responseStream.write(`\n[Citation received]\n`);
        //} else if (eventChunk.guardrail?.action === "INTERVENED") {
        //  responseStream.write("\n[Response blocked by guardrails]\n");
        //}
      }
      console.log(chunks.join(""));
      responseStream.end();
    } catch (err) {
      console.error("Error invoking RAG stream:", err);
      responseStream.write("Error: " + err.message);
      responseStream.end();
    }
  }
);
