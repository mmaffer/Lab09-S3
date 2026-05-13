# Lab 09 - Cloud Storage con Amazon S3

**Curso:** Desarrollo de Soluciones en la Nube  
**Alumno:** Maria Fernanda Moya  
**Docente:** Jaime Farfán  
**Fecha:** 13 de mayo de 2026  

---

## Descripción

Aplicación web full-stack para subir, visualizar y eliminar imágenes almacenadas en **Amazon S3** usando buenas prácticas de seguridad cloud.

### Seguridad implementada
- Bucket privado
- Cifrado SSE-S3
- HTTPS obligatorio
- Usuario IAM con permisos mínimos
- Presigned URLs para acceso temporal
- Credenciales protegidas en backend

---

## Arquitectura

```text
Navegador → Backend (Express) → Genera Presigned URL → Amazon S3
```

El archivo se sube directamente desde el navegador hacia S3 sin pasar por el backend.

---

## Estructura del proyecto

```text
Lab09-S3/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── index.html
    ├── app.js
    └── styles.css
```

---

## Requisitos

- Node.js 18+
- AWS CLI configurado
- Bucket S3 creado
- Usuario IAM con permisos sobre S3

---

## Instalación

### 1. Clonar repositorio

```bash
git clone <url-del-repo>
cd Lab09-S3/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar `.env`

```env
AWS_REGION=us-east-1
S3_BUCKET=nombre-bucket
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
PORT=3000
```

### 4. Ejecutar servidor

```bash
node server.js
```

Servidor disponible en:

```text
http://localhost:3000
```

### 5. Abrir frontend

Abrir `frontend/index.html` con Live Server o en el navegador.

---

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/upload-url` | Genera URL de subida |
| GET | `/api/images` | Lista imágenes |
| DELETE | `/api/images/:key` | Elimina imagen |

---

## Validaciones

- Formatos permitidos: JPG, PNG y WEBP
- Tamaño máximo: 5 MB
- Validación en frontend y backend

---

## Tecnologías

- Node.js
- Express
- AWS SDK v3
- Amazon S3
- HTML, CSS y JavaScript Vanilla