/**
 * Used by .github/workflows/benchmark.yml: decides which versions of the
 * grids to measure, and whether there is anything to do.
 *
 * A scheduled run looks for a new version of any of the four grids.
 *
 * Env:
 *   EVENT_NAME      schedule | workflow_dispatch | repository_dispatch
 *   INFINITE        version of @infinite-table/infinite-react ("" or "latest" = latest on npm)
 *   AG_GRID         version of ag-grid-react + ag-grid-community (same)
 *   MUI             version of @mui/x-data-grid (same)
 *   TANSTACK        version of @tanstack/react-table (same)
 *   GH_TOKEN        to look for an open "benchmark failed" issue
 *
 * Outputs (GITHUB_OUTPUT): run, infinite, ag_grid, mui, tanstack, newest,
 * branch, title
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const pkg = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);
const current = {
  infinite: pkg.dependencies['@infinite-table/infinite-react'],
  agGrid: pkg.dependencies['ag-grid-react'],
  mui: pkg.dependencies['@mui/x-data-grid'],
  tanstack: pkg.dependencies['@tanstack/react-table'],
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

// what a run is called: in its commit message and in its "failed" issue
const describe = (v) =>
  `Infinite Table ${v.infinite}, MUI X Data Grid ${v.mui}, AG Grid ${v.agGrid}, TanStack Table ${v.tanstack}`;
const failureTitle = (versions) => `Benchmark failed: ${describe(versions)}`;

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
const mui = await resolve('@mui/x-data-grid', process.env.MUI);
const tanstack = await resolve('@tanstack/react-table', process.env.TANSTACK);
const versions = { infinite, agGrid, mui, tanstack };
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
  if (
    infinite === current.infinite &&
    mui === current.mui &&
    agGrid === current.agGrid &&
    tanstack === current.tanstack
  ) {
    run = false;
    reason = 'no new versions';
  } else if (hasOpenFailureIssue(failureTitle(versions))) {
    run = false;
    reason = 'these versions failed before - close the issue to try again';
  } else {
    reason = 'new versions';
  }
}

// only the newest versions go to results/latest on master; older ones get
// their branch and their rows in the history table
const newest =
  compare(infinite, current.infinite) >= 0 &&
  compare(agGrid, current.agGrid) >= 0 &&
  compare(mui, current.mui) >= 0 &&
  compare(tanstack, current.tanstack) >= 0;

console.log(
  `installed: ${describe(current)}\n` +
    `to measure: ${describe(versions)}\n` +
    `${run ? 'running' : 'not running'}: ${reason}\n`,
);
output({
  run,
  infinite,
  ag_grid: agGrid,
  mui,
  tanstack,
  newest,
  // the same name as versionBranch() in scripts/update-results.ts
  branch: `versions/infinite-${infinite}_mui-${mui}_ag-grid-${agGrid}_tanstack-${tanstack}`,
  title: describe(versions),
});
