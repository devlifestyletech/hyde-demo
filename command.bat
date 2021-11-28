
docker build -t docker-react .

docker run -it \
  -v ${PWD}:/usr/src/app \
  -v /usr/src/app/node_modules \
  -p 3000:3000 \
  --rm \
  docker-react
---------------------------------------------------------------------------------

เรียนรู้ multi-stage docker ด้วยการ deploy react ขึ้น production กันเถอะ
    $ docker build -f Dockerfile -t react-multistage:latest .
    $ docker run --rm -p 80:80 react-multistage:latest



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
    ---------------------------------------------------------------------------------

    Container Registry
    Use Heroku CLI

    Login Heroku
    $ heroku login

    Create New App
    $ heroku create -a hyde-docker-demo

    Log in to Container Registry
    $ docker ps
    $ heroku container:login

    Push your Docker-based app
    $ heroku container:push web -a hyde-docker-demo

    Deploy the changes
    $ heroku container:release web -a hyde-docker-demo

    $ heroku open

    Log
    $ heroku logs --tail


---------------------------------------------------------------------------
Push Image to Docker Hub

# 1. Login to docker
$ sudo docker login

# 2. docker build -t <hub-user>/<repo-name>[:<tag>]
$ sudo docker build -t natthapol593/hyde-docker-demo:v0.1.0 .

# 3. docker tag <existing-image> <hub-user>/<repo-name>[:<tag>]
# 4. docker commit <existing-container> <hub-user>/<repo-name>[:<tag>]

# 5. Push image
# docker push <hub-user>/<repo-name>:<tag>
$ sudo docker push natthapol593/hyde-docker-demo:v0.1.0


# 6. Pull Image
$ sudo docker pull natthapol593/hyde-docker-demo:v0.1.0

# 7. Deploy
docker run -it -d --rm --name hyde-docker-demo -p 81:80 natthapol593/hyde-docker-demo:v0.1.0
