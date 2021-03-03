/* eslint-disable no-console */
export const config = {
  SERVER_LINK: '',
};

export const getConfig = async () => {
  try {
    const configFile = await fetch('/config.json').then(res => res.json());
    Object.assign(config, configFile);
  } catch (err) {
    console.log(err);
  }
};
