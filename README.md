<p align="center">
  <img src="./brand/ninfinityn.svg?v=2" alt="N ∞ N logo" width="180" />
</p>

# llm-claim-governor

**Typed provenance and confidence downgrades for LLM claim envelopes.**

Stop surfacing unsupported claims as observed facts.

`llm-claim-governor` is a small TypeScript package that applies governance rules
to structured LLM output. It preserves typed sources, downgrades confidence when
evidence is weak or indirect, and marks unverified research as provisional.

## Why it exists

Most agent stacks can generate claims faster than they can justify them.

This package focuses on the output layer:

- unsupported observed facts are downgraded
- indirect-only evidence cannot stay high confidence
- unverified research is marked provisional
- stale evidence cannot remain at maximum confidence

## Features

- Typed claim envelopes for `observed_fact`, `inferred_conclusion`, `hypothesis`, and `recommendation`
- Built-in source classes such as `repo_file`, `test_result`, `runtime_probe`, `recall_fast`, and `research_unverified`
- Configurable direct-source policy
- Zero runtime dependencies
- Small API surface: `governClaimEnvelope(...)`, `inferRecallSourceType(...)`, and `ClaimGovernor`

## Installation

```bash
npm install llm-claim-governor
```

## Demo

This repo includes a static demo that runs the built package in the browser and is
configured for Vercel deployment.

Local preview:

```bash
npm install
npm run dev:demo
```

Vercel uses [vercel.json](./vercel.json) and builds the deployable demo output into
`site/` with:

```bash
npm run build:demo
```

## Quickstart

```ts
import { ClaimGovernor } from 'llm-claim-governor';

const governor = new ClaimGovernor();

const governed = governor.enforce({
  claims: [
    {
      text: 'The database schema changed last week.',
      type: 'observed_fact',
      confidence: 'high',
      freshness: 'live',
      sources: [],
    },
    {
      text: 'The migration should be reviewed before deployment.',
      type: 'recommendation',
      confidence: 'high',
      freshness: 'live',
      sources: [{ type: 'repo_file', ref: 'migrations/schema.sql' }],
    },
  ],
});

console.dir(governed, { depth: null });
```

Example result:

```json
{
  "claims": [
    {
      "text": "The database schema changed last week.",
      "type": "hypothesis",
      "confidence": "insufficient",
      "freshness": "live",
      "sources": []
    },
    {
      "text": "The migration should be reviewed before deployment.",
      "type": "recommendation",
      "confidence": "high",
      "freshness": "live",
      "sources": [
        {
          "type": "repo_file",
          "ref": "migrations/schema.sql"
        }
      ]
    }
  ],
  "governor_note": "Observed fact without source was downgraded to hypothesis."
}
```

More examples:

- [examples/basic.ts](./examples/basic.ts)
- [examples/custom-direct-sources.ts](./examples/custom-direct-sources.ts)

## API

```ts
import {
  ClaimGovernor,
  governClaimEnvelope,
  inferRecallSourceType,
  type ClaimEnvelope,
  type ClaimGovernorOptions,
} from 'llm-claim-governor';
```

`governClaimEnvelope(envelope, options?)`

- Applies the governance rules directly to a `ClaimEnvelope`

`new ClaimGovernor(options?)`

- Class wrapper over the same rules
- `govern(envelope)` and `enforce(envelope)` are equivalent

`inferRecallSourceType(recallTelemetry?)`

- Returns `recall_fast` when telemetry indicates a fast-recall path
- Returns `recall_direct` otherwise

## Rules Applied

The default governor behavior is:

- `observed_fact` with no sources becomes `hypothesis`
- high-confidence claims backed only by `recall_fast` are downgraded to `medium`
- high-confidence claims without a direct source are downgraded to `medium`
- `research_unverified` claims are marked provisional and reduced to `low`
- stale high-confidence claims are downgraded to `medium`

## Source Policy

The default direct-source set is:

- `repo_file`
- `test_result`
- `runtime_probe`
- `recall_direct`
- `research_verified`

You can extend or replace that list through `ClaimGovernorOptions.directSourceTypes`.

## Development

```bash
npm install
npm test
npm run build
```

Demo build:

```bash
npm run build:demo
```

## CI

GitHub Actions runs test and build on pushes and pull requests via
[.github/workflows/ci.yml](./.github/workflows/ci.yml).

## Strategy

The repo-level product and go-to-market plan lives in
[BUSINESS_PLAN.md](./BUSINESS_PLAN.md).
