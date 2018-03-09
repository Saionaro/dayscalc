/* eslint-env node */
/**
 * Converts data from
 * http://data.gov.ru/opendata/7708660670-proizvcalendar
 */
const fs = require('fs'),
   Converter = require('csvtojson').Converter,
   converter = new Converter({}),
   MOHTHS_DCIT = {
      1: 'Январь',
      2: 'Февраль',
      3: 'Март',
      4: 'Апрель',
      5: 'Май',
      6: 'Июнь',
      7: 'Июль',
      8: 'Август',
      9: 'Сентябрь',
      10: 'Октябрь',
      11: 'Ноябрь',
      12: 'Декабрь'
   };
/**
 * Read data from csv-file
 * @return {Promise}
 */
function getData() {
   return new Promise((win, fail) => {
      converter.fromFile(process.argv[2], (err, result) => {
         if (err) {
            return fail(err);
         } else {
            return win(result);
         }
      });
   });
}
/**
 * Converts data from data.gov (csv) to json
 * @param {Array} data Parsed CSV
 * @return {Object}
 */
function convertData(data) {
   let convertedData = {
      data: {}
   };
   data.forEach(item => {
      let yearData = {};
      for (let i = 1; i < 13; i++) {
         let monthData = {},
            holidays = item[MOHTHS_DCIT[i]];
         holidays.split(',').forEach(num => {
            if (!/\*/.test(num)) {
               // eslint-disable-next-line no-useless-escape
               monthData[+num.replace('\*', '')] = {
                  isWorking: 2
               };
            }
         });
         yearData[i] = monthData;
      }
      convertedData.data[item['Год/Месяц']] = yearData;
   });
   return convertedData;
}
/**
 * Save data to json-file
 * @param {Object} data Data to serialize and write
 */
function saveData(data) {
   fs.writeFile('./dates.json', JSON.stringify(data), res => {
      if (!res) {
         // eslint-disable-next-line no-console
         console.log('Done!');
      } else {
         // eslint-disable-next-line no-console
         console.log('FATAL!', res);
      }
   });
}
// eslint-disable-next-line no-console
console.log('Starts...');

if (!process.argv[2]) {
   // eslint-disable-next-line no-console
   console.log('FATAL! Path to CSV-file is required!');
   return;
}

getData().then(data => {
   return saveData(convertData(data));
});