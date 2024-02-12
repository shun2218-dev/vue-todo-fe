export const API_URL = (pathname: string, options = {}): string => {
  const baseURL =
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_BASE_URL_DEV
      : import.meta.env.VITE_API_BASE_URL;
  const url = new URL(`${baseURL}${pathname}`);
  if (Object.keys(options).length > 0) {
    const params = new URLSearchParams(options);
    return `${url}?${params}`;
  }
  return url.toString();
};
