# @niondigital/release-util

Toolkit to create releases and handle deployments

## Installation

Install the package via `npm install @niondigital/release-util`

## Configuration

Create a configuration file `release.config.js` (or `release.config.cjs` in case of an ESM module project) in the root of your project:

```js
/* eslint-disable no-template-curly-in-string */
// import base config

const config = require('./node_modules/@niondigital/release-util/release.config.base.cjs');
/*
// Example: support alternate distribution channels for branches named release/*
config.branches.push({
	name: 'release/*',
	channel: '${name.replace(/^release\\//g, "")}',
	prerelease: '${name.replace(/^release\\//g, "")}'
});
*/

/*
// Example: replace JIRA issues ids with links to JIRA issues
config.plugins = config.plugins.filter(plugin => plugin[0] !== "@semantic-release/release-notes-generator");
config.plugins.push([
	"@semantic-release/release-notes-generator",
	{
		"parserOpts": {
          "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
        },
		"preset": "conventionalcommits",
		"presetConfig": {
			"issuePrefixes": ["TPD-", "OS-"],
			"issueUrlFormat": "https://<fill in jira host here>.atlassian.net/browse/{{prefix}}{{id}}"
		}
	}
]);
 */

// export config
module.exports = config;

```

## Usage

Run CLI command `release-util` to explore its options

## Extend

Create a plugin by creating a plugin package providing a class as it's default export extending class `base/Plugin` in this repo. Provide the name of this plugin package together with all other potential plugins as a comma separated list in process.env.RELEASE_PLUGINS.

[Changelog](./CHANGELOG.md)

## Package development

### Creating a release
- Make changes to branch `develop`, run `npm run build`, commit your changes
- Merge `develop` into `master` or cherry-pick commits to release
- Make sure a Github token has been exported to the shell you execute the next command in via `export GH_TOKEN=xxx`
- Execute `npm run release-util release create` on branch `master`
