# Messages Manager

## A) Preface
1) Messages Manager is application which manages messages and provides details about those
messages, specifically whether or not a message is a palindrome. 
2) The exposed WEB API:
    * Create message.
    * Update specific message.
    * Delete specific message.
    * Retrieve specific message.
    * Retrieve all/some/sorted messages.
3) The application may run in 3 deferent environments:
    * **Running the application in the cloud:**
        * Pros:
            * It validate that all works fine in the cloud environment.   
            * It enable to consume the service from all over the world.
        * Cons:
            * Uncomfortable for development process (edit/run/debug).    
    * **Running the application in docker machine:**
        * Pros:
            * No need to install postgres on your machine.
            * It validate that resulted dockerized version is OK.    
        * Cons:
            * Uncomfortable for development process (edit/run/debug).     
    * **Running the application in local machine:**
        * Pros:
            * Comfortable for development process (edit/run/debug).     
        * Cons:
            * Need to install postgres on your machine.
            * It does not validate that resulted dockerized version is OK.

## B) Running the application in the cloud
TODO
      
## C) Running the application in docker machine

### Prerequisite installations:
- Install Docker (e.g. 'Docker Desktop for Windows' - https://hub.docker.com/editions/community/docker-ce-desktop-windows).

### Install, build and run the running multi-container Docker applications (Postgres + Messags Manager):
- Go to root folder of the app (the folder where file 'docker-compose.yml' located), and execute the following command:
~~~
docker-compose up --build
~~~
- See the appendix below for some more useful Docker commands.

## D) Running the application in local machine

### Prerequisite installations:
- Install NodeJs - https://nodejs.org/en/download.
- Install Postgres -https://www.postgresql.org.

### Create the 'Postgres' database:
- Open the 'pgAdmin' app (part of the 'Postgres' installation).
- Go to: Databases -> right click -> Create -> DataBase, and create new data base with:
    - name: messages-manager.
    - port: 5432.
    - username: postgres.
    - password: postgres.

### Install, build and run the multi-parts local applications (Postgres + Messags Manager):
- Go to root folder of the app (the folder where file 'package.json' located), and execute the following commands sequence:
~~~
npm install
npm run build
npm run start
~~~

## E) Testing the application
TODO

## F) Using the application's CLI
TODO

## G) Appendix

### Other useful Docker commands

#### Build the Messages Manager docker image:
~~~
docker build -t messages.manager .
~~~
#### Run the Messages Manager docker container:
~~~
docker run -it -p 8080:8080 -P messages.manager
~~~
#### Stop all running docker containers:
~~~
docker stop $(docker ps -q)
~~~
#### Remove all docker containers:
~~~
docker rm $(docker ps -a -q)
~~~
