export function playClick() {
  const enabled = localStorage.getItem("innox_sounds");
  if (enabled === "false") return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    const volume = Math.max(0, Math.min(100, Number(localStorage.getItem("innox_volume") ?? 100))) / 100;
    g.gain.value = 0.0018 * volume;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.frequency.value = 660;
    }, 60);
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 160);
  } catch (e) {}
}

export function playBootChime() {
  const enabled = localStorage.getItem("innox_sounds");
  if (enabled === "false") return;

  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o1.type = "sine";
    o2.type = "sine";
    o1.frequency.value = 440;
    o2.frequency.value = 660;
    const volume = Math.max(0, Math.min(100, Number(localStorage.getItem("innox_volume") ?? 100))) / 100;
    g.gain.value = 0.0025 * volume;
    o1.connect(g);
    o2.connect(g);
    g.connect(ctx.destination);
    o1.start();
    setTimeout(() => o2.start(), 80);
    setTimeout(() => {
      o1.stop();
      o2.stop();
      ctx.close();
    }, 700);
  } catch (e) {}
}
