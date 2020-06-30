All routes start with /api

\* are protected routes

## Users

-   `* [Get] /user` <br/> Get current user data from token

## Course

-   `[GET] /course` <br/> get all course name, tags, avg rating and instructor

-   `?* [GET] /course/:courseID` <br/> Get course content

-   `* [PUT] /course/:courseID` <br />Update last studied

-   `* [Post] /course` <br/> Add course data

-   `* [PATCH] /course/:courseID` <br /> update course

*   `* [DEL] /course/:courseID` <br/> Delete a course
*   `* [PUT] /course/:courseID /enroll` <br/>Enroll current user to course.
    ( add course to user, user to course, new courseProgress object )

*   `* [PUT] /course/review` <br/> Add/update review to course

*   `* [PUT] /course/:courseID/topic` <br /> Add topic to course

*   `* [DEL] /course/:courseID/topic/:topicID` <br/>Delete topic

## Topic

-   `* [GET] /topic/:topicID` <br/>Get topic

-   `* [PUT] /topic/:topicID/completed` Update progress

-   `* [PUT] /topic/:topicID` <br/> Update a topic

-   `* [PUT] /topic/:topicID/doubt` <br/> Add doubt

-   `* [DELETE] /topic/:topicID/doubt/:doubtID` <br /> Delete doubt

-   `* [PUT] /topic/core-resource` <br /> Add single / array of core-resources. Body should be like,

```javascript
[
    {
        type,
        payload: {},
        pos
    }
];
```

-   `* [DEL] /topic/core_resource/:resID` Delete resource

-   `* [PUT] /topic/:topicID/resource_dump` Add a resource

-   `* [DEL] /topic/rescource_dump/:id` Delete resource

## Doubt / resource-dump

-   `* [PUT] /doubt/:doubtID/like` Add a like

-   `* [DEL] /doubt/:doubtID/like` Delete like

-   `* [PUT] /doubt/:doubtID/reply` Add reply

-   `* [DEL] /doubt/:doubtID/reply/:replyID` Delete reply

## Test

-   `* [GET] /topic/:topicID/test/:testID` <br/>Get test content

-   `* [Post] /topic/:topicID/test/:testID` <br/> Save test score
