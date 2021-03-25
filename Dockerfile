FROM node:14 
# Informamos a Docker la Version de node que vamos a ocupar 

WORKDIR /usr/src/app 
# Informamos a Docker donde va a estar guardando la aplicacion

COPY package*.json ./ 
# copia los package y muevelos a WORKDIR

RUN npm install 
# Aqui se intalan todas dependencias del proyecto

RUN npm install nodemon -g
# Instalar de manera global nodemon

COPY . . 
# copiar el resto de los archivos al WORKDIR

EXPOSE 3000 
# expon (abre) el puerto para que te puedas conectar

CMD ["nodemon","-L","--watch",".","server.js"] 
# nodemon -L --watch . server.js
# Ejecuta el comando nodemon como si lo escribieramos en consola


