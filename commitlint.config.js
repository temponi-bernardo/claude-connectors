/** Tipos e escopos permitidos. Ver docs/WORKFLOW.md. */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'test', 'chore', 'ci', 'build', 'perf', 'revert'],
    ],
    'scope-enum': [
      2,
      'always',
      ['core', 'docs', 'tools', 'ci', 'deps', 'skills', 'release', 'config'],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
