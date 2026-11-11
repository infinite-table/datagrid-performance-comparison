/**
 * Used by .github/workflows/benchmark.yml: decides which versions of the two
 * grids to measure, and whether there is anything to do.
 *
 * Env:
 *   EVENT_NAME      schedule | workflow_dispatch | repository_dispatch
 *   INFINITE        version of @infinite-table/infinite-react ("" or "latest" = latest on npm)
 *   AG_GRID         version of ag-grid-react + ag-grid-community (same)
 *   GH_TOKEN        to look for an open "benchmark failed" issue
 *
 * Outputs (GITHUB_OUTPUT): run, infinite, ag_grid, newest, branch
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const pkg = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);
const current = {
  infinite: pkg.dependencies['@infinite-table/infinite-react'],
  agGrid: pkg.dependencies['ag-grid-react'],
};

const scheduled = process.env.EVENT_NAME === 'schedule';

async function published(name, version) {
  const res = await fetch(
    `https://registry.npmjs.org/${name.replace('/', '%2f')}/${version}`,
  );
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`npm registry: ${res.status} for ${name}@${version}`);
  }
  return (await res.json()).version;
}

async function resolve(name, wanted) {
  const version = await published(name, wanted || 'latest');
  if (!version) {
    throw new Error(`${name}@${wanted} is not on npm`);
  }
  return version;
}

function output(values) {
  const lines = Object.entries(values).map(([key, value]) => `${key}=${value}`);
  console.log(lines.join('\n'));
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join('\n') + '\n');
  }
}

// numeric, so 10.10.0 is newer than 10.9.0
const compare = (a, b) => a.localeCompare(b, 'en', { numeric: true });

const failureTitle = (infinite, agGrid) =>
  `Benchmark failed: Infinite Table ${infinite}, AG Grid ${agGrid}`;

function hasOpenFailureIssue(title) {
  if (!process.env.GH_TOKEN) {
    return false;
  }
  const titles = execFileSync(
    'gh',
    [
      'issue',
      'list',
      '--state',
      'open',
      '--label',
      'benchmark-failed',
      '--limit',
      '200',
      '--json',
      'title',
      '--jq',
      '.[].title',
    ],
    { encoding: 'utf8' },
  );
  return titles.split('\n').includes(title);
}

const infinite = await resolve(
  '@infinite-table/infinite-react',
  process.env.INFINITE,
);
const agGrid = await resolve('ag-grid-react', process.env.AG_GRID);

let run = true;
let reason = 'asked for';

// the two AG Grid packages are published one after the other
if (!(await published('ag-grid-community', agGrid))) {
  if (!scheduled) {
    throw new Error(`ag-grid-community@${agGrid} is not on npm`);
  }
  run = false;
  reason = `ag-grid-community@${agGrid} is not on npm yet`;
} else if (scheduled) {
  if (infinite === current.infinite && agGrid === current.agGrid) {
    run = false;
    reason = 'no new versions';
  } else if (hasOpenFailureIssue(failureTitle(infinite, agGrid))) {
    run = false;
    reason = 'these versions failed before - close the issue to try again';
  } else {
    reason = 'new versions';
  }
}

// only the newest versions go to results/latest on master; an older pair
// gets its branch and its row in the history table
const newest =
  compare(infinite, current.infinite) >= 0 &&
  compare(agGrid, current.agGrid) >= 0;

console.log(
  `installed: Infinite Table ${current.infinite}, AG Grid ${current.agGrid}\n` +
    `to measure: Infinite Table ${infinite}, AG Grid ${agGrid}\n` +
    `${run ? 'running' : 'not running'}: ${reason}\n`,
);
output({
  run,
  infinite,
  ag_grid: agGrid,
  newest,
  branch: `versions/infinite-${infinite}_ag-grid-${agGrid}`,
});
