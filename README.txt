Riley Smart Home Dashboard — Version 2.0.0

Major addition:
- Real GitHub update checking and installation from rileyburrell24/smart-home-dashboard.
- Administrator PIN required to install updates.
- Updater preserves .env, administrator PIN data and dashboard layout.
- Docker socket + host project directory are mounted so the dashboard can rebuild itself.
- Settings reports installed/latest versions and automatically refreshes after a successful update.

IMPORTANT:
The GitHub repository must exist and contain this source before automatic updates can work.

Deploy:
  cd /DATA/AppData/smarthome-dashboard
  sudo docker compose down
  sudo unzip -o /tmp/smarthome-dashboard-v2.0-github-updater.zip -d /DATA/AppData/smarthome-dashboard
  sudo docker compose up -d --build

Verify:
  curl http://127.0.0.1:8088/api/health

Expected:
  "version":"2.0.0"
  "homeAssistantConnected":true
