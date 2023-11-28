# Development Note
Those who tends to develop this component should read and maintain this doc.

# Build 
## jenkins job
http://jenkins3/job/ZK%20Calendar%20Release/

## FL
1. use FL version
in parent pom.xml, use FL version pattern 
```xml
		<calendar.main.version>3.1.2</calendar.main.version>
		<revision>${calendar.main.version}.FL.${maven.build.timestamp}</revision>
```
2. run `mvn clean package` to produce a bundle jar
3. upload to the fileserver `/potix/rd/calendar/release/[FL-version]/maven/*-bundle.jar`

# publish to Maven repository
run [PBFUM](http://jenkins2/jenkins2/view/All/job/PBFUM/)

## Parameters
* project: `calendar`
* version: `FL-version`


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
