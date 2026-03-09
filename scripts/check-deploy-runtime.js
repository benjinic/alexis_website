const fs = require('node:fs');
const path = require('node:path');

const requiredPackages = [
  'import-in-the-middle',
  'require-in-the-middle',
  '@genkit-ai/vertexai',
  'genkit',
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function checkFunctionsDeps(rootDir) {
  const functionsPkgPath = path.join(rootDir, 'functions', 'package.json');
  const functionsPkg = readJson(functionsPkgPath);
  const deps = {
    ...(functionsPkg.dependencies || {}),
    ...(functionsPkg.optionalDependencies || {}),
  };

  const missing = requiredPackages.filter((name) => !deps[name]);
  return {
    ok: missing.length === 0,
    missing,
    filePath: functionsPkgPath,
  };
}

function checkNextConfig(rootDir) {
  const nextConfigPath = path.join(rootDir, 'next.config.ts');
  const source = fs.readFileSync(nextConfigPath, 'utf8');
  const hasTopLevelKey = /\n\s*serverExternalPackages\s*:\s*\[/.test(source);
  const missing = requiredPackages.filter((name) => !source.includes(`'${name}'`) && !source.includes(`"${name}"`));

  return {
    ok: hasTopLevelKey && missing.length === 0,
    missing,
    hasTopLevelKey,
    filePath: nextConfigPath,
  };
}

function main() {
  const rootDir = process.cwd();
  const depCheck = checkFunctionsDeps(rootDir);
  const configCheck = checkNextConfig(rootDir);

  if (depCheck.ok && configCheck.ok) {
    console.log('✅ Deploy runtime check passed');
    console.log(' - functions dependencies are complete');
    console.log(' - next.config.ts serverExternalPackages is configured');
    process.exit(0);
  }

  console.error('❌ Deploy runtime check failed');

  if (!depCheck.ok) {
    console.error(` - Missing in ${depCheck.filePath}: ${depCheck.missing.join(', ')}`);
  }

  if (!configCheck.ok) {
    if (!configCheck.hasTopLevelKey) {
      console.error(` - Missing top-level serverExternalPackages in ${configCheck.filePath}`);
    }
    if (configCheck.missing.length > 0) {
      console.error(` - Missing package names in ${configCheck.filePath}: ${configCheck.missing.join(', ')}`);
    }
  }

  process.exit(1);
}

main();
