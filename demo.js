import { inject, track } from './vendor/vercel-analytics.mjs';
import { ClaimGovernor, inferRecallSourceType } from './dist/index.js';

inject({ mode: 'auto' });

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
const themeButtons = document.querySelectorAll('.theme-button');
const inputFontDown = document.querySelector('#inputFontDown');
const inputFontUp = document.querySelector('#inputFontUp');
const outputFontDown = document.querySelector('#outputFontDown');
const outputFontUp = document.querySelector('#outputFontUp');
const resetInput = document.querySelector('#resetInput');
const copyOutput = document.querySelector('#copyOutput');

let activeScenarioKey = 'unsupported-fact';
let activeRecallTelemetry = scenarios[activeScenarioKey].recallTelemetry;
let inputFontSize = Number(localStorage.getItem('llm-claim-governor-input-font') || 0.88);
let outputFontSize = Number(localStorage.getItem('llm-claim-governor-output-font') || 0.88);

applyTheme(document.documentElement.dataset.themePreference || 'system');
applyFieldFontSizes();
hydrateScenario(activeScenarioKey);

scenarioButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.scenario;
    if (!key || !(key in scenarios)) return;
    activeScenarioKey = key;
    activeRecallTelemetry = scenarios[key].recallTelemetry;
    scenarioButtons.forEach((item) => item.classList.toggle('active', item === button));
    hydrateScenario(key);
    track('Scenario Selected', { scenario: key });
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
inputFontDown.addEventListener('click', () => adjustFontSize('input', -0.04));
inputFontUp.addEventListener('click', () => adjustFontSize('input', 0.04));
outputFontDown.addEventListener('click', () => adjustFontSize('output', -0.04));
outputFontUp.addEventListener('click', () => adjustFontSize('output', 0.04));
resetInput.addEventListener('click', () => {
  hydrateScenario(activeScenarioKey);
  track('Input Reset', { scenario: activeScenarioKey });
});
copyOutput.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(outputEnvelope.textContent || '');
    copyOutput.textContent = 'Copied';
    setTimeout(() => {
      copyOutput.textContent = 'Copy';
    }, 1200);
    track('Output Copied', { scenario: activeScenarioKey });
  } catch {
    copyOutput.textContent = 'Copy failed';
    setTimeout(() => {
      copyOutput.textContent = 'Copy';
    }, 1200);
  }
});
themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.themeChoice;
    if (!choice) return;
    applyTheme(choice);
    track('Theme Changed', { theme: choice });
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((document.documentElement.dataset.themePreference || 'system') === 'system') {
    applyTheme('system');
  }
});

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
    track('Governor Run', {
      scenario: activeScenarioKey,
      downgraded: Boolean(result.governor_note),
      claims: result.claims.length,
    });
  } catch (error) {
    outputEnvelope.textContent = '';
    noteStatus.textContent = 'Input error';
    showError(error);
    track('Governor Error', { scenario: activeScenarioKey });
  }
}

function applyTheme(choice) {
  const resolved = choice === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : choice;
  document.documentElement.dataset.themePreference = choice;
  document.documentElement.dataset.theme = resolved;
  localStorage.setItem('llm-claim-governor-theme', choice);
  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === choice));
  });
}

function adjustFontSize(target, delta) {
  if (target === 'input') {
    inputFontSize = clamp(inputFontSize + delta, 0.72, 1.3);
    localStorage.setItem('llm-claim-governor-input-font', String(inputFontSize));
  } else {
    outputFontSize = clamp(outputFontSize + delta, 0.72, 1.3);
    localStorage.setItem('llm-claim-governor-output-font', String(outputFontSize));
  }
  applyFieldFontSizes();
  track('Font Size Changed', { target, size: target === 'input' ? inputFontSize : outputFontSize });
}

function applyFieldFontSizes() {
  inputEnvelope.style.setProperty('--field-font-size', `${inputFontSize}rem`);
  outputEnvelope.style.setProperty('--field-font-size', `${outputFontSize}rem`);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
