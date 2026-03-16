#!/bin/bash
# Fast rebuild of calendar JS + run WebDriver tests.
# Skips closure-compiler minification for faster dev iteration.
# Usage:
#   ./bin/test-js.sh                          # run all tests
#   ./bin/test-js.sh -Dtest=SomeSpecificTest  # run one test
set -e
cd "$(dirname "$0")/.."

echo "[test-js] Building calendar JS (skipping minification)..."
mvn install -pl calendar -DskipTests -Dmaven.js-minify.skip=true -q --no-transfer-progress

echo "[test-js] Running WebDriver tests..."
mvn test -pl test --no-transfer-progress "$@"
