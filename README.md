# 🎵 Application de Streaming Musical

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://www.mongodb.com/)

## 📝 Description

Application fullstack de streaming musical combinant une API REST Spring Boot et une interface utilisateur Angular. Cette plateforme permet la gestion et la lecture de musique avec un système d'authentification sécurisé.

## ✨ Fonctionnalités

### 🔒 Backend

- **Gestion des Albums**

  - CRUD complet
  - Recherche et filtrage
  - Pagination et tri

- **Gestion des Chansons**

  - Upload de fichiers audio (MP3, WAV, OGG)
  - Streaming sécurisé
  - Métadonnées complètes

- **Authentification**
  - JWT
  - Gestion des rôles (USER/ADMIN)
  - Inscription/Connexion

### 🎨 Frontend

- **Interface Utilisateur**

  - Bibliothèque musicale
  - Lecteur audio intégré
  - Recherche avancée

- **Gestion d'État**
  - NgRx Store
  - Gestion asynchrone
  - Cache optimisé

## 🛠 Technologies

### Backend

- Spring Boot
- Spring Security
- MongoDB & GridFS
- Docker
- Jenkins
- Maven
- Git
- JUnit
- Mockito
- Lombok
- Swagger
- OpenAPI

### Frontend

- Angular 17
- NgRx
- TypeScript
- RxJS
- Bootstrap/Tailwind
- Ngx-pagination
- Ngx-audio-player
- Ngx-spinner
- Ngx-toastr
- Ngx-infinite-scroll

## 🚀 Installation
```
git clone https://github.com/anwar-bouchehboun/Music_Streams_Api_Angular.git
cd musicapi
npm install
```

## 📋 Prérequis

- Java 8+
- Node.js 18+
- MongoDB 4.4+
- Docker
- Angular CLI


## 🔑 Configuration

- Créer un fichier .env dans le dossier backend et ajouter les variables d'environnement suivantes :

```
MONGO_URI=mongodb://localhost:27017/musicapi
JWT_SECRET=your_secret_key
```

- Créer un fichier .env dans le dossier frontend et ajouter les variables d'environnement suivantes :

```
NEXT_PUBLIC_API_URL=http://localhost:8086/api
```
  
