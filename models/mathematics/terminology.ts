export default [
  {
    name: `chi-square test`,
    definition: ``,
    fields: [`statistics`],
    parents: []
  },
  {
    name: `null set`,
    definition: ``,
    fields: [`measure-theory`],
    parents: []
  },
  {
    name: `statistic`,
    definition: ``,
    fields: [`statistics`],
    parents: [`function`]
  },
  {
    name: `continuous function`,
    definition: ``,
    fields: [`real-analysis`],
    subcategories: [`real-analysis`],
    parents: [`function`]
  },
  {
    name: `norm`,
    definition: ``,
    fields: [`real-analysis`, `linear-algebra`],
    subcategories: [`real-analysis`],
    parents: [`function`, `triangle inequality`, `positive semidefiniteness`, `homogeneity`]
  },
  {
    name: `inner product space`,
    definition: ``,
    fields: [`analysis`, `linear-algebra`],
    subcategories: [`real-analysis`],
    parents: [`dot product`]
  },
  {
    name: `convex combination`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`real-analysis`, `convex analysis`],
    parents: [`convexity`]
  },
  {
    name: `convexity`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`real-analysis`, `convex analysis`]
  },
  {
    name: `unit sphere`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`real-analysis`]
  },
  {
    name: `unit ball`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`real-analysis`]
  },
  {
    name: `box`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`real-analysis`]
  },
  {
    name: `triangle inequality`,
    definition: ``,
    fields: [`linear-algebra`, `analysis`],
    subcategories: [`real-analysis`]
  },
  {
    name: `positive (semi)definiteness`,
    definition: ``,
    fields: [`linear-algebra`, `analysis`],
    subcategories: [`real-analysis`]
  },
  {
    name: `dot product`,
    definition: ``,
    fields: [`linear-algebra`, `analysis`],
    subcategories: [`real-analysis`]
  },
  {
    name: `interval`,
    definition: ``,
    fields: [`algebra`, `analysis`],
  },
  {
    name: `translation`,
    definition: ``,
    fields: [`algebra`, `analysis`],
  },
  {
    name: `trichotomy`,
    definition: ``,
    fields: [`algebra`],
  },
  {
    name: `symmetry`,
    definition: ``,
    fields: [`algebra`],
  },
  {
    name: `associativity`,
    definition: ``,
    fields: [`algebra`],
  },
  {
    name: `rational cut`,
    definition: ``,
    fields: [`analysis`],
    parents: [`Dedekind cut`]
  },
  {
    name: `Dedekind cut`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `equivalence class`,
    definition: ``,
    fields: [`algebra`]
  },
  {
    name: `equivalence relation`,
    definition: ``,
    fields: [`algebra`]
  },
  {
    name: `class`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `difference`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `symmetric difference`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `disjoint sets`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `singleton set`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `empty set`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `sigma algebra`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `Borel sigma algebra`,
    definition: ``,
    fields: [`analysis`],
    parents: [`open set`]
  },
  {
    name: `topological space`,
    definition: ``,
    fields: [`topology`]
  },
  {
    name: `open set`,
    definition: ``,
    fields: [`topology`]
  },
  {
    name: `intersection`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `union`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `complement`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `set difference`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `disjoint`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `De Morgan's Laws`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `measure`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `measure space`,
    definition: ``,
    fields: [`analysis`],
    parents: [`measurable space`]
  },
  {
    name: `well - ordering property`,
    definition: ``,
    fields: [`set theory`, `algebra`],
  },
  {
    name: `counting measure`,
    definition: ``,
    fields: [`analysis`],
    parents: [`measure`]
  },
  {
    name: `Dirac measure`,
    definition: ``,
    fields: [`analysis`],
    parents: [`measure`]
  },
  {
    name: `upper bound`,
    definition: ``,
    fields: [`analysis`],
    parents: [`order`]
  },
  {
    name: `ordered field`,
    definition: ``,
    fields: [`algebra`, `analysis`],
    parents: [`order`, `field`]
  },
  {
    name: `Archimedian property`,
    definition: ``,
    fields: [`algebra`, `analysis`],
    parents: [`order`, `field`]
  },
  {
    name: `triangle inequality`,
    definition: ``,
    fields: [`algebra`, `analysis`],
    parents: [`absolute value`]
  },
  {
    name: `least upper bound`,
    definition: ``,
    fields: [`analysis`],
    parents: [`upper bound`]
  },
  {
    name: `Lebesgue measure`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`measure theory`],
    parents: [`measure`]
  },
  {
    name: `measurable space`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`measure theory`],
  },
  {
    name: `random variable`,
    definition: ``,
    fields: [`probability - theory`],
    subcategories: [],
  },
  {
    name: `distribution function`,
    definition: ``,
    fields: [`probability - theory`],
  },
  {
    name: `expectation`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`],
    parents: [`random variable`]
  },
  {
    name: `Bernoulli distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `Poisson distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `multinomial distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `uniform distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `exponential distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `multinomial distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `Gamma distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `chi - square distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `normal distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `joint distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`],
  },
  {
    name: `marginal distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`],
  },
  {
    name: `binomial distribution`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`, `probability distribution`],
  },
  {
    name: `variance`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`],
  },
  {
    name: `Borel function`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`probability theory`],
  },
  {
    name: `measurable set`,
    definition: ``,
    fields: [`analysis`],
    subcategories: [`measure theory`],
  },
  {
    name: `discrete random variable`,
    definition: `a random variable which takes a finite or countably number of values with strictly positive probability`,
    fields: [`analysis`],
    subcategories: [`probability theory`],
    parents: [`random variable`]
  },
  {
    name: `continuous random variable`,
    definition: `a random variable whose distribution function is continuous`,
    fields: [`analysis`],
    subcategories: [`probability theory`],
    parents: [`random variable`]
  },
  {
    name: `absolutely continuous random variable`,
    definition: `a random variable with Borel measurable density function`,
    fields: [`analysis`],
    subcategories: [`probability theory`],
    parents: [`continuous random variable`]
  },
  {
    name: `power set`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `subset`,
    definition: ``,
    fields: [`set theory`]
  },
  {
    name: `vector space`,
    definition: ``,
    fields: [`linear-algebra`]
  },
  {
    name: `Vitali set`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `probability measure`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `probability space`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `conditional probability`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `independent events`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `measurable map`,
    definition: ``,
    fields: [`analysis`],
    parents: [`map`]
  },
  {
    name: `map`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `event`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `indicator function`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `metric space`,
    definition: ``,
    fields: [`analysis`]
  },
  {
    name: `Cauchy sequence`,
    definition: `A sequence $\\{ u_n\\ }$ of real numbers is called Cauchy if
    $$\\forall \\epsilon > 0, \\exists N\\in\\mathbb{ N }, \\forall m, n > N, | u_n - u_m | <\\epsilon.$$`,
    fields: [`analysis`],
    subcategories: [`real-analysis`],
  },
] as Term[]