FROM node:9
RUN apt install git python && \
    npm install -g git+https://git@github.com/gulpjs/gulp.git#4.0
COPY . /var/website-v2
WORKDIR /var/website-v2
RUN rm -rf node_modules
RUN npm i
RUN gulp prod