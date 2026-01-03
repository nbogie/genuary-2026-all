import { createAgents, drawAgent, updateAgent, type Agent, type AgentInput } from "./Agent.ts";

export interface GlobalState {
  agents: Agent[];
}

export function setupAnimation() {
  const agents = createAgents(50);
  const state = { agents };
  return state;
}

export function updateAnimation(state: GlobalState) {
  state.agents.forEach(updateAgent);
}

export function drawAnimation(state: GlobalState) {
  state.agents.forEach(drawAgent);
}

export function animationHandleMousePressed(state: GlobalState) {
  state.agents.forEach((ag: Agent) => {
    const d = ag.pos.dist(createVector(mouseX, mouseY));
    if (d < 70) {
      const input: AgentInput = keyIsDown(SHIFT) ? { id: "unleash" } : { id: "startReassign" };
      ag.machine.applyInput(input);
    }
  });
}
