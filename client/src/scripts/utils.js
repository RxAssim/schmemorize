export const SERVER_URL = "http://localhost:8111/";

const isDev = process.env.NODE_ENV === "development";

export const getImage = name => {
  let prefix = "";
  if (isDev) prefix = "http://localhost:8111";
  return fetch(`${prefix}/png/${name}/300`);
};
