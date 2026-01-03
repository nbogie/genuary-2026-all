import p5 from "p5";
import { createStateMachine, type StateMachine, type Transition } from "./stateMachine.ts";
import { collect, randomScreenPos } from "./utils.ts";

export interface Agent {
  pos: p5.Vector;
  dest: p5.Vector;
  facing: number;
  phase: number;
  machine: StateMachine<AgentState, AgentInput>;
  size: number;
}

export function drawAgent(agent: Agent) {
  if (agent.dest) {
    push();
    translate(agent.dest);
    noFill();
    stroke(agent.machine.currentState.name === "seek" ? "magenta" : "gray");
    const targetDiam = map(sin(agent.phase + millis() / 100), -1, 1, 5, 15, true);
    circle(0, 0, targetDiam);
    pop();
  }
  push();
  translate(agent.pos);
  rotate(agent.facing);
  rectMode(CENTER);
  fill("linen");
  rect(0, 0, agent.size, agent.size * 0.3);

  textAlign(CENTER, CENTER);
  fill(30);
  textSize((16 * agent.size) / 80);
  text(agent.machine.currentState.name, 0, 0);
  pop();
}

export function createAgents(numAgents: number) {
  return collect(numAgents, createOneAgent);
}
function createOneAgent(): Agent {
  //TODO: these should be readonly
  const startingState: AgentState = { name: "idle" } as const;
  const seekState: AgentState = { name: "seek" } as const;
  const acquiringTargetState: AgentState = { name: "acquiringTarget" } as const;

  const transitions: Transition<AgentState, AgentInput>[] = [
    { from: startingState, input: { id: "unleash" }, to: seekState },
    { from: startingState, input: { id: "startReassign" }, to: acquiringTargetState },
    { from: seekState, input: { id: "noteArrival" }, to: startingState },
    { from: acquiringTargetState, input: { id: "unleash" }, to: seekState },
  ];
  const machine = createStateMachine(startingState, transitions);

  const agent: Agent = {
    pos: randomScreenPos(),
    dest: randomScreenPos(),
    facing: random(TWO_PI),
    machine,
    phase: random(TWO_PI),
    size: random(30, 50),
  };

  (agent as any).machine = machine;

  return agent;
}
export function updateAgent(agent: Agent): void {
  switch (agent.machine.currentState.name) {
    case "idle":
      agent.pos.add(p5.Vector.random2D().mult(0.2));
      if (random() < 0.001) {
        agent.machine.applyInput({ id: "startReassign" });
      }

      break;
    case "seek":
      agent.pos.lerp(agent.dest, 0.1);
      turnAgentTowardsDest(agent);
      if (agent.pos.dist(agent.dest) < 20) {
        agent.machine.applyInput({ id: "noteArrival" });
        agent.dest = randomScreenPos();
      }
      break;
    case "acquiringTarget":
      if (random() < 0.02) {
        agent.dest = randomScreenPos();
      }
      if (random() < 0.0001) {
        agent.machine.applyInput({ id: "unleash" });
      }
      turnAgentTowardsDest(agent);

      break;

    default:
      break;
  }
}

export type AgentState = { name: "idle" } | { name: "seek" } | { name: "acquiringTarget" };

export type AgentInput =
  | {
      id: "unleash";
    }
  | {
      id: "startReassign";
    }
  | {
      id: "noteArrival";
    };

function turnAgentTowardsDest(agent: Agent) {
  const vecToDest = p5.Vector.sub(agent.dest, agent.pos);
  agent.facing = lerp(agent.facing, vecToDest.heading(), 0.03);
}
