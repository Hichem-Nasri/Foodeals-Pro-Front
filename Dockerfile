FROM node:20.6.1

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN ["npm", "run", "build"]
EXPOSE 4000

CMD ["npm", "start", "-p". "4000"]

