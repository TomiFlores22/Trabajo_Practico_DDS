Perfecto para documentar. La idea no es escribir "qué comandos ejecutamos", sino por qué los ejecutamos y qué problema resuelven.
Etapa 1: Creación del repositorio Git
¿Qué hicimos?

Creamos un repositorio Git y lo conectamos a GitHub.
¿Para qué sirve?

Git permite:

    guardar versiones del proyecto

    volver atrás si algo se rompe

    trabajar varias personas al mismo tiempo

    llevar un historial de cambios

Conceptos importantes
Commit

Un commit es una "foto" del proyecto en un momento determinado.

Ejemplo:

Commit 1:
Proyecto vacío

Commit 2:
Servidor Express funcionando

Commit 3:
Modelos Sequelize creados

Si algo se rompe en el commit 3, podemos volver al commit 2.
Etapa 2: Creación de ramas
¿Qué hicimos?

Creamos ramas independientes:

main
lauti-back
tomi-back

¿Para qué sirve?

Permite que dos desarrolladores trabajen simultáneamente sin modificar los mismos archivos.
Sin ramas

Lauti modifica index.js
Tomi modifica index.js

Conflicto

Con ramas

Lauti → lauti-back
Tomi → tomi-back

Cada uno trabaja aislado

Cuando una funcionalidad está terminada:

git merge

y se incorpora al proyecto principal.
Etapa 3: Inicialización del proyecto Node
¿Qué hicimos?

Ejecutamos:

npm init -y

¿Qué genera?

package.json

¿Para qué sirve?

Es el archivo que describe el proyecto.

Contiene:

{
  "name": "backend",
  "version": "1.0.0"
}

y más adelante:

{
  "dependencies": {
    "express": "...",
    "sequelize": "..."
  }
}

Etapa 4: Instalación de dependencias
¿Qué hicimos?

npm install express sequelize sqlite3

¿Qué son las dependencias?

Son bibliotecas desarrolladas por terceros que agregan funcionalidades.
Express

Permite crear servidores HTTP.

Sin Express:

http.createServer(...)

Mucho más complejo.

Con Express:

app.get("/", ...)

Mucho más simple.
Sequelize

Es un ORM.

ORM significa:

Object Relational Mapper

Permite trabajar con objetos JavaScript en lugar de escribir SQL manualmente.

Ejemplo:

Usuario.findAll()

en lugar de:

SELECT * FROM usuarios

SQLite

Es la base de datos.

Guarda la información en un archivo:

database.sqlite

Etapa 5: Creación del .gitignore
¿Qué hicimos?

Creamos:

.gitignore

¿Para qué sirve?

Le indica a Git qué archivos NO debe subir.

Ejemplo:

node_modules/
.env
database.sqlite

¿Por qué ignoramos node_modules?

Porque:

node_modules

puede ocupar cientos de MB.

Además se puede reconstruir simplemente ejecutando:

npm install

Etapa 6: Creación de la estructura del backend
¿Qué hicimos?

Creamos:

backend/
├── routes/
├── controllers/
├── services/
├── middlewares/
├── models/
├── config/
├── data/
└── tests/

¿Por qué?

Para aplicar separación de responsabilidades.

Cada carpeta tiene una función específica.
models

Representan las entidades de la base de datos.

Ejemplo:

Usuario
Equipo
Solicitud
Historial

routes

Definen las URLs.

Ejemplo:

GET /equipos
POST /solicitudes

controllers

Reciben las peticiones HTTP.

Ejemplo:

Request
↓
Controller
↓
Service

services

Contienen la lógica de negocio.

Ejemplo:

¿El equipo está disponible?
¿La fecha es válida?
¿Puede aprobar esta solicitud?

middlewares

Interceptan peticiones.

Ejemplo:

Validar JWT
Validar permisos
Capturar errores

data

Contendrá datos semilla.

Ejemplo:

8 equipos
3 usuarios
12 solicitudes

tests

Pruebas automáticas.

Permiten verificar que el sistema siga funcionando.
Etapa 7: Creación del servidor Express
¿Qué hicimos?

Creamos:

const app = express();

¿Qué representa?

La aplicación web.

Podemos imaginarla así:

Cliente
↓
Express
↓
Backend
↓
Base de datos

Middleware JSON

Agregamos:

app.use(express.json());

¿Para qué sirve?

Permite que Express entienda JSON.

Ejemplo:

{
  "nombre": "Juan"
}

Sin esta línea:

req.body

llega vacío.
Etapa 8: Primera ruta

Creamos:

app.get("/", (req, res) => {
  res.json({
    mensaje: "API funcionando"
  });
});

¿Qué significa?
app.get

Responde peticiones GET.
"/"

Es la ruta raíz.
req

Request.

Información enviada por el cliente.
res

Response.

Respuesta que devuelve el servidor.

Cuando el navegador visita:

http://localhost:3000

Express responde:

{
  "mensaje": "API funcionando"
}

Etapa 9: Script de ejecución

En package.json agregamos:

"scripts": {
  "dev": "node index.js"
}

¿Para qué sirve?

Permite ejecutar:

npm run dev

en lugar de:

node index.js

Resultado actual

Hoy lograron construir la infraestructura mínima del backend:

Git
↓
Repositorio
↓
Ramas
↓
Node.js
↓
Express
↓
Servidor funcionando
↓
Arquitectura de carpetas preparada

Todavía NO implementaron:

❌ Sequelize configurado
❌ Modelos
❌ Base de datos
❌ Relaciones
❌ JWT
❌ Login
❌ CRUD
❌ Tests

Pero sí dejaron preparada toda la base sobre la cual se va a construir el resto del TP. Esa fue la primera piedra del proyecto.
