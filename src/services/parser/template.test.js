import { describe, expect, test } from "vitest";

import { resolveArgs, resolvedTemplate } from "./template";

describe("SCENARIOS", () => {
  // TODO: simulate env
  const env = {};
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
  describe("GET /v1/account", () => {
    test("happy path", async () => {
      scenarios.forEach((scenario, index) => {
        console.log(`Scenario ${index + 1}:`);
        const resolvedTemplate = resolveArgs(scenario.template, scenario.context);
        console.log('Template:', scenario.template);
        console.log('Resolved:', resolvedTemplate);
        console.log('Parsed:', JSON.parse(resolvedTemplate));
        console.log('---');
      });
    });
  });
});
