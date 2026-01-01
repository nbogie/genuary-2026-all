export function randomColour(): p5.Color {
  const palette = ["#5e9fa3", "#dcd1b4", "#fab87f", "#f87e7b", "#b05574"];
  return color(random(palette));
}

export function getPalette() {
  // return {
  //   colors: ["rgb(85.442% 38.496% 6.9659%)", "rgb(23.924% 20.801% 22.311%)"],
  //   background: "rgb(14.968% 13.28% 12.473%)",
  // };
  return {
    colors: ["white", "linen"],
    background: "#1e1e1e",
  };
}

export function getBackgroundColour(): p5.Color {
  return color(getPalette().background);
}

export function getTreeColour(): p5.Color {
  return color(getPalette().colors[0]);
}
