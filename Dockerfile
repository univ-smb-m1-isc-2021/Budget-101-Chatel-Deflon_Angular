# Use official node image as the base image (16 is LTS)
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ["package.json", "package-lock.json*", "./"]

# Install all the dependencies, prepare for type script
RUN npm install -g typescript

COPY . .

RUN ls

CMD [ "tsc", "src/main.ts" ]

# a voir ou se fait l ouput de cette commande ^^

CMD [ "node", "src/main.js" ]
