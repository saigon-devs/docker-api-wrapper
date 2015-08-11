# What about docker-api-wrapper library
Docker API Wrapper that make us call to the Docker API fast, easy and works like a charm
# Use it

`npm install docker-api-wrapper`

or 

`npm install docker-api-wrapper --save-dev`

then 

`import {Container, Image} from 'docker-api-wrapper';`

# Run integration testing
+ If you want to make it works, please add ./spec/config.js file, then add
 
`module.exports = {
     server: '[your docker server ip]',
     port: [your docker port]
 };`
 
+ `npm install`
+ `npm run test`
# Demo
[Docker API with SwaggerUI](https://github.com/saigon-devs/docker-api)