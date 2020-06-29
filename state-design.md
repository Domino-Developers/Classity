### State Design

-   #### Auth

    -   token
    -   isAuthenticated
    -   loading
    -   userData
        -   id
        -   name
        -   avatar
        -   email
        -   coursesEnrolled
        -   coursesCreated

-   #### Courses

    -   coursesById: `{id -> course}`
        Has courseProgress
        Topic Array has name, resource names
    -   coursesMinById: `{id -> course_min_data}`
    -   coursesDisplay: `[ ids ]`

-   #### Topics

    -   TopicById: `{ id -> topic}`

-   #### Comment (doubt / resourceDump)
    -   CommentById: `{ id -> comment }`
