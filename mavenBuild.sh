#!/bin/bash
# Purpose:
# build Calendars with maven

# Usage:
# see printUsage()

goals='clean package'

# build a maven bundle file
function buildBundle(){
    mvn -B -P $edition ${goals}
}


function printUsage() {
    echo "Usage: $0 [official|freshly]"
}

# Function to print the edition
function printEdition() {
    echo "=== Build $edition ==="
}

# Function to validate and set the edition
function setEdition() {
    local input=$1
    case $input in
        "official"|"freshly")
            edition=$input
            ;;
        "")
            edition="freshly" # Default value
            ;;
        *)
            printUsage
            exit 1
            ;;
    esac
}




function setReleaseVersion(){
    STAMP=$(date +%Y%m%d)
    Build_POM="pom.xml"
    VERSION=`sed -nre 's:^.*<calendar.version>(.*)</calendar.version>.*$:\1:p' ${Build_POM}`
    VERSION=(${VERSION[@]})
    VERSION=${VERSION[0]}
    NEW_VERSION=${VERSION%-SNAPSHOT}

    if [ "freshly" = "$edition" ] ; then
      echo "=== Build $NEW_VERSION.FL.$STAMP ===="
      sed -i "/version>/,/<\//s/>$VERSION.*<\//>$NEW_VERSION.FL.$STAMP<\//" ${Build_POM}
      echo "$1 pom.xml"
      grep -n --color=auto $NEW_VERSION.FL.$STAMP ${Build_POM}

    else
      echo "=== Build $NEW_VERSION ===="
      sed -i "/version>/,/<\//s/>$VERSION.*<\//>$NEW_VERSION<\//" calenars/pom.xml
      echo "$1 pom.xml"
      grep -n --color=auto $NEW_VERSION ${Build_POM}
    fi
}

function resetVersion(){
    ## reset version to original version
    if [ "freshly" = $edition ] ; then
      sed -i "/calendar.version>/,/<\//s/>$NEW_VERSION.FL.$STAMP<\//>$VERSION<\//" pom.xml
    else
      sed -i "/calendar.version>/,/<\//s/>$NEW_VERSION<\//>$VERSION<\//" pom.xml
    fi
}

# Main script execution
set -e # exit immediately if any command within the script exits with a non-zero status
setEdition $1
printEdition
setReleaseVersion
buildBundle

