# Smart Home Dashboard

An accessible, dark-mode smart-home wall-panel dashboard for Raspberry Pi, powered by Home Assistant.

## Highlights

- Whole-house room dashboard with filtered useful devices
- Accessible high-contrast wall-panel interface
- Philips Hue/light controls and whole-house All On / All Off
- Sonos, TV and media-player controls
- Dedicated Hive thermostat control with temperature slider
- Administrator-PIN-protected Hive Boost
- Ring/Home Assistant camera view with snapshot fallback
- Doorbell pop-up workflow and supported siren controls
- Live Home Assistant weather in the header and standby screen
- Five-minute low-brightness standby screen
- Administrator Settings with room visibility/order controls
- Automatic GitHub update checking and one-button Docker update installation

## Requirements

- Raspberry Pi or another Docker host
- Docker + Docker Compose
- Home Assistant reachable from the Docker host
- Home Assistant long-lived access token

## Quick start

1. Copy `.env.example` to `.env`.
2. Set `HA_URL` and `HA_TOKEN`.
3. Confirm `DASHBOARD_HOST_DIR` matches the host project folder.
4. Run:

```bash
docker compose up -d --build
```

Open the dashboard at `http://<docker-host>:8088`.

## Security

Never commit `.env`. It contains your Home Assistant token.

The repository intentionally ignores:
- `.env`
- administrator PIN data
- dashboard-specific saved layout configuration

Administrator PINs are stored as scrypt hashes, not plaintext.

## Updates

The Settings screen checks the repository configured by `GITHUB_REPO` and `GITHUB_BRANCH`.

When a newer semantic version is found in `package.json`, an administrator can install it from Settings. The updater:

1. downloads the configured GitHub branch,
2. validates the package,
3. preserves `.env` and `data/`,
4. replaces application files,
5. rebuilds the Docker service,
6. waits for the new version,
7. refreshes the panel.

The Docker socket is mounted so the dashboard can rebuild its own container. Keep this dashboard restricted to your trusted local network.

## Current version

2.1.1

## License

Personal project by Riley Burrell.

## Update manager

Version 2.0.1 adds optional automatic updates, GitHub-hosted release notes, Update Now / Update Later choices, and persistent scheduled updates.


### 2.0.2 updater bootstrap fix

Fixed self-update path handling inside Docker. Application files are now written through the `/host-dashboard` bind mount while Docker Compose still receives the real host path.


### 2.0.3 update experience

Check for Updates now opens a full-screen status view immediately. Automatic Updates are enabled by default and can use a preferred local install time.


### 2.1.0

Redesigned Settings with categories, responsive typography/icons and persistent dashboard themes.


### 2.1.1

Fixes GitHub 403 update checks and adds a main-dashboard Update Available indicator.
