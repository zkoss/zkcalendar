#!/bin/bash

# Variables
RELEASE_VAULT="/media/potix/rd"
PROJECT_RELEASE_PATH="/calendar/releases"
VERSION=$1


function checkDirectory() {
    local targetDir=$RELEASE_VAULT$PROJECT_RELEASE_PATH/$VERSION/maven
    if [ ! -d "$targetDir" ]; then
        createDirectory "$targetDir"
    fi
}


function createDirectory() {
    local targetDir=$1
    echo "Creating directory: $targetDir"
    mkdir -p "$targetDir"
}


function copyBundleJar() {
    local sourceFile="calendar/target/calendar-$VERSION-bundle.jar"
    local targetDir=$RELEASE_VAULT$PROJECT_RELEASE_PATH/$VERSION/maven

    if [ -f "$sourceFile" ]; then
        echo "Copying $sourceFile to $targetDir"
        cp "$sourceFile" "$targetDir"
    else
        echo "Error: Source file $sourceFile does not exist."
        exit 1
    fi
}

checkDirectory
copyBundleJar
