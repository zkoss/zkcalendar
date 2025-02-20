# Development Note
Those who tends to develop this component should read and maintain this doc.

# Build and publish to CE repository
## Jenkins build job
[ZKCalendarRelease](https://jenkins3.pxinternal.com/job/ZKCalendarRelease/)

## Local build
run `mavenBuild.sh`

## publish to Maven repository
run [PBFUM](http://jenkins2/jenkins2/view/All/job/PBFUM/)


# LESS
after modifying any .less file, run maven `compile` to compile it to .dsp


# The process of release a freshly version
1. Run [Build Job](#jenkins-build-job)


# The process of release an official version
1. update `/zkdoc/release-note` from https://tracker.zkoss.org/projects/ZKCAL?selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page&status=released-unreleased -> click specific version -> Release Notes
2. change to official version (without `-SNAPSHOT`) with `bin/upVer.sh {version}-SNAPSHOT {version}` (modify {version} to the released version)
3. commit the above changes and set version **tag** with git
5. Run [Build Job](#jenkins-build-job) with official version