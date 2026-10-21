# TopScout — Frontend

Aplicación web para el análisis de ejercicios de fútbol infantil basado en video. El sistema permite a un usuario autenticarse, cargar un video de un ejercicio, seleccionar el tipo y visualizar los resultados del análisis realizados por un modelo de inteligencia artificial.


---

## Stack tecnológico

| Tecnología       | Versión | Propósito                              |
|------------------|---------|----------------------------------------|
| React            | 19      | Librería de interfaz de usuario        |
| TypeScript       | 6.0     | Tipado estático                        |
| Vite             | 8       | Bundler y dev server                   |
| React Router DOM | 7       | Enrutamiento del lado del cliente      |
| MUI Material     | 9       | Componentes de interfaz (UI Kit)       |
| MUI Icons        | 9       | Iconografía Material Design            |
| Emotion          | 11      | Estilos CSS-in-JS                      |

---

## Estructura del proyecto

```
my-app/
├── Dockerfile                  # Construcción multi-etapa (dev y producción)
├── docker-compose.yml          # Orquestación con Docker Compose
├── .dockerignore               # Exclusiones para el build de Docker
├── package.json                # Dependencias y scripts
├── vite.config.ts              # Configuración de Vite
├── tsconfig.json               # Configuración base de TypeScript
├── index.html                  # Punto de entrada HTML
├── public/                     # Archivos estáticos (favicon, iconos)
└── src/
    ├── main.tsx                # Punto de entrada de React
    ├── App.tsx                 # Componente raíz con definición de rutas
    ├── index.css               # Hoja de estilos principal
    ├── styles/
    │   ├── tokens.css          # Sistema de diseño (variables CSS)
    │   ├── base.css            # Estilos base y reset
    │   └── components.css      # Estilos reutilizables
    └── Components/
        └── Pages/
            ├── Login.tsx       # Pantalla de inicio de sesión
            ├── Analysis.tsx    # Carga de video y selección de ejercicio
            └── Results.tsx     # Visualización de resultados del análisis
```

### Descripción de páginas

| Ruta         | Componente    | Descripción                                                                 |
|--------------|---------------|-----------------------------------------------------------------------------|
| `/`          | `LoginForm`   | Pantalla de login con formulario de email y contraseña.                     |
| `/home`      | `Home`        | Carga de archivo de video (drag & drop), previsualización y selección de tipo de ejercicio. |
| `/analysis`  | `Analysis`    | Misma funcionalidad que `/home`.                                            |
| `/results`   | `Results`     | Muestra los puntajes del análisis (simulados) en formato visual y JSON.     |

---

## Requisitos previos

- **Docker Desktop** (recomendado) o **Docker Engine** + **Docker Compose** instalados.
- Opcional: **Node.js 22+** y **npm** si se desea ejecutar sin contenedores.

Verificar instalación:

```bash
docker --version
docker compose version
```

---

## Ejecución con Docker

### Perfil de desarrollo

Levanta el servidor de desarrollo de Vite con recarga en caliente (*hot reload*). Los cambios realizados en el código se reflejan automáticamente en el navegador.

```bash
docker compose up
```

- La aplicación se sirve en **http://localhost:5173**.
- El directorio local se monta dentro del contenedor, por lo que cualquier modificación en el código se aplica en tiempo real.
- El contenedor expone el puerto `5173`.

Para detenerla:

```bash
docker compose down
```

Para reconstruir la imagen (por ejemplo, después de agregar una dependencia):

```bash
docker compose up --build
```

### Perfil de producción

Construye la aplicación para producción (compilación optimizada con TypeScript y Vite) y la sirve mediante un servidor **Nginx** de alto rendimiento.

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

Crear primero el archivo `docker-compose.prod.yml` en la raíz del proyecto (`my-app/`) con el siguiente contenido:

```yaml
services:
  frontend:
    build:
      target: production
    ports:
      - "8080:80"
    volumes: []
```

- La aplicación se sirve en **http://localhost:8080**.
- No incluye volúmenes de montaje; se entrega una imagen estática lista para desplegar.
- Usa Nginx como servidor HTTP liviano y eficiente.

Para producción también es posible construir y ejecutar manualmente:

```bash
docker build --target production -t topscout-frontend .
docker run -d -p 8080:80 topscout-frontend
```

