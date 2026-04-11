# Business Plan

## Position

`llm-claim-governor` should start as a narrow developer tool, not as a broad AI
governance platform.

The first business goal is simple:

- ship a package developers can adopt in minutes
- use that package to generate trust, demos, and conversations
- convert the first revenue through services and team features before trying to
  build a full SaaS layer

## Current Market Signal

The JavaScript AI ecosystem is active enough to support a narrow infrastructure
tool if the positioning is sharp.

- Vercel's `ai` package page shows a large TypeScript AI-builder audience, with
  more than 2.2 million weekly downloads and 1,500+ dependents in the snapshot
  available now.
- LangChain.js shows roughly 925,000 weekly downloads and 800+ dependents in the
  current npm snapshot.
- Promptfoo shows a meaningful adjacent category for reliability and eval
  tooling, with current npm activity in the tens of thousands of weekly
  downloads.

Those signals do not prove demand for this exact package. They do support the
key inference: there is already a large developer market building TypeScript AI
systems, and they already buy or adopt reliability tooling.

At the same time, there is real competition around "guardrails":

- Guardrails AI already ships `provenance_llm`, but it is positioned around RAG
  validation and Python-first workflows.

That leaves room for a smaller wedge:

- TypeScript-first
- output-envelope focused
- lightweight and portable
- easy to drop into existing agent pipelines

## Product Ladder

### Stage 1: Open-source wedge

Offer:

- npm package
- simple docs
- Vercel demo
- examples for raw SDK use and framework use

Goal:

- remove friction to first adoption
- create something developers can star, install, and test today

### Stage 2: Paid implementation work

Offer:

- integration package for teams already building agents
- help mapping their outputs into governed claim envelopes
- policy tuning for what counts as direct evidence
- support integrating with logging, evals, and release gates

Why this matters:

- fastest route to cash
- no need to wait for SaaS maturity
- gives you real language from buyers instead of guesswork

### Stage 3: Team product

Offer:

- hosted claim logs
- drift and downgrade trend dashboards
- exportable audit trail
- CI or PR checks for unsupported high-confidence claims

This is the first real SaaS layer. Do not start here.

## Ideal Customer Profile

Start with one buyer, not five.

Best initial ICP:

- small AI product teams
- consultancy engineers building internal copilots or agent workflows
- TypeScript-heavy stacks using Vercel AI SDK, LangChain.js, custom fetch
  wrappers, or MCP tools

Their pain:

- their agents sound more certain than the evidence warrants
- they need a cleaner trust layer without adopting a huge framework
- they need something they can explain to a lead engineer quickly

Do not start with:

- regulated enterprise compliance departments
- general consumers
- teams demanding a complete safety platform on day one

## Messaging

Lead message:

"Govern the confidence of your LLM claims before they reach users."

Support messages:

- "Observed facts should not survive without evidence."
- "Typed provenance for agent outputs."
- "A small TypeScript layer for confidence downgrades and source policy."

Do not lead with:

- topology
- constitutional architecture
- full Constimetry worldview
- vague "AI safety platform" language

## Pricing Strategy

### First 90 days

Open-source package:

- free

Implementation and advisory:

- fixed-price integration sprint
- example starting band: GBP 1,500 to GBP 5,000 depending on scope

Why:

- far easier to sell than unfinished SaaS
- gives you case-study material and sharper product requirements

### After first users

Hosted team tier:

- entry team plan around GBP 29 to GBP 99 per month
- usage or seat expansion later

Only charge SaaS once you can show:

- persistent audit value
- team workflows
- repeated usage beyond installation

## Distribution Strategy

Priority order:

1. npm package
2. GitHub repo with strong README and working demo
3. short technical posts showing before/after claim governance
4. direct outreach to agencies and builders shipping AI features
5. examples for Vercel AI SDK and LangChain.js

The repo should do three jobs:

- prove the concept
- convert curiosity into install
- make consulting outreach credible

## 90-Day Plan

### Days 1-14

- publish package
- deploy Vercel demo
- add one Vercel AI SDK example
- add one LangChain.js example
- write one launch post and one technical thread

### Days 15-45

- talk to 10-20 builders
- offer integration help
- capture objections and missing features
- add issue templates and roadmap based on real use

### Days 46-90

- package the best repeated integration pattern
- add claim log export and basic reporting shape
- decide whether demand is stronger for consultancy, CI checks, or hosted audit

## Success Metrics

Early metrics:

- npm installs
- GitHub stars
- demo visits
- inbound conversations
- number of teams that try the package in a real pipeline

Business metrics:

- first paid integration
- first repeat customer
- time from repo visit to install
- time from first install to first governed claim in production

## Risks

- getting trapped in abstract positioning instead of narrow utility
- trying to build hosted infrastructure before real usage patterns exist
- drifting back toward the full Constimetry narrative too early
- shipping copy that claims more than the library actually does

## Strategic Rule

Constimetry remains the lab.

`llm-claim-governor` is the product wedge.

If a feature makes the package harder to adopt, explain, or integrate, it
probably belongs in the lab for now.

## Sources

- Vercel project configuration docs: https://vercel.com/docs/projects/project-configuration
- Vercel build configuration docs: https://vercel.com/docs/deployments/configure-a-build
- Vercel AI SDK npm package: https://www.npmjs.com/package/ai
- LangChain.js npm package: https://www.npmjs.com/package/langchain
- Promptfoo npm package: https://www.npmjs.com/package/promptfoo
- Guardrails AI provenance validator: https://github.com/guardrails-ai/provenance_llm
