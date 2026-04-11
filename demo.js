import { ClaimGovernor, inferRecallSourceType } from './dist/index.js';

const scenarios = {
  'unsupported-fact': {
    directSourceTypes: defaultDirectSources(),
    recallTelemetry: undefined,
    envelope: {
      claims: [
        {
          text: 'The database schema changed last week.',
          type: 'observed_fact',
          confidence: 'high',
          freshness: 'live',
          sources: [],
        },
      ],
    },
  },
  'fast-recall': {
    directSourceTypes: defaultDirectSources(),
    recallTelemetry: { status: 'fast_recall_timeout' },
    envelope: {
      claims: [
        {
          text: 'The recall layer found the answer.',
          type: 'observed_fact',
          confidence: 'high',
          freshness: 'live',
          sources: [{ type: 'recall_fast', ref: 'memory.fast-recall.turn-42' }],
        },
      ],
    },
  },
  'verified-source': {
    directSourceTypes: defaultDirectSources(),
    recallTelemetry: undefined,
    envelope: {
      claims: [
        {
          text: 'The migration file exists in the repository.',
          type: 'observed_fact',
          confidence: 'high',
          freshness: 'live',
          sources: [{ type: 'repo_file', ref: 'migrations/2026_04_11_add_claims.sql' }],
        },
      ],
    },
  },
  'unverified-research': {
    directSourceTypes: defaultDirectSources(),
    recallTelemetry: undefined,
    envelope: {
      claims: [
        {
          text: 'The latest benchmark proves a durable safety improvement.',
          type: 'observed_fact',
          confidence: 'high',
          freshness: 'live',
          sources: [{ type: 'research_unverified', ref: 'benchmark-draft-april' }],
        },
      ],
    },
  },
  'stale-high': {
    directSourceTypes: defaultDirectSources(),
    recallTelemetry: undefined,
    envelope: {
      claims: [
        {
          text: 'The production fallback path is stable.',
          type: 'observed_fact',
          confidence: 'high',
          freshness: 'stale',
          sources: [{ type: 'runtime_probe', ref: 'telemetry.snapshot.2026-03-01' }],
        },
      ],
    },
  },
  'custom-direct': {
    directSourceTypes: ['user_provided', 'repo_file'],
    recallTelemetry: undefined,
    envelope: {
      claims: [
        {
          text: 'The operator confirmed the rollback window.',
          type: 'observed_fact',
          confidence: 'high',
          freshness: 'live',
          sources: [{ type: 'user_provided', ref: 'operator.note.rollback-window' }],
        },
      ],
    },
  },
};

const inputEnvelope = document.querySelector('#inputEnvelope');
const outputEnvelope = document.querySelector('#outputEnvelope');
const inputError = document.querySelector('#inputError');
const runDemo = document.querySelector('#runDemo');
const formatJson = document.querySelector('#formatJson');
const directSourcesInput = document.querySelector('#directSources');
const recallType = document.querySelector('#recallType');
const noteStatus = document.querySelector('#noteStatus');
const scenarioButtons = document.querySelectorAll('.scenario-button');

let activeScenarioKey = 'unsupported-fact';
let activeRecallTelemetry = scenarios[activeScenarioKey].recallTelemetry;

hydrateScenario(activeScenarioKey);

scenarioButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.scenario;
    if (!key || !(key in scenarios)) return;
    activeScenarioKey = key;
    activeRecallTelemetry = scenarios[key].recallTelemetry;
    scenarioButtons.forEach((item) => item.classList.toggle('active', item === button));
    hydrateScenario(key);
  });
});

runDemo.addEventListener('click', renderOutput);
formatJson.addEventListener('click', () => {
  try {
    const value = JSON.parse(inputEnvelope.value);
    inputEnvelope.value = stringify(value);
    hideError();
  } catch (error) {
    showError(error);
  }
});

directSourcesInput.addEventListener('change', renderOutput);

function hydrateScenario(key) {
  const scenario = scenarios[key];
  directSourcesInput.value = scenario.directSourceTypes.join(',');
  inputEnvelope.value = stringify(scenario.envelope);
  recallType.textContent = inferRecallSourceType(scenario.recallTelemetry);
  renderOutput();
}

function renderOutput() {
  try {
    const parsed = JSON.parse(inputEnvelope.value);
    const governor = new ClaimGovernor({
      directSourceTypes: readDirectSourceTypes(),
    });
    const result = governor.enforce(parsed);
    outputEnvelope.textContent = stringify(result);
    noteStatus.textContent = result.governor_note ?? 'No downgrade note';
    recallType.textContent = inferRecallSourceType(activeRecallTelemetry);
    hideError();
  } catch (error) {
    outputEnvelope.textContent = '';
    noteStatus.textContent = 'Input error';
    showError(error);
  }
}

function readDirectSourceTypes() {
  return directSourcesInput.value
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function defaultDirectSources() {
  return ['repo_file', 'test_result', 'runtime_probe', 'recall_direct', 'research_verified'];
}

function stringify(value) {
  return JSON.stringify(value, null, 2);
}

function showError(error) {
  inputError.hidden = false;
  inputError.textContent = error instanceof Error ? error.message : String(error);
}

function hideError() {
  inputError.hidden = true;
  inputError.textContent = '';
}
