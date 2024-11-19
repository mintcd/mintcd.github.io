import { useState } from "react";

export function createFactory<T extends object>(obj: T): Factory<T> {
  const [_obj, dispatch] = useState(obj)
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
  } as Factory<T>
}
