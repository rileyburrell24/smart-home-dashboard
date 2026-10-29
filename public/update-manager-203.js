// v2.0.3 update experience patch. Runs in the same eval scope as the dashboard core.
const automaticUpdateTimeRow203 = document.getElementById("automaticUpdateTimeRow");
const automaticUpdateTime203 = document.getElementById("automaticUpdateTime");
const updateCheckingPanel203 = document.getElementById("updateCheckingPanel");
const upToDatePanel203 = document.getElementById("upToDatePanel");
const upToDateText203 = document.getElementById("upToDateText");
const updateAvailablePanel203 = document.getElementById("updateAvailablePanel");
const availableVersionTitle203 = document.getElementById("availableVersionTitle");
const returnToDashboardButton203 = document.getElementById("returnToDashboardButton");

async function refreshDashboardVersion203() {
  try {
    const versionData = await jsonFetch(`/api/version?t=${Date.now()}`);
    if (settingsDashboardVersion) settingsDashboardVersion.textContent = versionData.version || "Unknown";

    const updateData = await jsonFetch(`/api/update/status?t=${Date.now()}`);
    latestUpdateInfo = updateData;

    if (automaticUpdatesToggle) automaticUpdatesToggle.checked = Boolean(updateData.automaticUpdatesEnabled);
    if (automaticUpdateTime203) automaticUpdateTime203.value = updateData.automaticUpdateTime || "03:00";
    if (automaticUpdateTimeRow203) automaticUpdateTimeRow203.hidden = !Boolean(updateData.automaticUpdatesEnabled);

    if (updateData.scheduledUpdateAt) {
      githubUpdateStatus.textContent = `Update scheduled for ${new Date(updateData.scheduledUpdateAt).toLocaleString("en-GB")}.`;
    } else if (updateData.error) {
      githubUpdateStatus.textContent = `${updateData.error} · Repository: ${updateData.repository}`;
    } else if (updateData.updating) {
      githubUpdateStatus.textContent = `Installing ${updateData.targetVersion || "update"}…`;
    } else if (updateData.updateAvailable) {
      githubUpdateStatus.textContent = `Version ${updateData.latestVersion} is available from GitHub.`;
    } else {
      githubUpdateStatus.textContent = `You are up to date · ${updateData.repository}`;
    }

    updateDashboardButton.disabled = Boolean(updateData.updating);
    updateDashboardButton.textContent = updateData.updating ? "Updating…" : "Check for Updates";
  } catch (err) {
    githubUpdateStatus.textContent = `Could not check for updates: ${err.message}`;
    updateDashboardButton.textContent = "Check Again";
    updateDashboardButton.disabled = false;
  }
}

refreshDashboardVersion = refreshDashboardVersion203;

async function showUpdateResult203(status) {
  latestUpdateInfo = status;
  updateCheckingPanel203.hidden = true;
  upToDatePanel203.hidden = true;
  updateAvailablePanel203.hidden = true;

  if (!status.updateAvailable) {
    updateOverlayTitle.textContent = "You’re up to date";
    updateVersionSummary.textContent = `Installed version ${status.currentVersion}`;
    upToDateText203.textContent = `Smart Home Dashboard ${status.currentVersion} is the latest version available.`;
    upToDatePanel203.hidden = false;
    return;
  }

  updateOverlayTitle.textContent = `Version ${status.latestVersion} available`;
  updateVersionSummary.textContent = `Installed ${status.currentVersion} · Latest ${status.latestVersion}`;
  availableVersionTitle203.textContent = `Smart Home Dashboard ${status.latestVersion}`;
  updateAvailablePanel203.hidden = false;

  if (status.scheduledUpdateAt) {
    scheduledUpdateStatus.textContent = `Scheduled for ${new Date(status.scheduledUpdateAt).toLocaleString("en-GB")}`;
    scheduleUpdateAt.value = localDateTimeValue(status.scheduledUpdateAt);
    cancelScheduledUpdateButton.hidden = false;
  } else {
    scheduledUpdateStatus.textContent = "";
    cancelScheduledUpdateButton.hidden = true;
    const d = new Date(Date.now() + 60 * 60 * 1000);
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
    scheduleUpdateAt.value = localDateTimeValue(d.toISOString());
  }

  releaseNotesContent.textContent = "Loading release notes…";
  try {
    const response = await fetch(`/api/update/release-notes/${encodeURIComponent(status.latestVersion)}?t=${Date.now()}`, { cache: "no-store" });
    renderReleaseNotes(await response.text());
  } catch (err) {
    releaseNotesContent.textContent = `Release notes unavailable: ${err.message}`;
  }
}

