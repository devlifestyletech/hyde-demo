


docker build -t docker-react .


docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 3000:3000 \
  --rm \
  docker-react



# Deploying Docker on Heroku
1. Create New Pipeline
2. Add app STAGING
3. cmd => heroku stack:set container --app hyde-docker-demo
4. Deploy
    Login
    $ heroku login
    
    Create a new Git repository
    $ cd my-project/
    $ git init
    $ heroku git:remote -a hyde-docker-demo

    Deploy your application
    $ git add .
    $ git commit -am "make it better"
    $ git push heroku master

    Existing Git repository
    $ heroku git:remote -a hyde-docker-demo
    *******************************************************************************

    Container Registry
    Use Heroku CLI

    $ heroku login

    Log in to Container Registry
    $ docker ps
    $ heroku container:login

    Push your Docker-based app
    $ heroku container:push <name>

    Deploy the changes
    $ heroku container:release <name>