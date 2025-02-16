Planning Backend Tasks
- Add basic auth setup
- Create user and poll schema
- Create endpoints for user and poll


Schema
- User model
    - id
    - username
    - email
    - password
    - pollList
- Poll Model
    - pollId
    - name
    - description
    - choice
        - name
        - choiceId
        - votes
        
Endpoints

User endpoints
- POST - /v1/user/register - Create User
- POST - /v1/user/login - Login in User

Poll Endpoints
- GET /v1/poll - Get all poll

- GET /v1/poll/:pollId - Get poll Id
- POST /v1/poll/ - Create a poll by userId

- PUT /v1/poll/:pollId/vote - To add vote in a poll
- GET /v1/poll/:pollId/results - To get poll result