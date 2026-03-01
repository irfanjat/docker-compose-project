# 🐳 Docker Compose — Node.js + MongoDB Project

A beginner-friendly project demonstrating **Docker Compose** with a Node.js app connected to a MongoDB database. Everything runs with a single command!!

---

## 📁 Project Structure

```
docker-compose-project/
│
├── app.js              ← Node.js Express app
├── package.json        ← Node dependencies
├── Dockerfile          ← How to build the app image
└── docker-compose.yml  ← The magic file that ties everything together
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Node.js 18 | Backend runtime |
| Express.js | Web framework |
| Mongoose | MongoDB connection |
| MongoDB 6 | Database |
| Docker Compose | Multi-container orchestration |

---

## 📄 Files Explained

### `Dockerfile`

```dockerfile
FROM node:18-alpine    # Lightweight base image (~50MB)
WORKDIR /app           # Set working directory inside container
COPY package.json .    # Copy dependencies list first (caching trick!)
RUN npm install        # Install all dependencies
COPY . .               # Copy rest of the code
EXPOSE 3000            # Signal that app runs on port 3000
CMD ["node", "app.js"] # Start the app when container launches
```

**Why copy `package.json` before the rest of the code?**
Docker builds images in layers. By copying `package.json` first and running `npm install` before copying the rest of the code, Docker can **cache the dependencies layer**. If you only change `app.js`, Docker skips `npm install` on the next build — saving time! 🚀

---

### `docker-compose.yml`

```yaml
version: '3'

services:

  app:
    build: .              # Build from local Dockerfile
    ports:
      - "3000:3000"       # Map laptop:container port
    depends_on:
      - mongo             # Wait for mongo to start first
    restart: always       # Auto-restart if app crashes

  mongo:
    image: mongo:6        # Use official MongoDB image
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db  # Persist data across restarts

volumes:
  mongo-data:             # Declare the named volume
```

**Key Concepts:**

- `build: .` → Build image from your Dockerfile (vs `image:` which pulls from Docker Hub)
- `depends_on` → Controls start order — mongo starts before app
- `restart: always` → Self-healing! If app crashes, it auto-restarts
- `volumes` → Data survives even if container is stopped or deleted

---

### `app.js`

```javascript
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// 'mongo' here is the SERVICE NAME from docker-compose.yml
// Docker Compose creates a private network — containers talk via service names!
mongoose.connect('mongodb://mongo:27017/myapp')
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

app.get('/', (req, res) => {
  res.send('<h1>🐳 Docker Compose is Working!</h1>');
});

app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`);
});
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/irfanjat/docker-compose-project.git
cd docker-compose-project
```

### 2. Run everything with one command

```bash
docker compose up --build
```

### 3. Visit the app

Open your browser and go to:
```
http://localhost:3000
```

You should see:
> 🐳 **Docker Compose is Working!**

---

## 🧰 Useful Commands

| Command | What it does |
|---|---|
| `docker compose up --build` | Build images and start all containers |
| `docker compose up -d` | Start in background (detached mode) |
| `docker compose down` | Stop and remove all containers |
| `docker compose ps` | See running containers |
| `docker compose logs` | View logs from all containers |
| `docker compose logs app` | View logs from only the app container |
| `docker compose restart` | Restart all containers |

---

## 🌐 How Docker Networking Works Here

Docker Compose **automatically creates a private network** for all services. This means:

- `app` container can reach `mongo` container using just the name **`mongo`**
- No IP addresses needed — just use the **service name** as hostname
- From outside (your browser) → use `localhost:3000`
- From inside containers → use service name `mongo:27017`

```
Your Browser
     ↓ localhost:3000
  [ app container ]  ←→  [ mongo container ]
        (Node.js)    mongo:27017   (MongoDB)
         
        Both are on Docker's private network
```

---

## 💾 Data Persistence

MongoDB data is stored in a **named volume** called `mongo-data`.

```
Container deleted? ✅ Data still safe
docker compose down? ✅ Data still safe
Server restarted? ✅ Data still safe
```

To completely remove data (fresh start):
```bash
docker compose down -v
```
> ⚠️ The `-v` flag removes volumes too — all database data will be deleted!

---

## 📝 .dockerignore

Create a `.dockerignore` file to prevent unnecessary files from being copied into the image:

```
node_modules
.env
*.log
.git
```

This keeps your image **small and clean**. Most importantly, `node_modules` should always be ignored — let `npm install` inside the container handle dependencies.

---

## 🧠 Key Concepts Learned

| Concept | Description |
|---|---|
| `FROM` | Base image to build on top of |
| `WORKDIR` | Working directory inside container |
| `COPY` | Copy files from host to container |
| `RUN` | Execute command at **build time** |
| `CMD` | Execute command at **run time** |
| `EXPOSE` | Document which port the app uses |
| `services` | Define containers in Compose |
| `build vs image` | Custom Dockerfile vs ready-made image |
| `depends_on` | Container start order |
| `volumes` | Persistent data storage |
| `restart` | Auto-recovery policy |

---

## 📚 Resources

- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Docker Hub — Node.js](https://hub.docker.com/_/node)
- [Docker Hub — MongoDB](https://hub.docker.com/_/mongo)

---

## 👨‍💻 Author

Made with ❤️ while learning Docker Compose

---

> ⭐ If this helped you understand Docker Compose, give it a star!
