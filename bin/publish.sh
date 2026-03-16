#!/bin/bash
# Trigger Jenkins ZKCalendarRelease job
# Usage: publish.sh [edition]
# edition: freshly (default) or official

EDITION="${1:-freshly}"

if [[ "$EDITION" != "freshly" && "$EDITION" != "official" ]]; then
  echo "Error: edition must be 'freshly' or 'official'" >&2
  exit 1
fi

JENKINS_URL="https://jenkins3.pxinternal.com"
JOB_PATH="view/zk%20calendar/job/ZKCalendarRelease"

# Load Jenkins credentials from .env or environment
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck source=/dev/null
  source "$ENV_FILE"
fi

JENKINS_USER="${JENKINS_USER:?'JENKINS_USER not set'}"
JENKINS_TOKEN="${JENKINS_TOKEN:?'JENKINS_TOKEN not set'}"

# Obtain fresh Cloudflare Access token
CF_TOKEN=$(cloudflared access token --app=https://jenkins3.pxinternal.com)

curl -X POST "${JENKINS_URL}/${JOB_PATH}/buildWithParameters" \
  -b "CF_Authorization=${CF_TOKEN}" \
  --user "${JENKINS_USER}:${JENKINS_TOKEN}" \
  --data-urlencode "edition=${EDITION}" \
  -v
