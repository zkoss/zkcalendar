# Unit test project

# Category
We categorize test cases into different classes upon features, please check each class under `test.*`. When creating one test case, put it into the related category. For example, if the bug is related to render items in a default mold, please put it in `RenderCalendarItemTest.java`. 

If there is a new feature, create a new test class. 

If a bug is hard to be categorized, create an independent class for it e.g. `Zkcal98`.

# How to run
In development time, to do a manual test. Run `test.server.JettyStarter`
1. In `calendar` project, run `mvn compile` to produce dsp
2. Run `test.server.JettyStarter`

# Development phase

# Unit Test
* put tracker ID in a comment for each unit test. so we can search for bugs in the future.
* write clear component specification that unit test aims to test
* we run multiple test cases on one zul because `connect()` is time-consuming. Avoid connecting a zul in each test case can reduce testing time to 10%.
  So it reuses web driver on purpose in `test.CalendarTestBase`.