# Development Note
Those who tends to develop this component should read and maintain this doc.

# Build and publish to CE repository
## Jenkins build job
[ZKCalendarRelease](http://jenkins3/job/ZK%20Calendar%20Release/)

## Local build
run `mavenBuild.sh`

## publish to Maven repository
run [PBFUM](http://jenkins2/jenkins2/view/All/job/PBFUM/)


# LESS
after modifying any .less file, run maven `compile` to compile it to .dsp


# [Unit test project](../test)
* In development time, to do a manual test. Run this project with [JetBrain Jetty Server plugin](https://www.jetbrains.com/help/idea/2021.3/run-debug-configuration-jetty.html), 
so no need to install calendar component jar into the local repository for every change.
* Please write unit test cases under the project's `src/test/java`, a method with `@Test`, when you find a bug and put the test case according to feature related.
For example, if the bug is related to render items in a default mold, please put it in `RenderCalendarItemTest.java`.
* put tracker ID in a comment for a unit test. 
so we can look for bug in the future.
* write clear component specification that unit test aims to test
* we run multiple test cases on one zul because `connect()` is time-consuming. Avoid connecting a zul in each test case can reduce testing time to 10%.
So it reuses web driver on purpose.


# The process of release a freshly version
1. Run [Build Job](#jenkins-build-job)


# The process of release an official version
1. update `/zkdoc/release-note` from https://tracker.zkoss.org/projects/ZKCAL?selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page&status=released-unreleased -> click specific version -> Release Notes
2. change to official version (without `-SNAPSHOT`) with `bin/upVer.sh {version}-SNAPSHOT {version}` (modify {version} to the released version)
3. commit the above changes and set version **tag** with git
5. Run [Build Job](#jenkins-build-job) with official version