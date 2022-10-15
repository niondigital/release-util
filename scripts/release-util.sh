#!/usr/bin/env bash

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")

/usr/bin/env node --es-module-specifier-resolution=node --no-warnings ${SCRIPTPATH}/../dist/release-util.js "$@"