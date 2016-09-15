# Script for building with concourse

FROM node:6.5.0-wheezy

RUN npm install -g git+https://git@github.com/gulpjs/gulp.git#4.0
ADD package.json /package.json
RUN npm install