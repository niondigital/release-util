/* eslint-disable no-template-curly-in-string */
const config = {
	noCi: true,
	branches: [
		{name: 'master'},
		{name: 'main'},
		{name: '+([0-9])?(.{+([0-9]),x}).x'},
		{
			name: 'release/*',
			channel: '${name.replace(/^release\\//g, "")}',
			prerelease: '${name.replace(/^release\\//g, "")}'
		}
	],
	assets: [],
	npmPublish: false,
	linkReferences: false,
	pkgRoot: './',
	changelogFile: './CHANGELOG.md',
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'angular',
				releaseRules: [
					{
						type: 'chore',
						release: 'patch'
					},
					{
						type: 'docs',
						release: 'patch'
					},
					{
						type: 'refactor',
						release: 'patch'
					},
					{
						type: 'style',
						release: 'patch'
					},
					{
						type: 'revert',
						release: 'patch'
					}
				]
			}
		],
		[
			"@semantic-release/release-notes-generator",
			{
				"preset": "conventionalcommits",
				"parserOpts": {
					"noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
				},
			}
		],
		'@semantic-release/npm',
		'@semantic-release/changelog',
		[
			'@semantic-release/git',
			{
				assets: ['./package.json', './package-lock.json', './CHANGELOG.md', '.docker/docker-compose.deploy.yml', 'reports/*'],
				message: 'build: release ${nextRelease.version}\n\n${nextRelease.notes}'
			}
		]
	]
};

if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
	config.plugins.push('@semantic-release/github');
}

if (process.env.GL_TOKEN) {
	config.plugins.push('@semantic-release/gitlab');
}

if (process.env.SLACK_WEBHOOK) {
	config.plugins.push([
		'semantic-release-slack-bot',
		{
			notifyOnSuccess: true,
			notifyOnFail: true,
			markdownReleaseNotes: true
		}
	]);
}

module.exports = config;
/* eslint-enable no-template-curly-in-string */
