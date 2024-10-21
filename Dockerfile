FROM node:18

# Crea una directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copia tutti i file del progetto
COPY . .

# Accedi alla cartella backend
WORKDIR /usr/src/app/backend

# Installa le dipendenze di Node.js
RUN npm install

# Espone la porta 3000
EXPOSE 3000

# Avvia il server Express
CMD ["npm", "start"]
