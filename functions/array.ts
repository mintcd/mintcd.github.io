import { range } from "lodash";

export function getElementsWithIndex(arr: any[], predicate: (ele: any) => boolean) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      result.push([arr[i], i])
    }
  }
  return result
}

export function toObject<T extends object>(arr: T[], key: keyof T): { [key: string]: T } {
  // Check if all elements have the specified key
  arr.forEach(ele => {
    if (ele[key] === undefined) {
      throw new Error(`${JSON.stringify(ele)} does not have key ${String(key)}`);
    }
  });

  // Initialize the object to store the result
  const arrByKey: { [key: string]: T } = {};

  arr.forEach(ele => {
    arrByKey[String(ele[key])] = ele;
  });

  return arrByKey;
}

export function filterObject<T extends object>(
  obj: T,
  predicate: (key: keyof T, value: T[keyof T]) => boolean
): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(key as keyof T, value as T[keyof T]))
  ) as T
}


export function containsSameElements(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  const sortedArr1 = arr1.sort()
  const sortedArr2 = arr2.sort()

  for (const i in range(0, sortedArr1.length)) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }
  return true
}
