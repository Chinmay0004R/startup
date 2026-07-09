# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





----------------------------------------------------------------
# Hospital Management

A small hospital management web application with a FastAPI backend and a React + Vite frontend.

## Project structure

- `startup/backend/` - FastAPI backend service
- `startup/frontend/` - React frontend application

## Backend

The backend is implemented with FastAPI and exposes APIs under `/api/v1`.

### Key files

- `startup/backend/app/main.py` - FastAPI application entrypoint
- `startup/backend/app/core/config.py` - application settings
- `startup/backend/app/api/v1/` - API route modules
- `startup/backend/requirements.txt` - Python dependencies

### Run backend

1. Open a terminal in `startup/backend`
2. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```
3. Start the app:
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. Visit `http://127.0.0.1:8000/` to verify the backend is running.

### Environment variables

Optional variables can be set for production or local configuration:

- `DEBUG` - enable debug mode (`True` / `False`)
- `DATABASE_URL` - database connection string
- `SECRET_KEY` - application secret key

## Frontend

The frontend is built with React, Vite, and Tailwind CSS.

### Key files

- `startup/frontend/package.json` - npm dependencies and scripts
- `startup/frontend/src/` - React source files
- `startup/frontend/src/components/` - UI components
- `startup/frontend/src/pages/` - page views

### Run frontend

1. Open a terminal in `startup/frontend`
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Open `http://localhost:5173/` in your browser.

## Notes

- The frontend is configured to communicate with the backend at `http://localhost:8000` via CORS.
- API routes are prefixed with `/api/v1`.

## Testing

The backend contains tests under `startup/backend/tests/`. If you want to run them, install `pytest` and execute from `startup/backend`:

```powershell
python -m pip install pytest
pytest
```

