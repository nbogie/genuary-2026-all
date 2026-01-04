export function randomColour(): p5.Color {
  const palette = ["#5e9fa3", "#dcd1b4", "#fab87f", "#f87e7b", "#b05574"];
  return color(random(palette));
}
export type Palette = {
  terrain: TerrainPalette;
  boat: BoatPalette;
};
export type BoatPalette = {
  wood: "brown";
  sail: "linen";
};
export type TerrainPalette = {
  grass: string;
  snow: string;
  water: {
    deepest: string;
    shallowest: string;
    medium: string;
    tropicalShallows: string;
  };
  beach: string;
};

export function getPalette(): Palette {
  const palette: Palette = {
    terrain: {
      grass: "green",
      snow: "white",
      water: {
        deepest: "navy",
        shallowest: "skyblue",
        medium: "dodgerblue",
        tropicalShallows: "turquoise",
      },
      beach: "yello",
    },
    boat: {
      wood: "brown",
      sail: "linen",
    },
  };
  return palette;
}
