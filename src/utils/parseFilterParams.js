const parseContactType = (value) => {
  if (typeof value !== 'string') return undefined;

  const isType = (value) => ['work', 'home', 'personal'].includes(value);

  if (isType(value)) return value;
};

const parseIsFavourite = (value) => {
  if (typeof value !== 'string') return undefined;

  const isFavourite = (value) => ['true', 'false'].includes(value);

  if (isFavourite(value)) return value;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
};
