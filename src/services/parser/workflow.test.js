import { describe, expect, test } from "vitest";

import { run } from "./workflow";

describe("SCENARIOS", () => {
  // TODO: simulate env
  const env = {};

  /*
  const searchData = {
    data: "in the beginning",
  };
  */
  const searchData = "in the beginning";

  const searchEnv = {
    "country": "US",
    "secrets": {
      "CF_EMBEDDINGS_TOKEN": "h9r9MWFs9yZDE6aqCtPWF4k3rrbPQ6b4GPehlNE8",
      "UPSTASH_TOKEN": "ABYFMG9wdGltYWwtam9leS03NTE5Ny1ldTFhZG1pbk56aGtNbUZsTXpFdFpUUTFOUzAwTlRnNExXRmxPRGd0TmpJMU9HVTBPREZtWVRjMw==",
      "PINECONE_API_KEY": "21463a3c-4072-452e-beb7-27794e74e5d3"
    }
  };

  const chatData = {
      "model": "123XYZ",
      "temperature": 0.3,
      "messages": [
          { "role": "user", "content": "I have a question about Arabic root words in the Bible. What are the most commonly used?" },
          //{ "role": "system", "content": "You are a helpful chatbot" },
          //{ "role": "user", "content": "Hello! What day was yesterday?" },
      ],
      "max_tokens": 100
  };

  const chatEnv = {
      "country": "US",
      "secrets": {
        "OPENROUTER_API_KEY": "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"
      }
  };

  const mergedEnv = {
      "country": "US",
      "secrets": {
        "CF_EMBEDDINGS_TOKEN": "h9r9MWFs9yZDE6aqCtPWF4k3rrbPQ6b4GPehlNE8",
        "UPSTASH_TOKEN": "ABYFMG9wdGltYWwtam9leS03NTE5Ny1ldTFhZG1pbk56aGtNbUZsTXpFdFpUUTFOUzAwTlRnNExXRmxPRGd0TmpJMU9HVTBPREZtWVRjMw==",
        "PINECONE_API_KEY": "21463a3c-4072-452e-beb7-27794e74e5d3",
        "OPENROUTER_API_KEY": "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",
        "DT_EN_KEY": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2VuZ2xpc2guZGhtc2EubmV0IiwiaWF0IjoxNzMwNzQ1MDUzLCJuYmYiOjE3MzA3NDUwNTMsImV4cCI6MTczMTM0OTg1MywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjYifX19.dKqyve_kWC87gHXO4Qq3Mbnh-SUgOBBPAt_acFSjJGQ"
      }
  };

  const flow = searchProfileUpstashFlow;
  //const flow = contextChatFlow;

  const initialContext = { data: searchData, env: searchEnv };
  //const initialContext = { data: chatData, env: chatEnv };
  //const initialContext = { data: chatData, env: mergedEnv };

  const scenarios = [
    {
      context: {
        result2: JSON.stringify([1, 2, 3])
      },
      template: "{ \"topK\": 2, \"includeMetadata\": true, \"includeData\": true, \"vector\": {{result2}} }"
    },
    {
      context: {
        result2: JSON.stringify([1, 2, 3])
      },
      template: "{ \"topK\": 2, \"includeMetadata\": true, \"includeData\": true, \"vector\": \"{{result2}}\" }"
    },
    {
      context: {
        result2: [1, 2, 3]
      },
      template: "{ \"topK\": 2, \"includeMetadata\": true, \"includeData\": true, \"vector\": \"{{result2}}\" }"
    },
    {
      context: {
        result: {
          step2: JSON.stringify({ id: 123, name: "example" })
        }
      },
      template: "{ \"topK\": 2, \"includeMetadata\": true, \"includeData\": true, \"vector\": {{result.step2}} }"
    },
    {
      context: {
        result: {
          step2: { id: 123, name: "example" }
        }
      },
      template: "{ \"topK\": 2, \"includeMetadata\": true, \"includeData\": true, \"vector\": \"{{result.step2}}\" }"
    }
  ];
  describe("Run", () => {
    test("happy path", async () => {
      //const result = await execute(flow, initialContext);
      const result = await execute(flow?.steps, initialContext);
      console.log("********************************************")
      console.log("WORKFLOW RESULT: ", result);
      //const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    });
  });
});
