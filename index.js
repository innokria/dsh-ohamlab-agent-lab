
import { defineTool } from "@deepseek-ai/dsh-tools";

export const name = "dsh-prefix-ohamlab-agent-lab";
export const inject = ["tools"];

const output = {
  schema: { type: "string" },
  render: (_args, value) => [{ type: "text", text: value }]
};

function notConnected(toolName) {
  return async () => {
    throw new Error(
      `${toolName} is registered, but its OhamLab Agent Lab backend is not connected yet.`
    );
  };
}

export function apply(ctx) {
  const tools = [
    {
      name: "ohamlab_create_agent",
      description: "Create a new agent with a specified name and instructions.",
      parameters: {
        name: {
          type: "string",
          required: true,
          description: "Name for the new agent"
        },
        instructions: {
          type: "string",
          required: true,
          description: "Instructions defining the agent's role"
        }
      }
    },
    {
      name: "ohamlab_clone_agent",
      description: "Clone an existing agent into a separate agent instance.",
      parameters: {
        agent_id: {
          type: "string",
          required: true,
          description: "ID of the agent to clone"
        },
        new_name: {
          type: "string",
          required: true,
          description: "Name of the cloned agent"
        }
      }
    },
    {
      name: "ohamlab_assign_task",
      description: "Assign a task to an existing agent.",
      parameters: {
        agent_id: {
          type: "string",
          required: true,
          description: "Target agent ID"
        },
        task: {
          type: "string",
          required: true,
          description: "Task instructions"
        }
      }
    },
    {
      name: "ohamlab_run_agent",
      description: "Run a task using an existing agent.",
      parameters: {
        agent_id: {
          type: "string",
          required: true,
          description: "Agent to execute"
        },
        task: {
          type: "string",
          required: true,
          description: "Task to execute"
        }
      }
    },
    {
      name: "ohamlab_run_swarm",
      description: "Coordinate multiple agents to complete a shared task.",
      parameters: {
        task: {
          type: "string",
          required: true,
          description: "Overall objective for the agent swarm"
        },
        agent_count: {
          type: "number",
          required: true,
          description: "Number of agents to use"
        }
      }
    },
    {
      name: "ohamlab_get_report",
      description: "Retrieve a report from an agent or swarm execution.",
      parameters: {
        task_id: {
          type: "string",
          required: true,
          description: "Task or execution ID"
        }
      }
    }
  ];

  ctx.effect(() => {
    const disposers = tools.map(tool =>
      ctx.tools.register(
        defineTool({
          ...tool,
          output,
          async execute() {
            return notConnected(tool.name)();
          }
        })
      )
    );

    console.log(
      `[${name}] Registered ${disposers.length} OhamLab tools`
    );

    return () => {
      for (const dispose of disposers) dispose();
    };
  });
}
