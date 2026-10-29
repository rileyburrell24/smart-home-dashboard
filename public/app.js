(async () => {
  try {
    const response = await fetch("/app.payload.b64?v=2.1.1", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load dashboard application");

    const encoded = (await response.text()).trim();
    const compressed = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("gzip"));
    const source = await new Response(stream).text();

    eval(source);
  } catch (error) {
    console.error("Dashboard bootstrap failed:", error);
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div class="offline-banner">Dashboard failed to start.</div>'
    );
  }
})();
