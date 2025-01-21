# Étape de build
FROM node:20-alpine as builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY angular.json tsconfig*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY src/ ./src/

# Builder l'application
RUN npm run build --prod

# Étape de production
FROM nginx:alpine

# Copier la configuration nginx personnalisée si nécessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés depuis l'étape de build
COPY --from=builder /app/dist/musicapi/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 4200

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
