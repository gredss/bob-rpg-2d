# DataStage MCP Server — Project Plan

## Overview

Build a **read-only, Python-based MCP server** that exposes IBM DataStage on IBM Cloud (SaaS) to
AI assistants such as Bob. The server uses the **stdio transport** (spawned as a local child
process) and authenticates against IBM Cloud IAM using credentials read from environment variables.
It will expose four tools covering the core observability workflow: list projects, list flows, list
jobs, and fetch job run logs. Once built, the server will be registered in Bob's workspace-scoped
MCP config so it is immediately usable.

**Scope:** Greenfield project. No existing code to extend.

**Non-goals:**
- Write, create, update, or delete any DataStage resource
- LLM-optimised summarisation — raw API JSON is returned as-is
- Multi-user or remote HTTP transport
- Pagination beyond what the DataStage API provides by default

---

## Architecture

```
Bob (Plan / Agent mode)
       │  stdio
       ▼
datastage-mcp-server (Python process)
       │  HTTPS + IAM Bearer Token
       ▼
IBM DataStage SaaS API (api.dataplatform.cloud.ibm.com)
```

**Authentication flow:**
1. Server reads `CPD_USERNAME` and `CPD_PASSWORD` from env at startup.
2. On first tool call, exchanges credentials for an IBM Cloud IAM access token via the IAM token
   endpoint (`https://iam.cloud.ibm.com/identity/token`).
3. Access token is cached in memory and refreshed when expired.

---

## Sub-Tasks

---

### Sub-Task 1 — Project Scaffold

**Intent:** Lay down the directory structure, dependency file, and Python packaging config so the
project is installable and runnable as a local process.

**Expected Outcomes:**
- `datastage-mcp-server/` directory exists with a `src/datastage_mcp/` package.
- `pyproject.toml` declares the package, entrypoint, and all dependencies.
- `requirements.txt` (pinned, for lock-file reproducibility) is generated from `pyproject.toml`.
- A `.gitignore` is in place that excludes `.env`, `__pycache__`, `*.pyc`, `dist/`, `.venv/`.

**Todo List:**
1. Create directory `datastage-mcp-server/src/datastage_mcp/`.
2. Create `datastage-mcp-server/pyproject.toml` with:
   - `[project]` metadata: name `datastage-mcp-server`, version `0.1.0`.
   - Dependencies: `mcp[cli]` (latest stable), `httpx` (latest stable), `python-dotenv` (latest
     stable).
   - `[project.scripts]` entrypoint: `datastage-mcp-server = "datastage_mcp.server:main"`.
3. Create `datastage-mcp-server/src/datastage_mcp/__init__.py` (empty).
4. Create `datastage-mcp-server/.gitignore` covering `.env`, `__pycache__`, `*.pyc`, `dist/`,
   `.venv/`, `*.egg-info`.

**Relevant Context:**
- Python MCP SDK: `mcp[cli]` package, `mcp.server.fastmcp.FastMCP` class.
- Transport: `mcp.server.stdio` — the SDK's stdio server runner.
- Runtime check before registration: `python --version` (need Python 3.10+).

**Status:** `[ ] pending`

---

### Sub-Task 2 — IAM Authentication Module

**Intent:** Implement a reusable, secure token manager that exchanges CPD username/password for an
IBM Cloud IAM bearer token and caches it in memory until it expires.

**Expected Outcomes:**
- `datastage-mcp-server/src/datastage_mcp/auth.py` exists.
- `IamTokenManager` class reads `CPD_USERNAME` and `CPD_PASSWORD` from `os.environ` at
  instantiation and raises a clear `EnvironmentError` if either is missing.
- `get_token()` method returns a valid bearer token string, refreshing automatically when the
  cached token is within 60 seconds of expiry.
- Credentials and tokens are **never** logged.
- All HTTP calls use `httpx` with TLS certificate verification enabled (default).

**Todo List:**
1. Create `auth.py` with `IamTokenManager` class.
2. On init: validate env vars present; store username and password in private instance attributes.
3. Implement `get_token() -> str`:
   - If cached token is valid (expiry - 60 s > now), return it.
   - Otherwise POST to `https://iam.cloud.ibm.com/identity/token` with
     `grant_type=urn:ibm:params:oauth:grant-type:apikey` — use the IBM Cloud IAM token endpoint
     appropriate for CPD username/password (`grant_type=password`, `username`, `password`,
     `response_type=cloud_iam`).
   - Parse `access_token` and `expiration` from the response.
   - Cache and return the token.
4. Return `isError: true`-style errors from tool handlers (not from auth module directly — raise
   exceptions and let tool handlers catch them).

**Relevant Context:**
- IBM Cloud IAM token endpoint: `POST https://iam.cloud.ibm.com/identity/token`
- Payload for username/password: `grant_type=password&username=<>&password=<>&response_type=cloud_iam`
- Security rule: NEVER log `CPD_PASSWORD`, token values, or any credential.
- Use `httpx.Client` with default SSL verification (do not set `verify=False`).

**Status:** `[ ] pending`

---

### Sub-Task 3 — DataStage API Client

**Intent:** Implement a thin HTTP client that wraps the four DataStage SaaS API calls needed by
the tools, injecting the IAM bearer token on every request.

**Expected Outcomes:**
- `datastage-mcp-server/src/datastage_mcp/client.py` exists.
- `DataStageClient` class accepts an `IamTokenManager` and a base URL
  (`https://api.dataplatform.cloud.ibm.com`).
