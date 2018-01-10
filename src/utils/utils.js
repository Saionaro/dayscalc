/**
 * Helper functions
 */
const DATE_REGEX = /(\d{2})\.(\d{2})\.(\d{4})/;
/**
 * Make date human readable
 * @param {Date} date Date for transforming
 * @return {String}
 */
export const humanizeDate = date => {
   let day = date.getDate();
   if (day < 10) {
      day = `0${day}`;
   }
   let month = date.getMonth() + 1;
   if (month < 10) {
      month = `0${month}`;
   }
   return `${day}.${month}.${date.getFullYear()}`;
};
/**
 * From human-readable string to Date
 * @param {String} date Date for transforming
 * @return {Date}
 */
export const dehumanizeDate = date => {
   return new Date(date.replace(DATE_REGEX, '$2/$1/$3'));
};
/**
 * Get current date (without hours, mins, scds)
 * @return {Date}
 */
export const getRoundCurrentTime = () => {
   let date = new Date();
   date.setHours(0);
   date.setMinutes(0);
   date.setSeconds(0);
   date.setMilliseconds(0);
   return date;
};
/**
 * Calculate calendar days delta
 * @param {Date} fst Start date
 * @param {Date} scd End date
 * @param {Object} includes Object like {from: Boolean, to: Boolean}
 * @return {Number}
 */
export const getDaysDelta = (fst, scd, includes) => {
   let diff = scd.getTime() - fst.getTime(),
      delta = 0;
   includes.from && delta++;
   includes.to && delta++;
   return ((diff / 1000 / 60 / 60 / 24) - 1) + delta;
};
/**
 * Calculate work days delta
 * @param {Date} fst Start date
 * @param {Date} scd End date
 * @param {Object} includes Object like {from: Boolean, to: Boolean}
 * @return {Number}
 */
export const getWorkDaysDelta = (fst, scd, includes) => {
   let curr = includes.from ? new Date(fst) : fst.addDay(),
      finish = includes.to ? scd.addDay() : new Date(scd),
      diff = 0;
   while (curr.getTime() !== finish.getTime()) {
      if (!curr.isHoliday()) {
         diff++;
      }
      curr = curr.addDay();
   }
   return diff;
};
/**
 * Calctulate calendar days range
 * @param {Date} date Start date
 * @param {Number} days Count days for calc
 * @param {Boolean} include Include start day or not
 * @return {Date}
 */
export const getDateAfterDays = (date, days, include) => {
   let count = 0,
      res = include ? new Date(date) : date.addDay();
   while (++count < days) {
      res = res.addDay();
   }
   return res;
};
/**
 * Calctulate work days range
 * @param {Date} date Start date
 * @param {Number} days Count days for calc
 * @param {Boolean} include Include start day or not
 * @return {Date}
 */
export const getDateAfterWorkDays = (date, days, include) => {
   let count = 0,
      res = include ? new Date(date) : date.addDay(),
      buferDate = include ? new Date(date) : date.addDay();
   while (count < days) {
      if (!buferDate.isHoliday()) {
         count++; 
         res = new Date(buferDate);
      }
      buferDate = buferDate.addDay();
   }
   return res;
};
/**
 * Calculate right "padej" for rus lang
 * @param {Number} count Count for calcutale "padej"
 * @param {Object} cases Object like {nom: 'час', gen: 'часа', plu: 'часов'}
 * @return {String}
 */
export const getPadej = (count, cases) => {
   let num = Math.abs(count),
      word = '';
   if (num.toString().indexOf('.') > -1) {
      word = cases.gen;
   } else { 
      word = (
         num % 10 == 1 && num % 100 != 11 ? cases.nom
            : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) 
               ? cases.gen
               : cases.plu
      );
   }
   return word;
};
/**
 * Function composition
 * @params {Function} Any count
 * @return {Function}
 */
export const compose = function() {
   const count = arguments.length;
   let i = -1,
      reducers = [];
   while (i++ < count) {
      reducers.push(arguments[i]);
   }
   return function(initial) {
      let result = initial,
         i = count;
      while (i--) {
         result = reducers[i](result);
      }
      return result;
   };
};