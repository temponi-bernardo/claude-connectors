/** Allowed types and scopes. See docs/WORKFLOW.md. */
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
      [
        'core',
        'mcp',
        'canvas',
        'bundle',
        'docs',
        'tools',
        'ci',
        'deps',
        'skills',
        'release',
        'config',
        'remote',
        'site',
        'gmail',
        'whatsapp',
      ],
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