- Four methods implemented, each returning the raw parsed JSON dict/list:
  1. `list_projects(limit: int) -> dict`
  2. `list_flows(project_id: str) -> dict`
  3. `list_jobs(project_id: str) -> dict`
  4. `get_job_run_logs(project_id: str, job_id: str, run_id: str) -> dict`
- All requests use HTTPS, include `Authorization: Bearer <token>`, and have a 30-second timeout.
- HTTP errors are raised as exceptions (let `httpx` raise on 4xx/5xx via `raise_for_status()`).

**Todo List:**
1. Create `client.py` with `DataStageClient` class.
2. Implement each of the four methods using `httpx.Client` with the correct DataStage REST
   endpoints:
   - `GET /v2/projects` → list projects
   - `GET /data_intg/v3/data_intg_flows?project_id=<id>` → list flows
   - `GET /v2/jobs?project_id=<id>` → list jobs
   - `GET /v2/jobs/<job_id>/runs/<run_id>/logs?project_id=<id>` → get run logs
3. Call `token_manager.get_token()` before every request to ensure token freshness.
4. Set `raise_for_status()` on every response.
5. Return `response.json()` as-is (raw JSON, no transformation).

**Relevant Context:**
- Base URL: `https://api.dataplatform.cloud.ibm.com`
- All endpoints require `Authorization: Bearer <token>` header.
- TLS must remain enabled (IBM Cloud enforces HTTPS).

**Status:** `[ ] pending`

---

### Sub-Task 4 — MCP Server and Tool Registration

**Intent:** Wire up the four tools into an MCP server using the Python MCP SDK's `FastMCP` class,
so Bob can discover and call them over stdio.

**Expected Outcomes:**
- `datastage-mcp-server/src/datastage_mcp/server.py` exists.
- `FastMCP` server named `"datastage"` is instantiated.
- Four tools registered:
  | Tool name | Description |
  |---|---|
  | `datastage_list_projects` | List all DataStage projects accessible to the authenticated user |
  | `datastage_list_flows` | List all DataStage flows in a given project |
  | `datastage_list_jobs` | List all DataStage jobs in a given project |
  | `datastage_get_job_run_logs` | Fetch logs for a specific job run |
- Each tool returns `{"content": [{"type": "text", "text": <json_string>}]}`.
- On any exception, tools return `isError: True` with the error message (no stack trace exposed to
  the caller).
- `main()` function calls `mcp.server.stdio.stdio_server()` to start the server.
- All logging goes to `stderr` (never `stdout`).

**Todo List:**
1. Create `server.py`; import `FastMCP` from `mcp.server.fastmcp`.
2. Instantiate `IamTokenManager` and `DataStageClient` at module level (startup validates env vars
   immediately).
3. Register `datastage_list_projects` tool — input: `limit: int = 100`.
4. Register `datastage_list_flows` tool — input: `project_id: str`.
5. Register `datastage_list_jobs` tool — input: `project_id: str`.
6. Register `datastage_get_job_run_logs` tool — inputs: `project_id: str`, `job_id: str`,
   `run_id: str`.
7. Each tool handler: calls the appropriate `DataStageClient` method, serialises result with
   `json.dumps`, and returns it in the MCP content envelope. Wraps the call in try/except and
   returns `isError: True` on failure.
8. Implement `main()` to run the stdio server.

**Relevant Context:**
- `FastMCP` from `mcp.server.fastmcp` — Python MCP SDK.
- Use `@mcp.tool()` decorator pattern or `server.registerTool` equivalent in the Python SDK.
- Logging: `import logging; logging.basicConfig(stream=sys.stderr)`.

**Status:** `[ ] pending`

---

### Sub-Task 5 — Bob MCP Registration

**Intent:** Register the built server in Bob's workspace-scoped MCP config so it connects
automatically when Bob opens this workspace.

**Expected Outcomes:**
- `.bob/mcp.json` exists in the workspace root with a `"datastage"` server entry.
- Server entry uses `"command": "python"` (or `"uvx"`) with the correct `args` pointing to the
  installed entrypoint.
- `CPD_USERNAME` and `CPD_PASSWORD` env var keys are present in the `env` block (values left as
  instructional placeholders — user fills them in).
- No existing servers are overwritten (read-then-merge pattern).

**Todo List:**
1. Confirm Python 3.10+ is available in the environment.
2. Determine the correct invocation — either:
   - `"command": "python", "args": ["-m", "datastage_mcp.server"]` (if installed in venv), or
   - `"command": "uvx", "args": ["--from", "datastage-mcp-server", "datastage-mcp-server"]` (if
     using `uvx`).
3. Read `.bob/mcp.json` if it exists; merge the new server entry into `mcpServers`.
4. Write `.bob/mcp.json` with the merged content.
5. Prompt the user to replace the placeholder env var values with real credentials.
6. Instruct the user to verify the server appears as connected in Bob's MCP panel.

**Relevant Context:**
- Config file: `.bob/mcp.json` (workspace scope).
- Schema: `{ "mcpServers": { "<name>": { "command": ..., "args": [...], "env": {...} } } }`.
- Security: env var values are stored in plaintext on disk — user must be warned.
- `configure-mcp` skill Path A for full schema reference.

**Status:** `[ ] pending`

---

## File Tree (Final State)

```
datastage-mcp-server/
├── pyproject.toml
├── .gitignore
└── src/
    └── datastage_mcp/
        ├── __init__.py
        ├── auth.py          ← IamTokenManager
        ├── client.py        ← DataStageClient
        └── server.py        ← FastMCP server + tool registration + main()

.bob/
└── mcp.json                 ← Bob MCP registration
```
