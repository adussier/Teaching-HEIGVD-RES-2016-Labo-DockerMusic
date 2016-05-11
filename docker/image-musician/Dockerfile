# using latest node.js image
FROM node:latest

# the author
MAINTAINER Amel Dussier & Sarra Berich

# copy all javascript source files
COPY src /opt/app

# install node.js dependancies
RUN cd /opt/app && npm install

# start
ENTRYPOINT ["node", "/opt/app/musician.js"]