#!/bin/bash
maindir="$(pwd)"
echo "Working directory $maindir"
oldVersion=$1
newVersion=$2
isFL=$3
echo "isFL $isFL"
if [ "$oldVersion" == "" ] || [ "$newVersion" == "" ] ; then
	echo "Usage: upVer [ oldVersion ] [ newVersion ] [options]"
	echo "Available options: FL."
	exit 1
fi

# Detect OS for sed -i compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS (BSD sed)
  sedi() { sed -i '' "$@"; }
else
  # Linux (GNU sed)
  sedi() { sed -i "$@"; }
fi

function upVer {
  local dir=$1
  
  # Update pom.xml
  if [ -f "$dir/pom.xml" ]; then
    echo "$dir/pom.xml"
    if [ "$isFL" == "FL" ] ; then
      sedi "/version>/,/<\//s/>$oldVersion.*<\//>$newVersion-SNAPSHOT<\//" "$dir/pom.xml"
      grep -n --color=auto $newVersion"-SNAPSHOT" "$dir/pom.xml"
    else
      sedi "/version>/,/<\//s/>$oldVersion.*<\//>$newVersion<\//" "$dir/pom.xml"
      grep -n --color=auto $newVersion "$dir/pom.xml"
    fi
  fi

  # Update files in src/ using a loop for better control and portability
  for name in MANIFEST.MF config.xml lang.xml lang-addon.xml Version.java; do
    find "$dir/src" -name "$name" 2>/dev/null | while read -r f; do
      echo "$f"
      case "$name" in
        MANIFEST.MF)
          sedi "s/$oldVersion.*/$newVersion/g" "$f"
          ;;
        config.xml|lang.xml|lang-addon.xml)
          sedi "/<version/,/\/version>/s/>$oldVersion.*<\//>$newVersion<\//g" "$f"
          # Special case for javascript-module in lang-addon.xml
          if [[ "$name" == "lang-addon.xml" ]]; then
            sedi -E "s/(<javascript-module.*version=\")$oldVersion[^\"]*(\")/\1$newVersion\2/" "$f"
          fi
          ;;
        Version.java)
          sedi "s/UID = \"$oldVersion.*\";/UID = \"$newVersion\";/g" "$f"
          ;;
      esac
      grep -n --color=auto "$newVersion" "$f"
    done
  done
}

upVer "$maindir"
upVer "calendar"
upVer "essentials"
upVer "test"
upVer "zkcalendardemo"
