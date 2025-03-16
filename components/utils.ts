// export function evaluate<T, K>(machine: BranchMachine<T, K>, input: T): K {
//   const memo = new Map<T, K>();

//   if (memo.has(input)) return memo.get(input)!;

//   const result = machine.predicate(input)
//     ? (typeof machine.yes === 'function' ? machine.yes(input) : evaluate(machine.yes, input))
//     : (typeof machine.no === 'function' ? machine.no(input) : evaluate(machine.no, input));

//   memo.set(input, result);
//   return result;
// }
