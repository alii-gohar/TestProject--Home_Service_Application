FROM node:14-alpine
RUN mkdir -p /Desktop/bugzilla/client
WORKDIR /Desktop/bugzilla/client
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]