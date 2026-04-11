import { ClaimGovernor } from '../src/index.js';

const governor = new ClaimGovernor();

const governed = governor.enforce({
  claims: [
    {
      text: 'The schema migration shipped last week.',
      type: 'observed_fact',
      confidence: 'high',
      freshness: 'live',
      sources: [],
    },
    {
      text: 'Review the migration before the next deploy.',
      type: 'recommendation',
      confidence: 'high',
      freshness: 'live',
      sources: [{ type: 'repo_file', ref: 'migrations/schema.sql' }],
    },
  ],
});

console.dir(governed, { depth: null });
