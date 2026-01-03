import { minBy, sortBy } from "es-toolkit/array";
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
  const sortedAgents = sortBy(state.agents, ["zDepth"]).reverse();
  sortedAgents.forEach(drawAgent);
}

export function animationHandleMousePressed(state: GlobalState) {
  const input: AgentInput = !keyIsDown(SHIFT) ? { id: "unleash" } : { id: "startReassign" };

  if (input.id === "startReassign") {
    //look for nearest in state idle
    const nearestAgent = findNearestAgent(
      state.agents.filter((a) => a.machine.currentState.name === "idle"),
      mousePos()
    );
    if (nearestAgent) {
      nearestAgent.machine.applyInput(input);
    }
  } else {
    //look for nearest in state acquiringTarget - we'll unleash it
    const nearestAgent = findNearestAgent(
      state.agents.filter(
        (a) =>
          a.machine.currentState.name === "acquiringTarget" ||
          a.machine.currentState.name === "idle"
      ),
      mousePos()
    );

    if (nearestAgent) {
      nearestAgent.machine.applyInput(input);
      //TODO: should be done through an enter-state fn
      if (input.id === "unleash") {
        startAnimateAgentSeek(nearestAgent);
      }
    }
  }
}

function findNearestAgent(agentsToSearch: Agent[], targetPos: p5.Vector) {
  return minBy(agentsToSearch, (a) => a.pos.dist(targetPos));
}
function mousePos(): p5.Vector {
  return createVector(mouseX, mouseY);
}
