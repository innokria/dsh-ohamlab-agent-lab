# DSH Plugin — OhamLab Agent Lab
## GOAL
```
User asks DSH to create an agent
          ↓
ohamlab_create_agent (registered JS tool)
          ↓
JS plugin invokes Python package
          ↓
ohamlab-agent-lab creates the agent
          ↓
Result returned to DSH
```
DeepSeek Harness integration for [OhamLab Agent Lab](https://github.com/innokria/ohamlab-agent-lab).

## Core project

- Repository: https://github.com/innokria/ohamlab-agent-lab
- Core release: [1.0](https://github.com/innokria/ohamlab-agent-lab/releases/tag/1.0)
- Python package: `ohamlab-agent`

## Installation

Install the Python dependency in the same runtime environment used by DSH:

```bash
python -m pip install ohamlab-agent
```

Install this DSH bundle into the web profile:

```bash
dsh plugin --profile web add github:innokria/dsh-prefix-ohamlab-agent-lab
```

Restart the profile after installation if required by your DSH version.

## Intended capabilities

The integration is designed to expose:

- Agent creation and cloning
- Task assignment and execution
- Multi-agent orchestration
- MCP tool discovery and execution
- Individual and combined Markdown reports

These capabilities become available through DSH as their corresponding native tools are implemented and tested.
## Tool exposed
```
ohamlab_create_agent



ohamlab_clone_agent



ohamlab_assign_task



ohamlab_run_agent



ohamlab_run_swarm



ohamlab_get_report
```
## Development

```bash
git clone https://github.com/innokria/dsh-ohamlab-agent-lab.git
cd dsh-ohamlab-agent-lab
```

Inspect the plugin configuration:

```bash
dsh --profile web --dump-config
```

## Architecture

This repository contains the DSH integration layer. The core agent framework remains maintained separately in `innokria/ohamlab-agent-lab`.

Do not duplicate the core Python implementation here. Pin and update the core dependency independently, and test compatibility before releasing plugin updates.
