export function evaluate<T, K, S>(machine: BranchMachine<T, K, S>, input: T, event: K, test: boolean = false): T {
  const memo = new Map<string, T>(); // Memoization map based on stringified input

  function recursiveEvaluate(
    currentMachine: BranchMachine<T, K, S>,
    currentInput: T,
    currentEvent: K,
    computed: { [key: string]: any } = {},
    depth: number = 0
  ): T {
    const memoKey = JSON.stringify({ input: currentInput, event: currentEvent }); // Use JSON.stringify to create a key

    // Check if the result is already cached
    if (memo.has(memoKey)) {
      if (test) console.log(`${'  '.repeat(depth)}[Cache] Returning cached result for input:`, currentInput);
      return memo.get(memoKey)!;
    }

    // Compute new values and merge with existing computed values
    const newComputed = currentMachine.compute ? { ...computed, ...currentMachine.compute(currentInput, currentEvent) } : computed;
    if (test) console.log(`${'  '.repeat(depth)}[Compute] Computed values:`, newComputed);

    // Find the matching branch based on eval(input)
    const switchValue = currentMachine.eval(currentInput);
    if (test) console.log(`${'  '.repeat(depth)}[Eval] Switch value for input`, currentInput, ":", switchValue);

    // Find the branch that matches the switch value
    const matchedBranch = currentMachine.on.find(branch => {
      if (typeof branch.value === 'function') {
        return (branch.value as (s: S, i: T) => boolean)(switchValue, currentInput);
      } else {
        return branch.value === switchValue;
      }
    });

    if (matchedBranch) {
      if (test) console.log(`${'  '.repeat(depth)}[Branch] Matched branch:`, matchedBranch.description || "[No Description]");
    } else if (currentMachine.default) {
      if (test) console.log(`${'  '.repeat(depth)}[Default] No matching branch found. Using default.`);
    } else {
      throw new Error(`No matching branch for switch value: ${switchValue}`);
    }

    // Evaluate the matched branch or the default branch
    const branchToEvaluate = matchedBranch ? matchedBranch.do : currentMachine.default!;
    const result = typeof branchToEvaluate === 'function'
      ? branchToEvaluate(currentInput, currentEvent, newComputed)
      : recursiveEvaluate(branchToEvaluate, currentInput, currentEvent, newComputed, depth + 1);

    if (test) console.log(`${'  '.repeat(depth)}[Result] Output for input`, currentInput, ":", result);

    // Cache the result and return it
    memo.set(memoKey, result);
    return result;
  }

  return recursiveEvaluate(machine, input, event);
}
