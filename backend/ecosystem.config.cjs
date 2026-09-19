module.exports = {
  apps: [
    {
      name: "smart-attendance-backend",
      cwd: "/home/jarvis/workspace/projects/full_stack/Smart-Attandance-System/backend",
      script: ".venv/bin/uvicorn",
      args: "main:app --host 0.0.0.0 --port 8006",
      interpreter: "none",
      env: {
        PYTHONUNBUFFERED: "1",
      },
    },
  ],
};
