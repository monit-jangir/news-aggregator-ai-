import "dotenv/config.js";
import { ReActAgent } from "beeai-framework/agents/react/agent";
import { FrameworkError } from "beeai-framework/errors";
import * as process from "node:process";
import { PythonTool } from "beeai-framework/tools/python/python";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { UnconstrainedMemory } from "beeai-framework/memory/unconstrainedMemory";
import { LocalPythonStorage } from "beeai-framework/tools/python/storage";
import { CustomTool } from "beeai-framework/tools/custom";
import { createConsoleReader } from "./helpers/reader.js";
import { ChatModel } from "beeai-framework/backend/chat";

const codeInterpreterUrl = process.env.CODE_INTERPRETER_URL;
if (!codeInterpreterUrl) {
  throw new Error(`The 'CODE_INTERPRETER_URL' environment variable was not set! Terminating.`);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const agent = new ReActAgent({
  llm: await ChatModel.fromName(process.env.LLM_CHAT_MODEL_NAME as any),
  memory: new UnconstrainedMemory(),
  tools: [
    new PythonTool({
      codeInterpreter: { url: codeInterpreterUrl },
      storage: new LocalPythonStorage({
        interpreterWorkingDir: `${__dirname}/../tmp/code_interpreter_target`,
        localWorkingDir: `${__dirname}/../tmp/code_interpreter_source`,
      }),
    }),
    await CustomTool.fromSourceCode(
      {
        url: codeInterpreterUrl,
      },
      `import requests

def get_riddle() -> dict[str, str] | None:
  """
  Fetches a random riddle from the Riddles API.

  This function retrieves a random riddle and its answer. It does not accept any input parameters.

  Returns:
      dict[str,str] | None: A dictionary containing:
          - 'riddle' (str): The riddle question.
          - 'answer' (str): The answer to the riddle.
      Returns None if the request fails.
  """
  url = 'https://riddles-api.vercel.app/random'
  
  try:
      response = requests.get(url)
      response.raise_for_status() 
      return response.json() 
  except Exception as e:
      return None`,
    ),
  ],
});

const reader = createConsoleReader({ fallback: "Generate a random riddle." });
for await (const { prompt } of reader) {
  try {
    const response = await agent
      .run(
        { prompt },
        {
          execution: {
            maxIterations: 8,
            maxRetriesPerStep: 3,
            totalMaxRetries: 10,
          },
        },
      )
      .observe((emitter) => {
        emitter.on("update", (data) => {
          reader.write(`Agent 🤖 (${data.update.key}) : `, data.update.value);
        });
      });

    reader.write(`Agent 🤖 : `, response.result.text);
  } catch (error) {
    reader.write(`Error`, FrameworkError.ensure(error).dump());
  }
}
