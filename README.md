# llm-claim-governor

**Every LLM claim. Receipted. Calibrated. Production-ready.**

Stop shipping hallucinations as “observed facts.”

This lightweight, zero-dependency middleware sits between your LLM call and the rest of your application. It classifies every claim, attaches typed provenance, and automatically downgrades confidence when sources are weak, stale, or missing.

Built for the exact pain every agent builder feels in 2026.

![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-green)
![MIT License](https://img.shields.io/badge/License-MIT-brightgreen)

## Why it exists

LLM agents are getting dangerously good at sounding confident.  
Most teams have zero visibility into *why* the model said what it said.

`llm-claim-governor` fixes that at the output layer — exactly where it matters.

## Features

- Classifies every claim as `observed_fact` | `hypothesis` | `recommendation`
- Attaches rich, typed sources (`repo_file`, `test_result`, `runtime_probe`, `recall_fast`, `research_unverified`, `user_provided`, etc.)
- Hysteresis-based confidence downgrading (real control-systems logic)
- Works with **any** LLM backend: OpenAI, Anthropic, Grok, LangChain, LlamaIndex, raw fetch, MCP tools
- Fully typed, tree-shakable, < 8 KB gzipped
- Battle-tested in production-grade memory & agent stacks

## Installation

```bash
npm install llm-claim-governor
# or
yarn add llm-claim-governor
# or
pnpm add llm-claim-governor
