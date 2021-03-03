import { config } from '../config';

export default async (route, type, data) => {
  const path = `${config.SERVER_LINK}${route}`;
  try {
    let response;
    if (type === 'POST') {
      response = await fetch(path, {
        method: type,
        body: data ? JSON.stringify(data) : '',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
      });
    } else {
      response = await fetch(path);
    }
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  } catch (err) {
    throw err;
  }
};
