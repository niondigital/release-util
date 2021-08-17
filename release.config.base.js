/* eslint-disable no-template-curly-in-string */
const config = {
	noCi: true,
	branches: ['+([0-9])?(.{+([0-9]),x}).x', 'master'],
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
			'@semantic-release/release-notes-generator',
			{
				config: '@seibert-io/conventional-changelog-heyday',
				linkReferences: true,
				writerOpts: {
					commitsSort: ['scope', 'subject'],
					commitGroupsSort: 'title'
				}
			}
		],
		'@semantic-release/npm',
		'@semantic-release/changelog',
		[
			'@semantic-release/git',
			{
				assets: ['./package.json', './package-lock.json', './CHANGELOG.md', '.docker/docker-compose.deploy.yml'],
				message: 'build: release ${nextRelease.version}\n\n${nextRelease.notes}'
			}
		]
	]
};

if (process.env.GH_TOKEN) {
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