---

## Ejecución sin Docker (Node.js local)

### Requisitos

- Node.js 22 o superior
- npm 10 o superior

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá en **http://localhost:5173**.

### Comandos disponibles

| Comando           | Descripción                                                    |
|-------------------|----------------------------------------------------------------|
| `npm run dev`     | Inicia el servidor de desarrollo con recarga en caliente.      |
| `npm run build`   | Compila la aplicación para producción en la carpeta `dist/`.   |
| `npm run preview` | Sirve localmente la build de producción para prueba previa.    |
| `npm run lint`    | Ejecuta el linter de ESLint sobre el código.                   |

---

## Arquitectura y diseño

### Sistema de diseño (`src/styles/`)

El proyecto utiliza un sistema de diseño propio basado en variables CSS (custom properties) definidas en `tokens.css`. Incluye:

- **Colores corporativos:** Paleta en tonos verdes, negros y grises (`--ts-green-*`, `--ts-black`, `--ts-gray-*`).
- **Tipografía:** Familia Inter con respaldo en sistemas (*fallback stack*).
- **Espaciado y bordes:** Radio de borde (`--ts-radius: 14px`) y sombras predefinidas.
- **Clases utilitarias:** Layout de página, contenedores, tarjetas, botones y scroll personalizado.
- **Responsive:** Breakpoint a 768px para dispositivos móviles.

### Flujo de navegación

```
Login (/) → Carga de video (/home) → Resultados (/results)
```

1. El usuario ingresa credenciales en la pantalla de Login (actualmente no hay validación real).
2. Navega a la pantalla de carga de video, donde puede arrastrar o seleccionar un archivo de video.
3. Selecciona el tipo de ejercicio (2 o 6 repeticiones).
4. Confirma y es redirigido a la pantalla de resultados.
5. Los resultados se muestran en formato visual (tarjetas con puntaje por categoría) y en formato JSON sin procesar.

---

## Convenciones de código

- **Lenguaje:** TypeScript con tipado estricto (`strict: true` en `tsconfig.app.json`).
- **Estilo de componentes:** Funcionales con hooks, utilizando MUI `sx` prop y el sistema `styled` de Emotion.
- **Nomenclatura:** Archivos y componentes en PascalCase (ej. `LoginForm`, `ExerciseResultCard`).
- **Rutas:** Definidas en `App.tsx` mediante `react-router-dom`.
- **Estado compartido:** Se utiliza el estado de navegación de React Router (`location.state`) para pasar datos entre páginas, sin store global (Redux, Zustand, etc.).

---

## Notas importantes

- **Autenticación:** El login no realiza ninguna validación ni llama a un backend. Al hacer clic en "Ingresar" redirige directamente a `/home` sin verificar credenciales.
- **Resultados mock:** La pantalla de resultados (`Results.tsx`) contiene datos simulados en la constante `MOCK_RESULTS`. No se consume ninguna API externa.
- **Carga de video:** El video se procesa únicamente del lado del cliente. No se envía a ningún servidor ni modelo de IA.
- **Archivos placeholder:** Los componentes `Layout.tsx`, `Home.tsx` y `videoplayer.tsx` están vacíos o no se utilizan.
- **Variables de entorno:** No se requiere ningún archivo `.env` para el funcionamiento actual.

---

## Mantenimiento

### Agregar dependencias

```bash
npm install <paquete>
# Ejemplo:
npm install axios
```

Luego reconstruir la imagen de Docker:

```bash
docker compose up --build
```

### Actualizar dependencias

```bash
npm update
```

### Solución de problemas comunes

| Problema                                                          | Solución                                                         |
|-------------------------------------------------------------------|------------------------------------------------------------------|
| `docker compose up` falla con error de permisos                   | Asegurarse de que Docker Desktop esté en ejecución.              |
| El servidor de desarrollo no se actualiza con los cambios         | Verificar que el volumen esté montado correctamente en `docker-compose.yml`. |
| Error `Module not found` al compilar                              | Ejecutar `npm install` localmente o reconstruir la imagen Docker. |
| Puerto 5173 en uso                                                | Cambiar el puerto en `docker-compose.yml` o detener el proceso que lo ocupa. |

---