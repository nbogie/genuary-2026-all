export interface Config {
  shouldDrawStateName: boolean;
  shouldDrawZDepth: boolean;
  shouldDrawDestinations: boolean;
  numberOfAgents: number;
}

let globalConfig: Config | undefined = undefined;

export function createDefaultConfig(): Config {
  return {
    shouldDrawStateName: false,
    shouldDrawZDepth: false,
    shouldDrawDestinations: false,
    numberOfAgents: 200,
  };
}
export function getGlobalConfig(): Config {
  if (!globalConfig) {
    throw new Error("no global config has been registered");
  }
  return globalConfig;
}

export function registerGlobalConfig(config: Config) {
  globalConfig = config;
}
