# Angular + Firebase + Cart

# Instalación

1.  Angular CLI
    - [Descargar Angular CLI](https://cli.angular.io/)
2.  NodeJs
    - [Descargar Nodejs](https://nodejs.org/en/download/)
3.  Package Manager - NPM / Yarn
4.  Clonar el repositorio y correr `npm install` o `yarn install`.
5.  Activar los medios de autenticación en Firebase

    `Authentication -> Sign-in-method -> Enable Email/Password & Google`

7.  Actualizar las reglas de  _(Realtime Database)_

    `Database -> Rules`

    ```
    {
    "rules": {
        ".read":true,
        ".write": true
    }
    }
    ```

8.  Insertar la configuración de firebase en `src/environments/firebaseConfig.ts`

    ```
    export const FireBaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID"
    };


10. Correr `ng serve`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
