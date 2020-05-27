module.exports = {
	root: true,
	env: {
		node: true
	},

	plugins: ['@typescript-eslint', 'no-new-instance'],

	extends: [
		'plugin:@typescript-eslint/recommended',
		'eslint-config-prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended'
	],

	rules: {
		'class-methods-use-this': 0,
		'no-console': 0,
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		indent: 'off',
		'max-len': 0,
		'no-tabs': 0,
		'import/prefer-default-export': 0,
		'spaced-comment': [
			'error',
			'always',
			{
				markers: ['/']
			}
		],
		'comma-dangle': 0,
		'no-plusplus': 0,
		'prefer-destructuring': 0,
		'consistent-return': 0,
		'no-undefined': 0,
		'@typescript-eslint/indent': ['error', 'tab'],
		camelcase: 'off',
		'@typescript-eslint/camelcase': [
			'error',
			{
				properties: 'always',
				allow: ['^(S|M)[0-9]+_']
			}
		],
		'@typescript-eslint/explicit-member-accessibility': 2,
		'@typescript-eslint/explicit-function-return-type': 2,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-inferrable-types': 0,
		'no-unused-vars': 0,
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'after-used'
			}
		],
		'@typescript-eslint/interface-name-prefix': 'off',
		semi: 0,
		'@typescript-eslint/semi': ['error'],
		'no-new-instance/no-new-instance': ['error', ['Event']]
	},

	overrides: [
		{
			files: ['**/*.json'],
			rules: {
				'@typescript-eslint/semi': 0,
			}
		}
	],

	parser: '@typescript-eslint/parser',

	settings: {
		'import/resolver': {
			node: {}
		}
	}
};
