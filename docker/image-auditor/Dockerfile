# using latest node.js image
FROM node:latest

# the author
MAINTAINER Amel Dussier

# the port for connection requests
EXPOSE 2205

# copy all javascript source files
COPY src /opt/app

# start
ENTRYPOINT ["node", "/opt/app/auditor.js"]