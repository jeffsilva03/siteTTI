FROM nginx

WORKDIR /usr/share/nginx/html

COPY index.html .
COPY style.css .
COPY script.js .
COPY assets/ .

EXPOSE 80
