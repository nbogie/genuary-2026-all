export type Transition<StateT, InputT> = { from: StateT; input: InputT; to: StateT };

export interface StateMachine<StateT, InputT> {
  allTransitions: { input: InputT; from: StateT; to: StateT }[];
  currentState: StateT;
  applyInput: (input: InputT) => { isLegal: true; nextState: StateT } | { isLegal: false };
}

export function createStateMachine<StateT, InputT extends { id: string }>(
  startingState: StateT,
  transitions: Transition<StateT, InputT>[]
) {
  let machine: StateMachine<StateT, InputT>;

  function applyInput(input: InputT): { isLegal: true; nextState: StateT } | { isLegal: false } {
    const firstMatchingTransition = transitions.find(
      (t) => t.input.id === input.id && t.from === machine.currentState
    );
    if (!firstMatchingTransition) {
      return { isLegal: false };
    }
    const nextState = firstMatchingTransition.to;
    machine.currentState = nextState;
    return { isLegal: true, nextState };
  }

  machine = {
    allTransitions: transitions,
    currentState: startingState,
    applyInput,
  };
  return machine;
}
