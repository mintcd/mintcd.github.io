import { capitalizeFirstLetter, getTextWidth } from "@functions/text-analysis";

export function updateFilter(attrsByName: AttrsByName, action: FilterAction)
  : AttrsByName {
  const updatedAttrsByName = { ...attrsByName }
  // Enable the filter
  updatedAttrsByName[action.name].filter.enabled = true

  if (action.predicate) {
    let candidates = updatedAttrsByName[action.name].filter.predicates[action.predicate]
    // If there is no such predicate, add it as a new one
    if (candidates === undefined) {
      if (action.predicate === 'is')
        updatedAttrsByName[action.name].filter.predicates[action.predicate] = action.candidate ? [action.candidate] : []
      if (action.predicate === 'contains')
        updatedAttrsByName[action.name].filter.predicates[action.predicate] = action.candidate ? action.candidate : ""
    } else {
      if (action.candidate !== undefined) {
        // If there is no such candidate, add it as a new one
        if (action.predicate === 'is') {
          if (!candidates.includes(action.candidate)) {
            updatedAttrsByName[action.name].filter.predicates[action.predicate]?.push(action.candidate)
          } else {
            updatedAttrsByName[action.name].filter.predicates[action.predicate] =
              (candidates as string[]).filter(candidate => candidate !== action.candidate)
          }
        }

        if (action.predicate === 'contains') {
          updatedAttrsByName[action.name].filter.predicates[action.predicate] = action.candidate || ''
        }
      }
    }
  }
  return updatedAttrsByName
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
      suggestions: attr.type !== 'text'
        ? Array.from(new Set(data.flatMap(item => attr.referencing
          ? item[attr.referencing]
          : item[attr.name])))
          .sort() : [],
      filter: {
        enabled: false,
        predicates: {
          "is": [],
          "contains": ""
        }
      }
    }
  })
  return attrsByName;
}