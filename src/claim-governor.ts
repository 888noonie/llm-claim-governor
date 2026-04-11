import type { ClaimEnvelope, ClaimGovernorOptions, ClaimSource, ClaimSourceType } from './types.js';

const DEFAULT_DIRECT_SOURCE_TYPES: ClaimSourceType[] = [
  'repo_file',
  'test_result',
  'runtime_probe',
  'recall_direct',
  'research_verified',
];

function isValidSource(source: ClaimSource | null | undefined): source is ClaimSource {
  return Boolean(
    source &&
      typeof source.type === 'string' &&
      typeof source.ref === 'string' &&
      source.ref.trim().length > 0,
  );
}

function getDirectSourceTypes(options?: ClaimGovernorOptions): Set<ClaimSourceType> {
  return new Set(options?.directSourceTypes ?? DEFAULT_DIRECT_SOURCE_TYPES);
}

export function inferRecallSourceType(recallTelemetry?: Record<string, unknown>): 'recall_fast' | 'recall_direct' {
  const status = typeof recallTelemetry?.status === 'string' ? recallTelemetry.status : '';
  return status.startsWith('fast_recall') || Object.keys(recallTelemetry ?? {}).length > 0
    ? 'recall_fast'
    : 'recall_direct';
}

export function governClaimEnvelope(
  envelope: ClaimEnvelope,
  options?: ClaimGovernorOptions,
): ClaimEnvelope {
  const directSourceTypes = getDirectSourceTypes(options);
  const notes = new Set<string>();

  const claims = envelope.claims.map((claim) => {
    const sources = Array.isArray(claim.sources) ? claim.sources.filter(isValidSource) : [];
    let type = claim.type;
    let confidence = claim.confidence;
    let freshness = claim.freshness;

    const hasDirectSource = sources.some((source) => directSourceTypes.has(source.type));
    const onlyUnverifiedResearch =
      sources.length > 0 && sources.every((source) => source.type === 'research_unverified');
    const includesFastRecall = sources.some((source) => source.type === 'recall_fast');

    if (type === 'observed_fact' && sources.length === 0) {
      type = 'hypothesis';
      confidence = 'insufficient';
      notes.add('Observed fact without source was downgraded to hypothesis.');
    }

    if (confidence === 'high' && includesFastRecall) {
      confidence = 'medium';
      notes.add('High-confidence fast-recall claim downgraded to medium.');
    }

    if (confidence === 'high' && !hasDirectSource) {
      confidence = 'medium';
      notes.add('High-confidence claim without direct source downgraded to medium.');
    }

    if (onlyUnverifiedResearch) {
      if (type !== 'recommendation') {
        type = 'hypothesis';
      }
      if (confidence !== 'insufficient') {
        confidence = 'low';
      }
      if (freshness === 'live') {
        freshness = 'cached';
      }
      notes.add('Unverified research claim marked provisional.');
    }

    if (freshness === 'stale' && confidence === 'high') {
      confidence = 'medium';
      notes.add('Stale high-confidence claim downgraded to medium.');
    }

    return {
      ...claim,
      type,
      confidence,
      freshness,
      sources,
    };
  });

  return notes.size > 0
    ? {
        claims,
        governor_note: Array.from(notes).join(' '),
      }
    : { claims };
}

export class ClaimGovernor {
  constructor(private readonly options: ClaimGovernorOptions = {}) {}

  govern(envelope: ClaimEnvelope): ClaimEnvelope {
    return governClaimEnvelope(envelope, this.options);
  }

  enforce(envelope: ClaimEnvelope): ClaimEnvelope {
    return this.govern(envelope);
  }
}
