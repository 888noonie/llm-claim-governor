import { describe, expect, it } from 'vitest';

import { ClaimGovernor, governClaimEnvelope, inferRecallSourceType } from '../src/index.js';

describe('claim governor', () => {
  it('downgrades observed facts without sources to insufficient hypothesis', () => {
    const envelope = governClaimEnvelope({
      claims: [
        {
          text: 'The repo definitely contains a file I did not read.',
          type: 'observed_fact',
          sources: [],
          confidence: 'high',
          freshness: 'live',
        },
      ],
    });

    expect(envelope.claims[0].type).toBe('hypothesis');
    expect(envelope.claims[0].confidence).toBe('insufficient');
    expect(envelope.governor_note).toContain('Observed fact without source');
  });

  it('prevents fast recall only claims from remaining high confidence', () => {
    const envelope = governClaimEnvelope({
      claims: [
        {
          text: 'Fast recall found the answer.',
          type: 'observed_fact',
          sources: [{ type: 'recall_fast', ref: 'memory.recall.fast' }],
          confidence: 'high',
          freshness: 'live',
        },
      ],
    });

    expect(envelope.claims[0].confidence).toBe('medium');
    expect(envelope.governor_note).toContain('fast-recall claim downgraded');
  });

  it('marks unverified research as provisional', () => {
    const envelope = governClaimEnvelope({
      claims: [
        {
          text: 'The research export confirms a phase transition.',
          type: 'observed_fact',
          sources: [{ type: 'research_unverified', ref: 'research-export-1' }],
          confidence: 'high',
          freshness: 'live',
        },
      ],
    });

    expect(envelope.claims[0].type).toBe('hypothesis');
    expect(envelope.claims[0].confidence).toBe('low');
    expect(envelope.claims[0].freshness).toBe('cached');
  });

  it('distinguishes recall_fast from recall_direct', () => {
    expect(inferRecallSourceType({ status: 'fast_recall_timeout' })).toBe('recall_fast');
    expect(inferRecallSourceType(undefined)).toBe('recall_direct');
  });

  it('allows custom direct source policy through the class wrapper', () => {
    const governor = new ClaimGovernor({ directSourceTypes: ['user_provided'] });
    const envelope = governor.enforce({
      claims: [
        {
          text: 'The user manually confirmed the deployment window.',
          type: 'observed_fact',
          sources: [{ type: 'user_provided', ref: 'operator-note' }],
          confidence: 'high',
          freshness: 'live',
        },
      ],
    });

    expect(envelope.claims[0].type).toBe('observed_fact');
    expect(envelope.claims[0].confidence).toBe('high');
  });
});
