import { useState } from "react";

export function createFactory<T extends object>(objOrCallback: T | (() => T)): Factory<T> {
  const initialObject = typeof objOrCallback === "function"
    ? (objOrCallback as () => T)()
    : objOrCallback;

  const [_obj, dispatch] = useState(initialObject);

  return {
    // Initially copy over all keys and values from the input object
    ..._obj,
    get: () => _obj,
    set: (key: keyof T, value: T[keyof T]) => {
      dispatch((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
  } as Factory<T>;
}
