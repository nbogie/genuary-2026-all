import {
  createAgents,
  drawAgent,
  startAnimateAgentSeek,
  updateAgent,
  type Agent,
  type AgentInput,
} from "./Agent.ts";
import { createDefaultConfig, registerGlobalConfig, type Config } from "./config.ts";

export interface GlobalState {
  agents: Agent[];
  config: Config;
}

export function setupAnimation(): GlobalState {
  const config = createDefaultConfig();
  registerGlobalConfig(config);
  const agents = createAgents(config.numberOfAgents);
  const state = { agents, config };
  return state;
}

export function updateAnimation(state: GlobalState) {
  state.agents.forEach(updateAgent);
}

export function drawAnimation(state: GlobalState) {
  state.agents.forEach(drawAgent);
}

export function animationHandleMousePressed(state: GlobalState) {
  const firstAgentInRange = state.agents.find(
    (agent: Agent) => agent.pos.dist(createVector(mouseX, mouseY)) < 70
  );
  if (firstAgentInRange) {
    const input: AgentInput = !keyIsDown(SHIFT) ? { id: "unleash" } : { id: "startReassign" };
    firstAgentInRange.machine.applyInput(input);
    //TODO: should be done through an enter-state fn
    if (input.id === "unleash") {
      startAnimateAgentSeek(firstAgentInRange);
    }
  }
}
