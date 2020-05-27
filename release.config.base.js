module.exports = {
	noCi: true,
	branches: ['+([0-9])?(.{+([0-9]),x}).x', 'master'],
	assets: [],
	npmPublish: false,
	linkReferences: false,
	pkgRoot: './',
	changelogFile: './CHANGELOG.md',
	prepare: [
		'@semantic-release/changelog',
		'@semantic-release/npm',
		{
			path: '@semantic-release/git',
			assets: ['./package.json', './package-lock.json', './CHANGELOG.md'],
			message: 'build: release ${nextRelease.version}\n\n${nextRelease.notes}'
		}
	],
	verifyConditions: ['@semantic-release/changelog', '@semantic-release/git', '@semantic-release/github'],
	success: ['@semantic-release/github', 'semantic-release-slack-bot'],
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
		],
		'@semantic-release/github',
		[
			'semantic-release-slack-bot',
			{
				notifyOnSuccess: true,
				notifyOnFail: true,
				markdownReleaseNotes: true
			}
		]
	]
};
