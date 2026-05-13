# Lab 09 - Cloud Storage con Amazon S3

**Curso:** Desarrollo de Soluciones en la Nube  
**Alumno:** Maria Fernanda Moya  
**Docente:** Jaime Farfán  
**Fecha:** 13 de mayo de 2026

---

## Descripción

Aplicación web full-stack que permite subir, visualizar y eliminar imágenes almacenadas en **Amazon S3**, implementando buenas prácticas de seguridad cloud:

- Bucket privado con cifrado en reposo (SSE-S3)
- Política de bucket que fuerza HTTPS
- Usuario IAM con permisos mínimos
- Presigned URLs para acceso temporal y seguro
- Credenciales nunca expuestas al frontend

---

## Arquitectura
Navegador → POST /api/upload-url → Backend (Express)
↓
Genera presigned URL
↓
Navegador → PUT directo ──────────→ Amazon S3

El archivo viaja **directamente del navegador a S3** sin pasar por el backend.

---

## Estructura del proyecto
Lab09-S3/
├── backend/
│   ├── server.js          # API con Express + AWS SDK v3
│   ├── package.json
│   ├── .env               # ⚠️ NO subir a Git
│   └── .gitignore
└── frontend/
├── index.html
├── app.js
└── styles.css

---

## Requisitos previos

- Node.js 18+
- AWS CLI configurado (`aws configure`)
- Cuenta de AWS con bucket S3 creado
- Usuario IAM con permisos sobre el bucket

---

## Instalación y uso

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd Lab09-S3/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
AWS_REGION=us-east-1
S3_BUCKET=nombre-de-tu-bucket
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
PORT=3000
```

### 4. Iniciar el servidor

```bash
node server.js
```

El servidor quedará corriendo en `http://localhost:3000`

### 5. Abrir el frontend

Abre `frontend/index.html` en el navegador (con Live Server o directamente).

---

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/upload-url` | Genera presigned URL para subir imagen |
| GET | `/api/images` | Lista imágenes con presigned URLs de visualización |
| DELETE | `/api/images/:key` | Elimina una imagen del bucket |

---

## Seguridad implementada

| Medida | Detalle |
|--------|---------|
| Bucket privado | Block all public access activado |
| HTTPS forzado | Política de bucket deniega HTTP |
| Cifrado en reposo | SSE-S3 (AES-256) activado por defecto |
| Permisos mínimos | Usuario IAM solo con s3:GetObject, PutObject, DeleteObject, ListBucket |
| Presigned URLs | Subida expira en 5 min, visualización en 15 min |
| Validación doble | Tipo y tamaño validados en frontend Y backend |
| Sin credenciales en cliente | Las credenciales solo están en el servidor |

---

## Validaciones

- Solo se permiten archivos `image/jpeg`, `image/png`, `image/webp`
- Tamaño máximo: **5 MB**
- Validación en frontend y backend (doble capa)

---

## Configuración CORS del bucket

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## Tecnologías utilizadas

- **Backend:** Node.js, Express, AWS SDK v3, dotenv
- **Frontend:** HTML, CSS, JavaScript vanilla
- **Cloud:** Amazon S3, IAM, presigned URLs
- **Íconos:** Tabler Icons