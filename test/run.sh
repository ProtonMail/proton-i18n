#!/usr/bin/env bash

set -eo pipefail

EXPECTATION_BROKEN='test/files/broken-expectation';
EXPECTATION_VALID='test/files/valid-expectation';

RESULT_BROKEN="test/output-broken.log";
RESULT_VALID="test/output-valid.log";


# Generate new output for tests
if [ "$1" = 'update' ]; then
  scripts/lint.sh test/js/broken %2> "$EXPECTATION_BROKEN" || true
  scripts/lint.sh test/js/valid %2> "$EXPECTATION_VALID" || true

  I18N_EXTRACT_DIR=. I18N_TEMPLATE_FILE=test/po/template_empty_context.pot node index validate >> "$EXPECTATION_BROKEN" 2>/dev/null || true
  I18N_EXTRACT_DIR=. I18N_TEMPLATE_FILE=test/po/template_invalid_variables.pot node index validate >> "$EXPECTATION_BROKEN" 2>/dev/null || true
  I18N_EXTRACT_DIR=. I18N_TEMPLATE_FILE=test/po/template_ok.pot node index validate >> "$EXPECTATION_VALID" 2>/dev/null || true

  echo "✔ New output for tests available";
fi;

# Run tests
if [ "$1" = 'test' ]; then

  scripts/lint.sh test/js/broken %2> $RESULT_BROKEN || true
  scripts/lint.sh test/js/valid %2> $RESULT_VALID || true

  I18N_EXTRACT_DIR=. I18N_TEMPLATE_FILE=test/po/template_empty_context.pot node index validate >> "$RESULT_BROKEN" 2>/dev/null || true
  I18N_EXTRACT_DIR=. I18N_TEMPLATE_FILE=test/po/template_invalid_variables.pot node index validate >> "$RESULT_BROKEN" 2>/dev/null || true
  I18N_EXTRACT_DIR=. I18N_TEMPLATE_FILE=test/po/template_ok.pot node index validate >> "$RESULT_VALID" 2>/dev/null || true

  hasError=false;
  expectedValid="$(cat "$EXPECTATION_VALID")";
  expectedBroken="$(cat "$EXPECTATION_BROKEN")";

  if [ "$(cat $RESULT_VALID)" != "$expectedValid" ]; then
    hasError=true;
    echo -e " 💥 \e[1m\e[31mwrong output for VALID\e[39m\e[0m"
    echo -e "\e[4m📢 Value (output from config)\e[0m:"
    echo "$(cat $RESULT_VALID)";
    echo
    echo -e "\e[4m🤖 Expected\e[0m:"
    echo "$expectedValid";

    echo
    echo '-----------------[DIFF]-----------------------'
    echo
    diff -rupP "$EXPECTATION_VALID" $RESULT_VALID
  else
    echo -e "\e[32m ✔ lint translations for valid\e[0m";
  fi;

  if [ "$(cat $RESULT_BROKEN)" != "$expectedBroken" ]; then
    hasError=true;
    echo -e " 💥 \e[1m\e[31mwrong output for BROKEN\e[39m\e[0m"
    echo -e "\e[4m📢 Value (output from config)\e[0m:"
    echo "$(cat $RESULT_BROKEN)";
    echo
    echo -e "\e[4m🤖 Expected\e[0m:"
    echo "$expectedBroken";

    echo
    echo '-----------------[DIFF]-----------------------'
    echo
    diff -rupP "$EXPECTATION_BROKEN" $RESULT_BROKEN
  else
    echo -e "\e[32m ✔ lint translations for broken\e[0m";
  fi;

  if $hasError; then
      exit 1;
  fi;
fi;
