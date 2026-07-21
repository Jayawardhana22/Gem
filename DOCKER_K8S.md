Docker and Kubernetes setup for Gem Marketplace

Overview
- Dockerfiles for backend and frontend, a `docker-compose.yml` for local orchestration, and Kubernetes manifests under `k8s/`.

Local development with Docker Compose
1. From the repository root run:

```
docker-compose up --build
```

2. Frontend will be available at `http://localhost:3000` and backend at `http://localhost:5000`.

Notes about environment variables
- The frontend reads the backend base URL from `VITE_API_URL` (see `frontend/src/services/api.ts`).
- Development env: `frontend/.env.development` points to `http://localhost:5000/api`.
- Production/K8s env: `frontend/.env.production` points to `http://gem-backend-service/api`.

Kubernetes deployment
1. Build and push images to a registry (replace `your-dockerhub-username` below):

```
# from backend/GemMarketplace.API
docker build -t your-dockerhub-username/gem-backend:latest .
docker push your-dockerhub-username/gem-backend:latest

# from frontend
docker build -t your-dockerhub-username/gem-frontend:latest .
docker push your-dockerhub-username/gem-frontend:latest
```

2. Apply k8s manifests (ensure kubecontext is correct):

```
kubectl apply -f k8s/
```

3. In-cluster DNS: frontend talks to backend using the service name `gem-backend-service`.

Tips
- If using Docker Compose in CI/CD, pass `VITE_API_URL` as a build arg for the frontend.
- When testing locally with Docker Compose the frontend build arg in `docker-compose.yml` sets `VITE_API_URL` to `http://backend-api/api` (the Compose service name).
