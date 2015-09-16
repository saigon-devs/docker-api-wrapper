# Docker API Wrapper
[![npm version](https://badge.fury.io/js/docker-api-wrapper.svg)](http://badge.fury.io/js/docker-api-wrapper)
[![Build Status](https://travis-ci.org/saigon-devs/docker-api-wrapper.svg?branch=master)](https://travis-ci.org/saigon-devs/docker-api-wrapper)
[![bitHound Score](https://www.bithound.io/github/saigon-devs/docker-api-wrapper/badges/score.svg)](https://www.bithound.io/github/saigon-devs/docker-api-wrapper)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/saigon-devs/docker-api-wrapper?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Docker API Wrapper that makes us call to the Docker API fast, easy and works like a charm...

# Use it

> `npm install docker-api-wrapper`

or 

> `npm install docker-api-wrapper --save-dev`

then 

> `import {Misc, Container, Image} from 'docker-api-wrapper';`

# Run integration testing

> If you want to make it works, please add ./spec/config.js file, then add
 
`module.exports = {
     server: '[your docker server ip]',
     port: [your docker port]
 };`
 
> `npm install`

> `npm run test`

# List API ([Docker Remote API v1.19](https://docs.docker.com/reference/api/docker_remote_api_v1.19/))

> **DONE**

1. Images
  * getImages
  * createImage
  * inspectImage
  * getImageHistory
  * removeImage
  * searchImages

2. Containers
  * getContainers
  * inspectContainer
  * inspectContainerChanges
  * getContainerResourceStats

3. Misc
  * getInfo
  * getVersion

> **TODO**

1. Images
  * Build image from a Dockerfile
  * Get the history of an image
  * Push an image on the registry
  * Tag an image into a repository
2. Containers
  * Create a container
  * Get container logs
  * Export a container
  * Get container stats based on resource usage
  * Resize a container TTY
  * Start a container
  * Stop a container
  * Restart a container
  * Kill a container
  * Rename a container
  * Pause a container
  * Unpause a container
  * Attach to a container
  * Attach to a container (websocket)
  * Wait a container
  * Remove a container
  * Copy files or folders from a container
3. Misc
  * Check auth configuration
  * Ping the docker server
  * Create a new image from a container’s changes
  * Monitor Docker’s events
  * Get a tarball containing all images in a repository
  * Get a tarball containing all images
  * Load a tarball with a set of images and tags into docker
  * Image tarball format
  * Exec Create
  * Exec Start
  * Exec Resize
  * Exec Inspect

> Demo Hapi Docker API with SwaggerUI [HDAS](https://github.com/saigon-devs/docker-api)
