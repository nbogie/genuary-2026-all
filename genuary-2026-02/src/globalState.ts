import type { Agent } from "./Agent.ts";
import type { Config } from "./config.ts";

let globalState: GlobalState | undefined = undefined;

export interface GlobalState {
  countOfAnimations: number;
  agents: Agent[];
  config: Config;
}

export function getGlobalState(): GlobalState {
  if (!globalState) {
    throw new Error("no global state has been registered");
  }
  return globalState;
}

export function registerGlobalState(state: GlobalState) {
  globalState = state;
}
