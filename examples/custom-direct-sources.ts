import { ClaimGovernor } from '../src/index.js';

const governor = new ClaimGovernor({
  directSourceTypes: ['user_provided', 'repo_file'],
});

const governed = governor.enforce({
  claims: [
    {
      text: 'The operator confirmed the rollback window.',
      type: 'observed_fact',
      confidence: 'high',
      freshness: 'live',
      sources: [{ type: 'user_provided', ref: 'on-call-runbook-note' }],
    },
  ],
});

console.dir(governed, { depth: null });
