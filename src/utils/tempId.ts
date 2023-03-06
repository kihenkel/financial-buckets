const TEMP_PREFIX = 'temp_';

export const isTempId = (id: string) => id.startsWith(TEMP_PREFIX); 

export const createTempId = () => {
  return `${TEMP_PREFIX}${String(Date.now())}`;
};
