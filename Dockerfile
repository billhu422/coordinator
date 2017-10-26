FROM node:latest

RUN apt-get update && apt-get -y install curl && apt-get -y install git  && apt-get -y install vim && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime


WORKDIR /opt
RUN git clone https://github.com/billhu422/coordinator.git && \
        cd coordinator && \
        npm install

expose 4000

CMD  node /opt/coordinator/bin/www