import p5 from "p5";
import { createStateMachine, type StateMachine, type Transition } from "./stateMachine.ts";
import { collect, randomScreenPos } from "./utils.ts";

export function drawAgent(agent: Agent) {
  push();
  translate(agent.pos);

  rectMode(CENTER);
  fill("linen");
  rect(0, 0, 100, 30);

  textAlign(CENTER, CENTER);
  fill(30);
  text(agent.machine.currentState.name, 0, 0);
  pop();
}

export function createAgents(numAgents: number) {
  return collect(numAgents, createOneAgent);
}

export interface Agent {
  pos: p5.Vector;
  dest: p5.Vector;
  machine: StateMachine<AgentState, AgentInput>;
}
function createOneAgent(): Agent {
  //TODO: these should be readonly
  const startingState: AgentState = { name: "idle" } as const;
  const seekState: AgentState = { name: "seek" } as const;
  const acquiringTargetState: AgentState = { name: "acquiringTarget" } as const;

  const transitions: Transition<AgentState, AgentInput>[] = [
    { from: startingState, input: { id: "click" }, to: seekState },
    { from: seekState, input: { id: "startReassign" }, to: acquiringTargetState },
    { from: acquiringTargetState, input: { id: "click" }, to: seekState },
  ];
  const machine = createStateMachine(startingState, transitions);

  const agent: Agent = {
    pos: randomScreenPos(),
    dest: randomScreenPos(),
    machine,
  };

  (agent as any).machine = machine;

  return agent;
}
export function updateAgent(agent: Agent): void {
  switch (agent.machine.currentState.name) {
    case "idle":
      agent.pos.add(p5.Vector.random2D().mult(0.2));
      break;
    case "seek":
      agent.pos.lerp(agent.dest, 0.1);
      break;

    default:
      break;
  }
}

export type AgentState = { name: "idle" } | { name: "seek" } | { name: "acquiringTarget" };

export type AgentInput =
  | {
      id: "click";
    }
  | {
      id: "startReassign";
    };
