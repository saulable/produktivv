FROM node:alpine
WORKDIR "/app"
COPY ./package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5050
CMD ["npm", "run", "start"]
