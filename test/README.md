# Unit test project

# How to run
In development time, to do a manual test. Run `test.server.JettyStarter`
1. In `calendar` project, run `mvn compile` to produce dsp
2. Run `test.server.JettyStarter`

# Development phase
* 
* 
# Unit Test
* Please write unit test cases under the project's `src/test/java`, a method with `@Test`, when you find a bug and put the test case according to related feature.
  For example, if the bug is related to render items in a default mold, please put it in `RenderCalendarItemTest.java`.
* put tracker ID in a comment for a unit test. so we can search for bugs in the future.
* write clear component specification that unit test aims to test
* we run multiple test cases on one zul because `connect()` is time-consuming. Avoid connecting a zul in each test case can reduce testing time to 10%.
  So it reuses web driver on purpose in `test.CalendarTestBase`.