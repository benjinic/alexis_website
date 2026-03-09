const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const FORCE_FLAG = '--force-hosting-only';
const DRY_RUN_FLAG = '--dry-run';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectHostingRewrites(firebaseConfig) {
  const hosting = firebaseConfig.hosting;
  const hostingEntries = Array.isArray(hosting) ? hosting : hosting ? [hosting] : [];

  return hostingEntries.flatMap((entry, index) => {
    const rewrites = Array.isArray(entry.rewrites) ? entry.rewrites : [];
    return rewrites.map((rewrite) => ({
      index,
      source: rewrite.source || '(unknown)',
      functionName: rewrite.function,
      run: rewrite.run,
    }));
  });
}

function isFunctionBackedRewrite(rewrite) {
  return Boolean(rewrite.functionName || rewrite.run);
}

function main() {
  const args = process.argv.slice(2);
  const forceHostingOnly = args.includes(FORCE_FLAG);
  const dryRun = args.includes(DRY_RUN_FLAG);
  const rootDir = process.cwd();
  const firebaseConfigPath = path.join(rootDir, 'firebase.json');

  if (!fs.existsSync(firebaseConfigPath)) {
    console.error('❌ Cannot find firebase.json in project root.');
    process.exit(1);
  }

  const firebaseConfig = readJson(firebaseConfigPath);
  const rewrites = collectHostingRewrites(firebaseConfig);
  const functionBackedRewrites = rewrites.filter(isFunctionBackedRewrite);

  if (dryRun) {
    console.log('🧪 Dry run: safety checks only (no firebase deploy will run).');
    if (functionBackedRewrites.length > 0 && !forceHostingOnly) {
      console.error('🛑 deploy:hosting would be blocked for safety.');
      functionBackedRewrites.forEach((rewrite) => {
        const target = rewrite.functionName
          ? `function=${rewrite.functionName}`
          : `run=${JSON.stringify(rewrite.run)}`;
        console.error(` - rewrite source: ${rewrite.source} -> ${target}`);
      });
      console.error('\nUse one of these commands:');
      console.error(' - npm run deploy:prod');
      console.error(' - npm run deploy:hosting:force');
      process.exit(1);
    }

    if (functionBackedRewrites.length > 0 && forceHostingOnly) {
      console.log('⚠️  Dry run in force mode: hosting-only deploy would proceed.');
      process.exit(0);
    }

    console.log('✅ Dry run passed: hosting-only deploy is safe to execute.');
    process.exit(0);
  }

  if (functionBackedRewrites.length > 0 && !forceHostingOnly) {
    console.error('🛑 deploy:hosting blocked for safety.');
    console.error('This project has Hosting rewrites that depend on backend compute (Functions/Run).');
    console.error('Deploying hosting alone can leave frontend/backend versions out of sync.\n');

    functionBackedRewrites.forEach((rewrite) => {
      const target = rewrite.functionName
        ? `function=${rewrite.functionName}`
        : `run=${JSON.stringify(rewrite.run)}`;
      console.error(` - rewrite source: ${rewrite.source} -> ${target}`);
    });

    console.error('\nUse one of these commands instead:');
    console.error(' - npm run deploy:prod           # recommended full deploy');
    console.error(' - npm run deploy:hosting:force  # bypass safety gate intentionally');
    process.exit(1);
  }

  const onlyTarget = 'hosting:app';
  console.log(
    forceHostingOnly
      ? '⚠️  Force mode enabled: continuing with hosting-only deploy.'
      : '✅ Safe to run hosting-only deploy.'
  );

  const result = spawnSync('firebase', ['deploy', '--only', onlyTarget], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (typeof result.status === 'number') {
    process.exit(result.status);
  }

  console.error('❌ Failed to execute firebase deploy command.');
  process.exit(1);
}

main();
