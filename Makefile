.PHONY: help dev dev-backend dev-frontend test build docker-up docker-down

help:
	@echo "ScholarSwarm CLI Commands:"
	@echo "  make dev-backend   - Run FastAPI backend (http://localhost:8000)"
	@echo "  make dev-frontend  - Run React Vite frontend (http://localhost:5173)"
	@echo "  make test          - Run full pytest test suite"
	@echo "  make build         - Compile frontend production bundle"
	@echo "  make docker-up     - Run entire system with Docker Compose"
	@echo "  make docker-down   - Stop Docker Compose containers"

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

dev-frontend:
	cd frontend && npm run dev

test:
	python -m pytest backend/tests -v

build:
	cd frontend && npm run build

docker-up:
	docker compose up --build

docker-down:
	docker compose down
