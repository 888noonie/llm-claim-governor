# Trajectory Plan

## Objective

Use this repository as the clean commercial start for the first viable product:
`llm-claim-governor`.

The protected source repo is:
`C:\Users\Oct8p\Constimetry-V10\Constimetry_V2_Core`

That repo remains intact and source-only. We extract from it, but we do not turn
it into the product surface.

## Ground Truth From Context

The context material is aligned on one point:

- The first sellable product is not the full Constimetry system.
- The first product is the standalone Claim Governor layer.
- Constimetry stays the workshop and source of reusable IP.

This is consistent with the code that already exists in the source repo:

- `MEMORY_UI/app/src/lib/claim-governor.ts`
- `MEMORY_UI/app/src/lib/claim-governor.test.ts`
- `MEMORY_UI/app/src/types/index.ts`

Those files show that the commercial wedge is already partially implemented and
tested.

## Strategic Positioning

Product one is:

`llm-claim-governor`

Short description:

"A small TypeScript library that classifies claims, attaches typed provenance,
and downgrades confidence when evidence is weak, stale, or indirect."

Why this goes first:

- It solves a real production problem now.
- It is already small enough to extract.
- It does not require selling the entire Constimetry worldview.
- It gives us a clean, credible public artifact fast.

## What Exists Today

Already reusable:

- Core envelope-governing logic
- Recall source classification helper
- Tests covering downgrade behavior
- Public-facing product language already started in this repo `README.md`

Needs extraction work:

- Remove app-local path alias dependency (`@/types`)
- Split generic types into package-local `src/types.ts`
- Decide whether Akasha-specific chat helpers belong in core or examples
- Add package scaffolding, build, exports, and publish metadata

## Product Scope For v0.1

Keep in scope:

- Claim types
- Source types
- Confidence and freshness levels
- `governClaimEnvelope(...)`
- `inferRecallSourceType(...)`
- Minimal tests
- Clear README with one raw SDK example and one framework-agnostic example

Move out of core for now:

- Akasha-specific `buildChatClaimEnvelope(...)`
- Anything branded around Constimetry, Akasha, Klein bottle, LAW-0, Ophiuchus
- UI concerns
- Hosted logging or dashboard features

Reason:

The first package must be portable, boring, and obviously useful.

## Build Sequence

### Phase 1: Extraction Baseline

Goal: create a minimal standalone TypeScript package in this repo.

Deliverables:

- `package.json`
- `tsconfig.json`
- `src/types.ts`
- `src/claim-governor.ts`
- `src/index.ts`
- `test/claim-governor.test.ts`

Rules:

- Copy logic from the source repo, do not rewrite it blindly
- Strip product-specific references from names and docs
- Keep behavior parity with source tests

### Phase 2: Public Package Hardening

Goal: make the package publishable and credible.

Deliverables:

- Vitest passing locally
- Build output
- README updated to match actual API
- License
- `.npmignore` if needed
- Basic CI for test and build

Quality bar:

- No false claims in README
- No claims of zero dependency or size targets unless measured
- No framework lock-in

### Phase 3: Launch Surface

Goal: create the minimum public presence.

Deliverables:

- npm package publish
- GitHub repo ready
- one-page landing page copy
- short announcement post
- two examples:
  - raw OpenAI-style wrapper
  - generic middleware pipeline example

### Phase 4: Early Revenue Path

Goal: use the package to open the next door, not force SaaS too early.

Possible follow-ons:

- paid implementation help for teams integrating provenance controls
- hosted claim-log and drift-alert service
- CI rule pack for unsafe claim release detection

## Non-Negotiable Constraints

- `Context/` stays gitignored in this repo
- `Constimetry_V2_Core` is not edited as part of this product extraction
- Public messaging must distinguish implemented behavior from future vision
- The first release must avoid overclaiming

## Success Criteria

We are on the right track when:

- this repo contains a standalone package that builds and tests cleanly
- the exported API is smaller and clearer than the source implementation
- README examples run against the real package API
- a stranger can understand the value in under one minute

## Immediate Next Move

Build v0.1 extraction in this repo from these source files:

- `C:\Users\Oct8p\Constimetry-V10\Constimetry_V2_Core\MEMORY_UI\app\src\lib\claim-governor.ts`
- `C:\Users\Oct8p\Constimetry-V10\Constimetry_V2_Core\MEMORY_UI\app\src\lib\claim-governor.test.ts`
- `C:\Users\Oct8p\Constimetry-V10\Constimetry_V2_Core\MEMORY_UI\app\src\types\index.ts`

That is the shortest path from source IP to first viable offering.
