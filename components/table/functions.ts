import { AttrProps, FilterAction } from "./types";
import { capitalizeFirstLetter, getTextWidth } from "@functions/text-analysis";

export function updateFilter(attrsByName: { [key: string]: AttrProps }, action: FilterAction)
  : { [key: string]: AttrProps } {
  const updatedAttrsByName = { ...attrsByName }
  // Enable the filter
  updatedAttrsByName[action.name]["filterEnabled"] = true

  if (action.predicate) {
    let candidates = updatedAttrsByName[action.name]['filter'][action.predicate]
    // If there is no such predicate, add it as a new one
    if (candidates === undefined) {
      updatedAttrsByName[action.name]['filter'][action.predicate] = action.candidate ? [action.candidate] : []
    } else {
      if (action.candidate) {
        // If there is no such candidate, add it as a new one

        if (!candidates.includes(action.candidate)) {
          updatedAttrsByName[action.name]['filter'][action.predicate]?.push(action.candidate)
        } else {
          updatedAttrsByName[action.name]['filter'][action.predicate] = candidates.filter(candidate => candidate !== action.candidate)
        }
      }
    }
  }
  return updatedAttrsByName
}

export function filterData(data: DataItem[], attrsByName: { [key: string]: AttrProps }): DataItem[] {
  return data.filter(item => (
    Object.keys(attrsByName).every((attrName) => {
      if (attrsByName[attrName].filterEnabled === false) return true

      return Object.entries(attrsByName[attrName]['filter']).every(([predName, candidates]) => {
        if (predName === 'is') {
          // If there are no candidates, return true
          if (candidates.length === 0) return true;

          // Ensure item[attrName] exists and is an array before checking
          if (Array.isArray(item[attrName])) {
            // Return true if any value in item[attrName] is included in candidates
            return item[attrName].some((value: string) => candidates.includes(value));
          }

          // If item[attrName] is not an array, return false
          return false;
        }

        // If other predicates are added later, handle them here
        return true; // Default return true if no predicates are matched
      });
    })
  ));
}

export function sortData(data: DataItem[], attrName: string, direction: 'asc' | 'desc' | 'none') {
  if (direction === 'none') {
    return data;
  }

  const sortedData = [...data].sort((a: DataItem, b: DataItem) => {
    const aValue = a[attrName];
    const bValue = b[attrName];
    const isEmptyOrNull = (val: any) => val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0);

    if (direction === 'asc') {
      if (isEmptyOrNull(aValue)) return 1;
      return aValue > bValue ? 1 : -1;
    } else {
      if (isEmptyOrNull(bValue)) return 1;
      return aValue < bValue ? 1 : -1;
    }
  });

  return sortedData;
}

export function initializeAttrsByName(attrs: AttrProps[], data: DataItem[]): { [key: string]: AttrProps } {
  const attrsByName: { [key: string]: AttrProps } = {}
  attrs.forEach((attr, index) => {
    attrsByName[attr.name] = {
      ...attr,
      width: Math.min(Math.max(Math.max(...data.map(item => getTextWidth(String(item[attr.name])))), 100), 200),
      order: index,
      hidden: false,
      display: capitalizeFirstLetter(attr.name),
      sort: 'none',
      suggestions: Array.from(new Set(data.flatMap(item => attr.referencing
        ? item[attr.referencing]
        : item[attr.name])))
        .sort(),
      filter: function () {
        if (attr.type === 'multiselect') {
          return {
            "is": []
          }
        }
        else if (attr.type === 'text') {
          return {
            "contains": []
          }
        }
        else {
          throw new Error("Unknown type")
        }
      }(),
      filterEnabled: false
    }
  })
  return attrsByName;
}