async function checkForUpdates203() {
  updateOverlay.hidden = false;
  document.body.classList.add("overlay-open");
  updateOverlayTitle.textContent = "Checking for updates…";
  updateVersionSummary.textContent = "Connecting to GitHub…";
  updateCheckingPanel203.hidden = false;
  upToDatePanel203.hidden = true;
  updateAvailablePanel203.hidden = true;

  try {
    const status = await jsonFetch(`/api/update/status?t=${Date.now()}`);
    await showUpdateResult203(status);
  } catch (err) {
    updateCheckingPanel203.hidden = true;
    upToDatePanel203.hidden = false;
    updateOverlayTitle.textContent = "Could not check for updates";
    updateVersionSummary.textContent = err.message;
    upToDateText203.textContent = "Please try again later.";
  }
}

async function saveAutomaticUpdatePreferences203() {
  if (!adminSession) {
    automaticUpdatesToggle.checked = !automaticUpdatesToggle.checked;
    showToast("Unlock Administrator Settings to change Automatic Updates");
    adminPinInput.focus();
    return;
  }

  try {
    automaticUpdatesToggle.disabled = true;
    const config = await saveUpdatePreferences({
      automaticUpdatesEnabled: automaticUpdatesToggle.checked,
      automaticUpdateTime: automaticUpdateTime203?.value || "03:00"
    });
    automaticUpdatesToggle.checked = Boolean(config.automaticUpdatesEnabled);
    automaticUpdateTimeRow203.hidden = !Boolean(config.automaticUpdatesEnabled);
    showToast(config.automaticUpdatesEnabled ? "Automatic Updates enabled" : "Automatic Updates disabled");
  } catch (err) {
    automaticUpdatesToggle.checked = !automaticUpdatesToggle.checked;
    showToast(`Could not change Automatic Updates: ${err.message}`);
  } finally {
    automaticUpdatesToggle.disabled = false;
    await refreshDashboardVersion203();
  }
}

async function saveAutomaticUpdateTime203() {
  if (!adminSession) {
    showToast("Unlock Administrator Settings to change the automatic update time");
    return;
  }
  const value = automaticUpdateTime203.value;
  if (!/^([01]\\d|2[0-3]):[0-5]\\d$/.test(value)) {
    showToast("Choose a valid update time");
    return;
  }
  try {
    await saveUpdatePreferences({ automaticUpdatesEnabled: automaticUpdatesToggle.checked, automaticUpdateTime: value });
    showToast(`Automatic updates will install at ${value}`);
    await refreshDashboardVersion203();
  } catch (err) {
    showToast(`Could not save update time: ${err.message}`);
  }
}

updateDashboardButton.addEventListener("click", event => {
  event.preventDefault();
  event.stopImmediatePropagation();
  checkForUpdates203();
}, true);

automaticUpdatesToggle.addEventListener("change", event => {
  event.stopImmediatePropagation();
  saveAutomaticUpdatePreferences203();
}, true);

if (automaticUpdateTime203) automaticUpdateTime203.addEventListener("change", saveAutomaticUpdateTime203);
if (returnToDashboardButton203) {
  returnToDashboardButton203.addEventListener("click", () => {
    updateOverlay.hidden = true;
    settingsOverlay.hidden = true;
    document.body.classList.remove("overlay-open");
  });
}
