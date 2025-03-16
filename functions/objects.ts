import { useState, useMemo } from "react";

export function createFactory<T extends object>(
  objOrCallback: T | (() => T)
): Factory<T> {
  const initialObject = typeof objOrCallback === "function"
    ? (objOrCallback as () => T)()
    : objOrCallback;

  const [_obj, dispatch] = useState<T>(initialObject);

  // Memoize the setters to avoid recalculating them on each render
  const setters = useMemo(() => {
    return Object.keys(_obj).reduce((acc, key) => {
      const typedKey = key as keyof T;
      const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}`; // e.g., setName, setAge

      acc[setterName] = (value: T[typeof typedKey] | ((prev: T[typeof typedKey]) => T[typeof typedKey])) => {
        dispatch((prev) => {
          if (typeof value === "function") {
            // If value is a function, update the specific key in the state
            const updatedValue = (value as (prevState: T[typeof typedKey]) => T[typeof typedKey])(prev[typedKey]);
            return {
              ...prev,
              [typedKey]: updatedValue,
            };
          } else {
            // Otherwise, update the specific key-value pair
            return {
              ...prev,
              [typedKey]: value,
            };
          }
        });
      };
      return acc;
    }, {} as Record<string, Function>);
  }, [_obj]); // Dependency on _obj so setters are re-calculated only when _obj changes

  // Return the object with both original values and dynamically created setters
  return {
    get: () => _obj,
    ..._obj,
    ...setters,
  } as Factory<T>;
}
