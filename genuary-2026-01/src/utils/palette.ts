export function getPalette() {
  const palettes = [
    {
      colors: ["rgb(85.442% 38.496% 6.9659%)", "rgb(23.924% 20.801% 22.311%)"],
      background: "rgb(14.968% 13.28% 12.473%)",
    },
    {
      colors: ["white", "linen"],
      background: "#1e1e1e",
    },
  ];
  return palettes[1];
}

export function getBackgroundColour(): p5.Color {
  return color(getPalette().background);
}

export function getTreeColour(): p5.Color {
  return color(getPalette().colors[0]);
}
