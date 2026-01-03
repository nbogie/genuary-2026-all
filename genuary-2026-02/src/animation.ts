import { createAgents, drawAgent, updateAgent, type Agent, type AgentInput } from "./Agent.ts";
import { randomScreenPos } from "./utils.ts";

export interface GlobalState {
  agents: Agent[];
}

export function setupAnimation() {
  const agents = createAgents(5);
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
      const input: AgentInput = keyIsDown(SHIFT) ? { id: "startReassign" } : { id: "click" };
      const result = ag.machine.applyInput(input);
      //TODO: handle this as an on-state-entry callback
      if (result.isLegal && ag.machine.currentState.name === "acquiringTarget") {
        ag.dest = randomScreenPos();
      }
      console.log({ result });
    }
  });
}
