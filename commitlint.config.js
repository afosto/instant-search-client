// Checked in CI against the PR title, which is the branch name and becomes the squash commit on master.
const TYPES = ['Feature', 'Fix', 'Chore', 'Refactor', 'Docs', 'Test', 'CI'];

export default {
  parserPreset: {
    parserOpts: {
      headerPattern: /^([^/]*)\/(.*)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'subject-kebab-case': ({ subject }) => [
          !subject || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(subject),
          'subject must be lowercase kebab-case, for example Fix/keep-query-session',
        ],
      },
    },
  ],
  rules: {
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', TYPES],
    'subject-empty': [2, 'never'],
    'subject-kebab-case': [2, 'always'],
    'header-max-length': [2, 'always', 100],
  },
};
