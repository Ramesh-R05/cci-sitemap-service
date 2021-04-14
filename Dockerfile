# AWS ECS DockerFile
FROM 317367993082.dkr.ecr.ap-southeast-2.amazonaws.com/node-base-lite-aws:10.19.0
MAINTAINER AreMedia arm.builduser@gmail.com

RUN mkdir /app
ADD ./src /app

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]
