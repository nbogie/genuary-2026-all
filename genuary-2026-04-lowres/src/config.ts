export type Config = {
  lighting: {
    eerieAmbientLightEnabled: boolean;
    blueTopLightEnabled: boolean;
    pinkAmbientLightEnabled: boolean;
    whiteDirectionalLightEnabled: boolean;
  };
};
export function createConfig(): Config {
  return {
    lighting: {
      blueTopLightEnabled: true,
      eerieAmbientLightEnabled: true,
      pinkAmbientLightEnabled: false,
      whiteDirectionalLightEnabled: false,
    },
  };
}
