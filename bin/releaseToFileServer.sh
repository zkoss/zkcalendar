#!/bin/bash
# send the following file to file server
# maven/calendar-[VERSION]-bundle.jar
# bin/zk-calendar-src-[VERSION].zip
# bin/zk-calendar-bin-[VERSION].zip


RELEASE_VAULT="/media/potix/rd"
PROJECT_RELEASE_PATH="/calendar/releases"


function setVersionFromProperties() {
    if [ -f "version.properties" ]; then
        VERSION=$(grep -oP 'version=\K.*' version.properties)
        if [ -z "$VERSION" ]; then
            echo "Error: Version not found in version.properties."
            exit 1
        fi
    else
        echo "Error: version.properties file does not exist."
        exit 1
    fi
}


# if specified folder doesn't exist, if create it
function checkTargetDirectory() {
    for dir in "$@"; do
        if [ ! -d "$dir" ]; then
            createDirectory "$dir"
        fi
    done
}


function createDirectory() {
    local targetDir=$1
    echo "Creating directory: $targetDir"
    mkdir -p "$targetDir"
}


function copyBundleJar() {
    local sourceFile="calendar/target/calendar-$VERSION-bundle.jar"
    local targetDir=$RELEASE_VAULT$PROJECT_RELEASE_PATH/$VERSION/maven
    copyFile "$sourceFile" "$targetDir"
}



function copyZip() {
    local sourceZip="calendar/target/zk-calendar-src-$VERSION.zip"
    local binaryZip="calendar/target/zk-calendar-bin-$VERSION.zip"
    local targetDir=$RELEASE_VAULT$PROJECT_RELEASE_PATH/$VERSION/bin

    copyFile "$sourceZip" "$targetDir"
    copyFile "$binaryZip" "$targetDir"
}


function copyFile() {
    local sourceFile=$1
    local targetDir=$2

    if [ -f "$sourceFile" ]; then
        echo "Copying $sourceFile to $targetDir"
        cp "$sourceFile" "$targetDir"
    else
        echo "Error: Source file $sourceFile does not exist."
        exit 1
    fi
}


setVersionFromProperties
checkTargetDirectory "$RELEASE_VAULT$PROJECT_RELEASE_PATH/$VERSION/maven" "$RELEASE_VAULT$PROJECT_RELEASE_PATH/$VERSION/bin"
copyBundleJar
copyZip
