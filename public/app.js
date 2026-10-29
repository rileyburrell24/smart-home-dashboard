(async () => {
  try {
    const [coreResponse, patchResponse] = await Promise.all([
      fetch("/app.payload.b64?v=2.0.1", { cache: "no-store" }),
      fetch("/update-manager-203.js?v=2.0.3", { cache: "no-store" })
    ]);
    if (!coreResponse.ok) throw new Error("Could not load dashboard application");
    if (!patchResponse.ok) throw new Error("Could not load dashboard update manager");

    const encoded = (await coreResponse.text()).trim();
    const compressed = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
    const source = await new Response(stream).text();
    const patch = await patchResponse.text();

    eval(source + "\n" + patch);
  } catch (error) {
    console.error("Dashboard bootstrap failed:", error);
    document.body.insertAdjacentHTML("afterbegin", '<div class="offline-banner">Dashboard failed to start.</div>');
  }
})();