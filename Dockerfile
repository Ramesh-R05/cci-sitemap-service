FROM bauer/node

ARG http_proxy=http://proxy.mgmt.local:3128
ARG https_proxy=https://proxy.mgmt.local:3128
ARG node_ver=v0.12.8

RUN nvm_set_node.sh -v $node_ver

ADD ./deployment/nginx/service.conf /etc/nginx/conf.d/sitemap-service.conf

RUN mkdir /app
ADD ./src /app

WORKDIR /app

EXPOSE 80

CMD ["/usr/bin/supervisord"]