FROM node:14-alpine
RUN mkdir -p /Desktop/bugzilla/server
WORKDIR /Desktop/bugzilla/server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "/Desktop/bugzilla/server/server.js"]