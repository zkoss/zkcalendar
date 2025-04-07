# Development Note
Those who tends to develop this component should read and maintain this doc.

# Build and publish to CE repository
## Jenkins build job
[ZKCalendarRelease](https://jenkins3.pxinternal.com/job/ZKCalendarRelease/)

## Local build
run `mavenBuild.sh`

## publish to Maven repository
run [PBFUM](https://jenkins3.pxinternal.com/job/PBFUM/)


# LESS
after modifying any .less file, run maven `compile` to compile it to .dsp


# The process of release a freshly version
1. Run [Build Job](#jenkins-build-job)


# The process of release an official version
1. update [release-note](..%2Fzkdoc%2Frelease-note). <br> 
https://tracker.zkoss.org/projects/ZKCAL?selectedItem=com.atlassian.jira.jira-projects-plugin%3Arelease-page&status=released-unreleased -> click specific version -> Release Notes
2. Run [Build Job](#jenkins-build-job) with "official" parameter.<br>
[build script](..%2Fbin%2FmavenBuild.sh) will remove `-SNAPSHOT` in the version string.
3. Put binary zip in Github release page.<br> 
* at https://github.com/zkoss/zkcalendar/releases create release from tag.
* upload `zk-calendar-bin-x.y.z.zip` and `zk-calendar-src-x.y.z.zip`
4. update [upgrade note](https://www.zkoss.org/wiki/ZK_Calendar_Essentials/Upgrade_Note)
5. update ZK Calendar Essentials
6. upgrade ZK Calendar Demo

