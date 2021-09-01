#!/bin/bash

set -eo pipefail

echo 'test1.sh';

FOO=foo
export BAR=bar

echo FOO: $FOO
echo BAR: $BAR

SCRIPT_ROOT=$(dirname $0)

./test2.sh
# . ./test2.sh
# source ./test2.sh
