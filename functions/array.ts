export function getElementsWithIndex(arr: any[], predicate: (ele: any) => boolean) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      result.push([arr[i], i])
    }
  }
  return result
}