# @madebyheyday/release-util

Toolkit to create releases and handle deployments

## Usage

Run CLI command `release-util` to explore its options

## Extend

Create a plugin by creating a plugin package providing a class as it's default export extending class `base/Plugin` in this repo. Provide the name of this plugin package together with all other potential plugins as a comma separated list in process.env.RELEASE_PLUGINS.

[Changelog](./CHANGELOG.md)
