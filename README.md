# llm-claim-governor

A small TypeScript package that attaches typed provenance to LLM claims and
downgrades confidence when the evidence is weak, stale, or indirect.

Stop surfacing unsupported claims as observed facts.

## What it does

LLM output mixes what a model saw, inferred, and invented. This package works on
the output layer: each claim carries a type, a confidence level, a freshness
value, and typed sources. A fixed policy returns a corrected envelope plus a note
explaining what changed. It is a rule engine over structured data, not a
fact-checker or an agent framework.

## Development status

Dormant since April 2026. The repository has 16 commits, all in April 2026.
Version 0.1.0 is published on npm; npm reported 21 downloads in the previous
month at review time. CI is green, and nothing has landed since April.

## What demonstrably works

- Typed envelopes for `observed_fact`, `inferred_conclusion`, `hypothesis`, and
  `recommendation`, with source classes such as `repo_file`, `test_result`,
  `runtime_probe`, `recall_fast`, `recall_direct`, `research_verified`, and
  `research_unverified`.
- The documented rules: an `observed_fact` with no sources becomes a `hypothesis`
  with `insufficient` confidence; high-confidence claims backed only by
  `recall_fast` or lacking a direct source drop to `medium`; `research_unverified`
  is marked provisional and reduced to `low`; stale high-confidence claims drop
  to `medium`.
- A configurable direct-source list through `ClaimGovernorOptions`.
- Zero runtime dependencies, ESM output, and bundled TypeScript declarations.
- A static browser demo that runs the built package.

`governClaimEnvelope(envelope, options?)` applies the rules directly.
`new ClaimGovernor(options?)` wraps them; `govern()` and `enforce()` are
equivalent. `inferRecallSourceType()` returns `recall_fast` or `recall_direct`.

## Experimental, incomplete, or planned

- Source types and references are trusted as supplied; the package checks shape
  and policy effect, not whether a cited file or test exists.
- Freshness is caller-declared. There is no clock, age calculation, or automatic
  staleness detection, and the rules do not attempt semantic entailment.
- No adapters for agent frameworks, no persistence, logging, or policy editor.
  The demo is a demonstration, not a service.
- Version 0.1.0; the API may change if work resumes.

## Install and use

```bash
npm install llm-claim-governor
```

```ts
import { ClaimGovernor } from 'llm-claim-governor';

const governor = new ClaimGovernor();
const governed = governor.enforce({
  claims: [{
    text: 'The database schema changed last week.',
    type: 'observed_fact',
    confidence: 'high',
    freshness: 'live',
    sources: [],
  }],
});

console.dir(governed, { depth: null });
```

The claim returns as a `hypothesis` with `insufficient` confidence and a note
that an observed fact without a source was downgraded. See
[examples/basic.ts](examples/basic.ts) and
[examples/custom-direct-sources.ts](examples/custom-direct-sources.ts).

## Inspect the demo or build it

Live demo: <https://llm-claim-governor.vercel.app>. Local demo:
`npm install && npm run dev:demo`. Build with `npm run build` (package) or
`npm run build:demo` (demo plus site).

## Tests and build evidence

**Observed:** `npm test` passed 5 of 5 tests in
`test/claim-governor.test.ts`. CI runs `npm ci`, `npm test`, and `npm run build`
on pushes to `main` and pull requests, and is green. Package 0.1.0 is published
to npm, and the demo returned HTTP 200 on 31 October 2026.

**Claimed:** the README's rule descriptions match the test file; no coverage
figure or external audit is claimed. Reproduce with `npm install && npm test`.

## Limitations and dependencies

- The caller must provide honest claim types, source types, and references. A
  confidently mislabelled source defeats the policy, and an `observed_fact` with
  a direct source keeps its type even if that source does not support the claim.
- Freshness and confidence are inputs, not measurements.
- `inferRecallSourceType()` is a coarse heuristic: any non-empty telemetry maps
  to `recall_fast`.
- Node 22 is used in CI; development uses TypeScript 5.9 and Vitest 3.2.
- Published as ESM only. Consumers need an ESM-capable runtime or bundler.
- The demo depends on Vercel Analytics and a static build script.

## Licence

MIT. See [LICENSE](LICENSE).
