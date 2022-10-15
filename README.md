# @niondigital/release-util

Toolkit to create releases and handle deployments

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