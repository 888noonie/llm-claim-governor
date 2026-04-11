export type ClaimType =
  | 'observed_fact'
  | 'inferred_conclusion'
  | 'hypothesis'
  | 'recommendation';

export type KnownClaimSourceType =
  | 'repo_file'
  | 'test_result'
  | 'runtime_probe'
  | 'recall_fast'
  | 'recall_direct'
  | 'research_verified'
  | 'research_unverified'
  | 'user_provided';

export type ClaimSourceType = KnownClaimSourceType | (string & {});

export type ClaimConfidence = 'high' | 'medium' | 'low' | 'insufficient';

export type ClaimFreshness = 'live' | 'recent' | 'cached' | 'stale';

export interface ClaimSource {
  type: ClaimSourceType;
  ref: string;
  metadata?: Record<string, unknown>;
}

export interface ClaimRecord {
  text: string;
  type: ClaimType;
  sources: ClaimSource[];
  confidence: ClaimConfidence;
  freshness: ClaimFreshness;
}

export interface ClaimEnvelope {
  claims: ClaimRecord[];
  governor_note?: string;
}

export interface ClaimGovernorOptions {
  directSourceTypes?: ClaimSourceType[];
}
