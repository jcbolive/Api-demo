export const queryParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  new URL(url).searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};
