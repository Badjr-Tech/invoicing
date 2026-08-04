#!/bin/bash
# Re-theme the inner dashboard pages onto the AGENCY tokens.
#
# The original screens were built with stock Tailwind greys, blues and greens.
# They all use the same handful of patterns, so this maps them mechanically
# rather than rewriting forty files by hand.
#
# Deliberately NOT remapped:
#   - red-*   destructive actions should stay red; it is the one place a
#             warm palette must not soften the signal
#   - bg-white  cards are white on clay, which is already correct
#
# Order matters: longer, more specific classes are replaced before the short
# ones they contain (hover:bg-blue-700 before bg-blue-600).

set -euo pipefail
cd "$(dirname "$0")/.."

FILES=$(grep -rl -E "text-gray-|bg-blue-|bg-green-|border-gray-|bg-gray-|rounded-lg|shadow-md" src/app --include=*.tsx || true)

if [ -z "$FILES" ]; then
  echo "Nothing to re-theme."
  exit 0
fi

COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
echo "Re-theming $COUNT files..."

echo "$FILES" | while read -r f; do
  [ -f "$f" ] || continue
  sed -i '' \
    -e 's/hover:bg-blue-700/hover:bg-ember-500/g' \
    -e 's/hover:bg-blue-600/hover:bg-ember-500/g' \
    -e 's/focus:ring-blue-500/focus:ring-sage-300/g' \
    -e 's/focus:border-blue-500/focus:border-sage-400/g' \
    -e 's/bg-blue-600/bg-ember-600/g' \
    -e 's/bg-blue-500/bg-ember-500/g' \
    -e 's/bg-blue-50/bg-sage-50/g' \
    -e 's/text-blue-600/text-sage-700/g' \
    -e 's/text-blue-500/text-sage-600/g' \
    -e 's/hover:bg-green-700/hover:bg-sage-700/g' \
    -e 's/focus:ring-green-500/focus:ring-sage-300/g' \
    -e 's/bg-green-600/bg-sage-600/g' \
    -e 's/bg-green-100/bg-sage-100/g' \
    -e 's/bg-green-50/bg-sage-50/g' \
    -e 's/text-green-800/text-sage-800/g' \
    -e 's/text-green-700/text-sage-700/g' \
    -e 's/text-green-600/text-sage-700/g' \
    -e 's/text-gray-900/text-clay-900/g' \
    -e 's/text-gray-800/text-clay-800/g' \
    -e 's/text-gray-700/text-clay-700/g' \
    -e 's/text-gray-600/text-clay-600/g' \
    -e 's/text-gray-500/text-clay-500/g' \
    -e 's/text-gray-400/text-clay-400/g' \
    -e 's/border-gray-300/border-clay-200/g' \
    -e 's/border-gray-200/border-clay-200/g' \
    -e 's/border-gray-100/border-clay-100/g' \
    -e 's/bg-gray-100/bg-clay-100/g' \
    -e 's/bg-gray-50/bg-clay-50/g' \
    -e 's/hover:bg-gray-100/hover:bg-clay-100/g' \
    -e 's/hover:bg-gray-50/hover:bg-clay-50/g' \
    -e 's/divide-gray-200/divide-clay-200/g' \
    -e 's/rounded-lg/rounded-card/g' \
    -e 's/rounded-md/rounded-control/g' \
    -e 's/shadow-md/shadow-card/g' \
    -e 's/text-4xl font-bold/font-display text-3xl font-semibold/g' \
    -e 's/text-3xl font-bold/font-display text-2xl font-semibold/g' \
    -e 's/text-2xl font-bold/font-display text-xl font-semibold/g' \
    "$f"
done

echo "Done."
