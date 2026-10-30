(async () => {
  try {
    const names = ["app.payload.1", "app.payload.2", "app.payload.3", "app.payload.4"];
    const parts = await Promise.all(names.map(async name => {
      const response = await fetch(`/${name}?v=2.2.0`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Could not load ${name}`);
      return (await response.text()).trim();
    }));

    const compressed = Uint8Array.from(atob(parts.join("")), c => c.charCodeAt(0));
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
