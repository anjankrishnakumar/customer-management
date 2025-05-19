# customer-management

# Backend
Backend service powered by Django 

# .env
Create one .env file and store following values inside it 
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=<yourpassword>
DJANGO_SECRET_KEY=<yourkey>
DEBUG=False

# Docker build command
 docker build --no-cache -t customer-mgmt .

# Docker run Command
docker run --env-file .env -p 8000:8000 customer-mgmt


# Frontend service
Frontend serice powered by React

# Command to create a BuildX
mkdir -p ~/.docker/cli-plugins
ls ~/.docker/cli-plugins
curl -Lo ~/.docker/cli-plugins/docker-buildx https://github.com/docker/buildx/releases/download/v0.12.0/buildx-v0.12.0.linux-amd64
chmod +x ~/.docker/cli-plugins/docker-buildx
file ~/.docker/cli-plugins/docker-buildx

# Docker Build command 
DOCKER_BUILDKIT=1 docker build --no-cache -t customer-mgmt-app .

# Docker run command
docker run -p 3000:80 customer-mgmt-app

# Browser link
http://localhost:3000
