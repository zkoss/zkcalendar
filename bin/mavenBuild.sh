#!/bin/bash
# Purpose:
# build Calendars with maven

# Usage:
# see printUsage()

goals='clean compile package'

# build a maven bundle file
function buildBundle(){
    mvn -B -P $edition ${goals} "${@:2}"
}


function printUsage() {
    echo "Usage: $0 [official|freshly] [maven-options...]"
    echo "  official  - Build official release version"
    echo "  freshly   - Build FL (freshly) version with date stamp (default)"
    echo ""
    echo "Examples:"
    echo "  $0                      - Build FL version with tests"
    echo "  $0 -DskipTests          - Build FL version without tests"
    echo "  $0 freshly -DskipTests  - Build FL version without tests"
    echo "  $0 official -DskipTests - Build official version without tests"
}


function printEdition() {
    echo "=== Build $edition ==="
}


function setEdition() {
    local input=$1
    case $input in
        "official"|"freshly")
            edition=$input
            ;;
        "")
            edition="freshly" # Default value
            ;;
        -*)
            # If first argument starts with -, treat it as a maven option
            # and use default edition
            edition="freshly"
            ;;
        *)
            printUsage
            exit 1
            ;;
    esac
}


function setReleaseVersion() {
    STAMP=$(date +%Y%m%d)
    BUILD_POM="pom.xml"
    VERSION=`sed -nre 's:^.*<calendar.version>(.*)</calendar.version>.*$:\1:p' ${BUILD_POM}`
    VERSION=(${VERSION[@]})
    VERSION=${VERSION[0]}
    NEW_VERSION=${VERSION%-SNAPSHOT}

    if [ "freshly" = "$edition" ] ; then
        NEW_VERSION="$NEW_VERSION.FL.$STAMP"
        echo "=== Build $NEW_VERSION ===="
        sed -i "s/<calendar.version>$VERSION<\/calendar.version>/<calendar.version>$NEW_VERSION<\/calendar.version>/" ${BUILD_POM}
    else
        echo "=== Build $NEW_VERSION ===="
        sed -i "s/<calendar.version>$VERSION<\/calendar.version>/<calendar.version>$NEW_VERSION<\/calendar.version>/" ${BUILD_POM}
    fi

    echo "$1 pom.xml"
    grep -n --color=auto $NEW_VERSION ${BUILD_POM}
}


function resetVersion(){
    ## reset version to original version
    if [ "freshly" = $edition ] ; then
      sed -i "/calendar.version>/,/<\//s/>$NEW_VERSION.FL.$STAMP<\//>$VERSION<\//" pom.xml
    else
      sed -i "/calendar.version>/,/<\//s/>$NEW_VERSION<\//>$VERSION<\//" pom.xml
    fi
}


function writeVersionProperties() {
    echo "project=calendar" > version.properties
    echo "version=$NEW_VERSION" >> version.properties
    echo "maven=ce" >> version.properties
    echo "Created version.properties with version $NEW_VERSION"
}


set -e # exit immediately if any command within the script exits with a non-zero status
setEdition $1
printEdition
setReleaseVersion
buildBundle "$@"
writeVersionProperties