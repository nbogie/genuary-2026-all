import { gsap } from "gsap";
import p5 from "p5";
import { getGlobalConfig } from "./config.ts";
import { createStateMachine, type StateMachine, type Transition } from "./stateMachine.ts";
import { collect, randomScreenPos } from "./utils.ts";

export interface Agent {
  pos: p5.Vector;
  dest: p5.Vector;
  /** 1 means normal, less than one is squished, up to a max of 0. more than one is stretched. */
  squishOrStretch: number;
  facing: number;
  opacity: number;
  /** lower numbers are nearer the screen */
  zDepth: number;
  phase: number;
  machine: StateMachine<AgentState, AgentInput>;
  size: number;
}

export function drawAgent(agent: Agent) {
  const config = getGlobalConfig();

  if (config.shouldDrawDestinations && agent.dest) {
    push();
    translate(agent.dest);
    noFill();
    stroke(agent.machine.currentState.name === "seek" ? "magenta" : "gray");
    const targetDiam = map(sin(agent.phase + millis() / 300), -1, 1, 10, 12, true);
    circle(0, 0, targetDiam);
    pop();
  }
  push();
  translate(agent.pos);
  rotate(agent.facing);
  rectMode(CENTER);
  // const colour = color("linen");
  // colour.setAlpha(agent.opacity * 255);

  fill(agent.opacity * 255);

  const standardAspectRatio = 3;
  const targetArea = agent.size * (agent.size / standardAspectRatio);
  const wRest = sqrt(targetArea * standardAspectRatio);
  const hRest = wRest / standardAspectRatio;

  const w = wRest * agent.squishOrStretch;
  const h = hRest / agent.squishOrStretch;

  rect(0, 0, w, h);

  if (config.shouldDrawStateName || config.shouldDrawZDepth) {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize((16 * agent.size) / 80);
    const msg = [
      config.shouldDrawStateName ? agent.machine.currentState.name : "",
      config.shouldDrawZDepth ? agent.zDepth : "",
    ].join(" ");
    text(msg, 0, 0);
  }
  pop();
}

export function createAgents(numAgents: number) {
  return collect(numAgents, createOneAgent);
}
function createOneAgent(): Agent {
  //TODO: these should be readonly
  const idleState: AgentState = { name: "idle" } as const;
  const seekState: AgentState = { name: "seek" } as const;
  const acquiringTargetState: AgentState = { name: "acquiringTarget" } as const;

  const transitions: Transition<AgentState, AgentInput>[] = [
    { from: idleState, input: { id: "unleash" }, to: seekState },
    { from: idleState, input: { id: "startReassign" }, to: acquiringTargetState },
    { from: seekState, input: { id: "noteArrival" }, to: idleState },
    { from: acquiringTargetState, input: { id: "unleash" }, to: seekState },
  ];
  const machine = createStateMachine(idleState, transitions);

  const agent: Agent = {
    pos: randomScreenPos(),
    dest: randomScreenPos(),
    facing: random(TWO_PI),
    opacity: 0.3,
    squishOrStretch: 1,
    zDepth: floor(random(50, 150)),
    machine,
    phase: random(TWO_PI),
    size: random(30, 50),
  };

  return agent;
}
export function updateAgent(agent: Agent): void {
  switch (agent.machine.currentState.name) {
    case "idle":
      if (random() < 0.001) {
        agent.machine.applyInput({ id: "startReassign" });
      }

      break;
    case "seek":
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
        const result = agent.machine.applyInput({ id: "unleash" });
        if (result.isLegal) {
          startAnimateAgentSeek(agent);
        }
      }
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

export function startAnimateAgentSeek(agent: Agent) {
  const vecToDest = p5.Vector.sub(agent.dest, agent.pos);
  //top of pile
  agent.zDepth = 0;
  const timeline = gsap.timeline();
  //fade up opacity to be seen (staging)
  timeline.to(agent, { opacity: 1, duration: 0.5 });
  //rotate to face destination
  timeline.to(agent, { facing: vecToDest.heading(), duration: 0.3 });

  const recoilTarget = p5.Vector.add(agent.pos, vecToDest.copy().normalize().rotate(PI).setMag(30));

  //anticipatory drawback
  timeline.to(agent.pos, {
    x: recoilTarget.x,
    y: recoilTarget.y,
    delay: 0.5,
    duration: 0.5,
    // ease: "elastic.inOut",
  });
  //squishing during drawback
  timeline.to(agent, { squishOrStretch: 0.5, duration: 0.3 }, "<");

  //fly foward
  timeline.to(agent.pos, {
    x: agent.dest.x,
    y: agent.dest.y,
    duration: 1,
    // ease: "elastic.inOut",
  });

  //stretch during first part of fly-forward
  timeline.to(agent, { squishOrStretch: 1.3, duration: 0.125 }, "<");

  timeline.to(agent, { squishOrStretch: 1, duration: 0.6 }, "-=0.6");

  timeline.to(agent, { opacity: 0.3, duration: 0.5 });
  timeline.to(agent, { zDepth: floor(random(50, 150)) });
}
