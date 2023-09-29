# API Teamknowlogy

Este es un proyecto de Express con su correspondiente Swagger e incluye pruebas unitarias utilizando Jest.
Demo: https://teamknowlogy-api.onrender.com/

## Configuración

Para comenzar con el proyecto, sigue estos pasos:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/lorenzo0895/teamknowlogy-api.git
   cd teamknowlogy-api

2. Instala las dependencias:
    ```bash
    npm install

3. Crea un archivo `.env` en la raiz del proyecto con las variables de entorno necesarias (ver sección "Variables de entorno")

4. Ejecuta el servidor:
    ```bash
    npm start

5. Ingresa al sitio http://localhost:3000

## Variables de entorno (.env)
Las variables de entorno requeridas corresponden a la configuración de la base de datos de Firestore. Para ello cree un proyecto en Firebase (https://firebase.google.com) y luego una base de datos de Firestore. A continuación, reemplace las variables por las que le son proporcionadas. Ej de archivo .env:

    API_KEY="########"
    AUTH_DOMAIN="########"
    PROJECT_ID="########"
    STORAGE_BUCKET="########"
    MESSAGING_SENDER_ID="########"
    APP_ID="########"

## Pruebas unitarias
Si deseas realizar las pruebas unitarias con Jest ejecuta:

    npm test