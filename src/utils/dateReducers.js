/**
 * Date field-inpurts transformers
 */
/**
 * Adds dot if needs
 * @param {Object} stats Input state
 * @return {Object}
 */
export const pointify = stats => {
   let newStats;
   const isDotPosition = stats.position === 2 ||
      stats.position === 5;
   if (isDotPosition) {
      newStats = Object.assign({}, stats);
      if (newStats.value.charAt(newStats.position) !== '.') {
         newStats.insert += '.';
      }
      newStats.position++;
   }
   return newStats || stats;
};
/**
 * Change first number of day, if its more then "3".
 * @param {Object} stats Input state
 * @return {Object}
 */
export const fixDayFirstSymbol = stats => {
   let newStats;
   if (
      stats.position === 0 &&
      +stats.key > 3
   ) {
      newStats = Object.assign({}, stats);
      newStats.key = '3';
   }
   return newStats || stats;
};
/**
 * Change secod number of day, if first is "1"
 * @param {Object} stats Input state
 * @return {Object}
 */
export const fixDayScdSymbol = stats => {
   let newStats;
   if (
      stats.position === 1 &&
      stats.value.charAt(0) === '3' &&
      +stats.key > 1
   ) {
      newStats = Object.assign({}, stats);
      newStats.key = '1';
   }
   return newStats || stats;
};
/**
 * If at first month number inputs num more the 1,
 * adds leading zero
 * @param {Object} stats Input state
 * @return {Object}
 */
export const fixMonthFirstSymbol = stats => {
   let newStats;
   if (
      stats.position === 3 &&
      +stats.key > 1
   ) {
      newStats = Object.assign({}, stats);
      newStats.insert += '0';
   }
   return newStats || stats;
};
/**
 * Change second month number to "2" - if
 * first month num is "1" and inputed more then "2"
 * @param {Object} stats Input state
 * @return {Object}
 */
export const fixMonthScdSymbol = stats => {
   let newStats;
   if (
      stats.position === 4 &&
      stats.value.charAt(3) === '1' &&
      +stats.key > 2
   ) {
      newStats = Object.assign({}, stats);
      newStats.key = '2';
   }
   return newStats || stats;
};
/**
 * Change second num of year if inputs not "2"
 * @param {Object} stats Input state
 * @return {Object}
 */
export const fixYear = stats => {
   let newStats;
   if (
      stats.position === 6 &&
      +stats.key !== 2
   ) {
      newStats = Object.assign({}, stats);
      newStats.key = '2';
   }
   return newStats || stats;
};
/**
 * Adds inputed number
 * @param {Object} stats Input state
 * @return {Object}
 */
export const addKey = stats => {
   let newStats = Object.assign({}, stats);
   newStats.insert += stats.key;
   return newStats;
};
/**
 * Generate final date value after user input
 * @param {Object} stats Input state
 * @return {Object}
 */
export const calculateValue = stats => {
   let submit = false,
      shift,
      value;
   if (stats.position !== 10) {
      submit = true;
      shift = stats.position + stats.insert.length;
      let head = stats.value.substr(0, stats.position),
         tail = stats.value.substr(shift);
      value = head + stats.insert + tail;
   }
   return {
      shift,
      value,
      submit
   };
};