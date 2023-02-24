import { ImportBucket } from '@/models';

const DELIMITER = ',';
const DELIMITER_PLACEHOLDER = '%_DELIMITER_%';

const replaceDelimiters = (str: string): string => 
  str.split('"')
    .map((part, index) => index % 2 === 0 ? part : part.replace(new RegExp(DELIMITER, 'g'), DELIMITER_PLACEHOLDER))
    .join('"');

const sanitizeValue = (value: string) => {
  return value.replace(/[^0-9,.-]/g, '');
};

export const convertCsvToJson = (content: string, delimiter: string = DELIMITER): ImportBucket[] => {
  const lines = content.split('\n');
  if (!lines?.length) return [];

  return lines.reduce((currentList, line, indexLine) => {
    const sanitizedLine = replaceDelimiters(line);
    const cells = sanitizedLine.split(delimiter).map(cell => cell.replace(new RegExp(DELIMITER_PLACEHOLDER, 'g'), DELIMITER));
    if (indexLine === 0) {
      return cells.map((cell) => ({ name: cell.trim(), transactionAmounts: [] }));
    }
    return currentList.map((bucketJson, indexCell) => {
      const cellValue = cells[indexCell];
      if (!cellValue) return bucketJson;
      const number = Number.parseFloat(sanitizeValue(cellValue));
      if (isNaN(number)) return bucketJson;
      return {
        ...bucketJson,
        transactionAmounts: [
          ...bucketJson.transactionAmounts,
          number
        ]
      };
    });
  }, [] as ImportBucket[]);
};
