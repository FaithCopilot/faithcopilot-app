const httpClient = async (args) => {
  //console.log("HTTP Client Args: ", args);
  if (!args?.url || !args?.method) {
    throw new Error('Missing URL or Method in HTTP request');
  };
  const url = new URL(args.url);
  if (args?.searchParams) {
    for (const [key, value] of Object.entries(args.searchParams)) {
      url.searchParams.append(key, value);
    };
  };
  const options = { method: args.method };
  if (args?.headers) {
    options["headers"] = args.headers;
  };
  if (args?.body) {
    const body = args.body;
    if (!args?.parse && !args?.stringify) {
      options["body"] = body;
    };
    if (args?.parse) {
      options["body"] = deepJsonParse(body);
    };
    // override parse, if stringify is set
    if (args?.stringify) {
      options["body"] = JSON.stringify(body);
    };
  };
  const response = await fetch(url, options);
  const resText = await response.text();
  if (!response.ok) {
    console.log("Args: ", args);
    throw new Error(`HTTP error: ${response.status} - ${response.statusText} - ${resText}`);
  };
  const resData = safeParse(resText);
  //console.log("** TYPEOF RESDATA: ", typeof resData);
  return resData;
};

const runCallStep = async(step, context) => {

  // Handle different call types
  if (step?.["call"]) {
    const args = step.args ? resolveArgs(step.args, context) : {};

    if (step.call === 'vars') {
      return args;
    }

    if (step.call === 'script') {
      return runCode(args, args.code);
    }

    if (step.call === 'http') {
      return httpClient(args);
    }

    if (step.call.startsWith('service:')) {
      const [_, serviceType, serviceId] = step.call.split(/[:#+]/);
      console.log("Service Type: ", serviceType);
      console.log("Service ID: ", serviceId);
      if (serviceType === 'ctx') {
        /*
          const serviceContext = {
            ...context,
            data: {},
            env: {},
          };
        */
        // TODO: lookup 
        const serviceWorkflow = {
          "name": "Smart Context 1",
          "next": "ctx1",
          "ctx1": {
              "name": "Testy Test",
              "call": "code:js",
              "args": {
                  "data": "{{args.data}}",
                  "env": "{{args.env}}",
                  "code": `return([
                    {"id":"01J82K0FEJFAA12ARG6V0CCYF5-01J82K0HQ0GK19E6HJX4F91QMY","score":0.61473459,"values":[],"metadata":{"file-name":"Quickstart.txt","language":"en"},"data":"# Quickstart\n\nThis documentation provides an overview and explanation of a Google Colab script. The script processes files, generates embeddings, and uploads them to a FaithCopilot server while supporting two vector storage providers: Pinecone and Upstash."}
                  ])`
              },
              "result": "SMART_CONTEXT_1",
              "next": "End"
          },
          "End": {
              "return": "{{SMART_CONTEXT_1}}"
          }
        };
        const result = await run(serviceWorkflow, context);
        console.log("-------------> Service Result: ", result);
        return result;
      };
      return {};
    }
  }

  return null;
}

export const run = async(workflow, initialContext = {}) => {
  if (!workflow) {
    throw new Error('No workflow steps provided');
  };
  let context = { args: initialContext };

  for (let ii=0; ii < workflow?.length; ii++) {
    const step = workflow[ii];
    console.log("********************************************")
    console.log(`Step: "${step.name ?? "N/A"}"`); //, JSON.stringify(step, null, 2));
    let result = null;
    //try {

      // Handle variable assignments
      if (step?.assign) {
        for (const assignment of step.assign) {
          const [key, value] = Object.entries(assignment)[0];
          context[key] = resolveArgs(value, context);
        };
      };

      // Handle call directive
      if (step?.call) {
        result = await runCallStep(step, context);
        //console.log("Result: ", result ?? "N/A");
      };

      // Check for EOS result, to end the workflow
      if (result == "<|EOS|>") {
        if (context?.["EOS_RESPONSE"]) {
          return context["EOS_RESPONSE"];
        } else {
          return "I am sorry, I am not able to help you with that.";
        };
      };
      
      // Store result in context, if specified
      if (step?.result) {
        context[step.result] = result;
      };

      // Handle return statement, if specified
      if (step?.return !== undefined) {
        context = resolveArgs(step.return, context);
        return context;
      };

      /*
    } catch (error) {
      throw new Error(`Error executing step ${currentStep}: ${error.message}`);
    }
      */
  };
  return context;
};