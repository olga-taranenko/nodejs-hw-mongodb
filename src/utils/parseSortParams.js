import { SORT_ORDER } from '../constants/index.js';

const parseSortBy = (value) => {
  if (typeof value !== 'string') {
    return '_id';
  }

  const keys = ['name'];

  if (keys.includes(value) !== true) {
    return '_id';
  }

  return value;
};

const parseSortOrder = (value) => {
  if (typeof value !== 'string') {
    return SORT_ORDER.ASC;
  }

  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(value) !== true) {
    return SORT_ORDER.ASC;
  }

  return value;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
