export function randomColour(): p5.Color {
  const palette = ["#5e9fa3", "#dcd1b4", "#fab87f", "#f87e7b", "#b05574"];
  return color(random(palette));
}
export type Palette = {
  terrain: TerrainPalette;
  boat: BoatPalette;
};
export type BoatPalette = {
  wood: string;
  sails: string;
};
export type TerrainPalette = {
  snow: string;
  rocks: string;
  grass: string;
  beach: string;
  water: {
    deepest: string;
    shallowest: string;
    medium: string;
    tropicalShallows: string;
  };
};

export function getPalette(): Palette {
  const palette: Palette = {
    terrain: {
      snow: "white",
      rocks: "gray",
      grass: "#1dc457",
      beach: "#debf77",
      water: {
        deepest: "#213e74",
        medium: "#1d65c4",
        shallowest: "#439df1",
        tropicalShallows: "turquoise",
      },
    },
    boat: {
      wood: "#98684a",
      sails: "#cec4b4",
    },
  };
  return palette;
}
