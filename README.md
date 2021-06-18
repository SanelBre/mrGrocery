# mrGrocery

Server side application with the goal of managing nodes and users. Users can be of type employees or manages. Managers have the privlage to create other users of either type and to assign them to one of the awailable nodes. An employee is able to update its own data but not the data of other users, manager can change data of all users. A deleted user is a user that has the deleted flag set to true.

# Setup

Tech stack: __TypeScript, Mongoose, Mongoodb, Eslint, Prettier, Docker, NPM__

## requirements

Cloning the repo. Optionally with git.

*first option - running with docker:*
- docker
- docker-compose
- some testing tool, for triggering endpoints
- db seeded

*second option:*
- node
- ts-node
- mongodb that is listening on post 27017
- all npm deppendencies instlled
- some testing tool, for triggering endpoints
- db seeded

### first option proceed:

1. from the root of the project build a docker immage of the project by running:
```docker build -t mrgrocery .```

2. startup the project by rooning from root of the project:
```docker-compose -f docker-compose.yml up -d```

__this should start the database, database viewer and the app which is listening on port 8000__

3. seed the data with:
```npm run seed```

### second option proceed:

1. setup a mongdb with the 27017 port
On mac this can be used to install mongodb:
```brew install mongodb-community```
  __start it with: ```brew services start mongodb-community```__

On ubuntu this could be run to get mongodb installed:
```wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -```
  __start it with: ```sudo systemctl start mongod```__

2. install deppendencies form the root of the project by running:
```npm i```

3. seed the data:
```npm run seed```

4. start the app - the app should be started successfully listening on port 8000:
```npm start```

## api doc

### Authentication:

#### POST -> /authenticate
- authentication: N
- params: /
- body:
  - username* | string - username of an user from the base
- authenticate with a valid username and recieve a token used to pass the authorizations

#### DELETE -> /authenticate
- authentication: y | bearer token
- params: /
- body: .
- removes the token from the user that is making the request with a valid token

### Users:

#### POST -> /user
- authentication: y | bearer token | requires to be a manager
- params: /
- body:
  - username* | string
  - role* | employee / manager
  - nodeId* | string - uuid of existing node
  - email | string - not required
- description: should create a new user with the choosen role

#### DELETE -> /user/:id
- authentication: y | bearer token
- params:
  - id | uuid of existing non deleted user
- body: .
- description: should set the delete flag of a non deleted user to true, its a soft delete

#### PATCH -> /user/:id
- authentication: y | bearer token
- params:
  - id | uuid of existing non deleted user
- body:
  - username | string
  - role | employee / manager
  - email | string - not required
- description: updates any user with the role of manager, or own data with the role of employee

#### GET -> /user/:id
- authentication: N
- params:
  - id | uuid of existing non deleted user
- body: .
- description: gets a target user by the provided id

#### GET -> /user/:id/node
- authentication: y | bearer token
- params:
  - id | uuid of existing non deleted user
- body: .
- description: gets all users of a node that the user with the provided id belongs to

### Nodes:

#### GET -> /node/:id/employees?descendants={true/false}
- authentication: y | bearer token
- params:
  - id | uuid of existing node
- body: .
- description: get employees of the target node, if descendants query param is set to true it will also pickup all the employees from them, all of them are non deleted

#### GET -> /node/:id/managers?descendants={true/false}
- authentication: y | bearer token
- params:
  - id | uuid of existing node
- body: .
- description: get managers of the target node, if descendants query param is set to true it will also pickup all the managers from them, all of them are non deleted

#### GET -> /node
- authentication: N
- params: /
- body: .
- description: gets all nodes from the base

#### GET -> /node/:id
- authentication: N
- params:
  - id | uuid of existing node
- body: .
- description: gets a target node by its id

#### PATCH -> /node/:id
- authentication: y | bearer token | requires to be a manager
- params:
  - id | uuid of existing node
- body:
  - name | string - name of the node
  - nodeType | office / store
- description: updates a target node with either the name or nodeType or both
