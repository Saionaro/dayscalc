import {
   compose
} from '../../utils/utils';
import {
   calculateValue,
   addKey,
   fixYear,
   fixMonthScdSymbol,
   fixMonthFirstSymbol,
   fixDayScdSymbol,
   fixDayFirstSymbol,
   pointify
} from '../../utils/dateReducers';
/**
 * Invokes composite handler for numbers input
 * @param {Object} data Object with full data about input
 * @return {Object} Descriptor with complete result of input
 */
const handleNumbers = data => {
   return compose (
      calculateValue,
      addKey,
      fixYear,
      fixMonthScdSymbol,
      fixMonthFirstSymbol,
      fixDayScdSymbol,
      fixDayFirstSymbol,
      pointify
   )({
      value: data.value,
      key: data.key,
      position: data.position,
      insert: ''
   });
};
/**
 * Handler for remove numbers
 * @param {Object} data Object with full data about input
 * @return {Object} Descriptor with complete result of input
 */
const handleBackspace = data => {
   let position = data.position;
   position -= data.value.charAt(position - 1) === '.' ? 2 : 1;
   let { value } = calculateValue({
      position: position,
      insert: ' ',
      value: data.value
   });
   return {
      submit: true,
      shift: position,
      value: value
   };
};
/**
 * Router for invokes handler functions
 * @param {Object} data Object with full data about input
 * @return {Object} Descriptor with complete result of input
 */
const routeHandlers = data => {
   if (/[0-9]/.test(data.key)) {
      return handleNumbers(data);
   } else if (data.keyCode === 8 && data.position) {
      return handleBackspace(data);
   } else {
      return {
         submit: false
      };
   }
};
/**
 * Internal constants list
 * @type {Object}
 */
const _$constants = {
   /**
    * Keycodes of keys, that not needs to disable
    * @type {Object}
    */
   ALLOWED_KEYCODES: {
      37: true,
      39: true,
      9: true,
      13: true
   }
};

export default class DateField {
   /**
    * jQuery-element of component
    * @type {Object}
    */
   _$element = null;

   constructor(opts) {
      this._$element = opts.element;
      this._$element.datepicker({
         autoClose: true,
         keyboardNav: false
      });
      this._initEventListeners();
   }
   /**
    * Initialize event handlers for input fields
    */
   _initEventListeners() {
      this._$element.on('keydown', function(event) {
         let keyCode = event.keyCode;
         const data = routeHandlers({
            keyCode,
            key: event.key,
            value: this.value,
            position: this.selectionStart
         });
         if (data.submit) {
            this.value = data.value;
            this.setSelectionRange(data.shift, data.shift);
         }
         return !!_$constants.ALLOWED_KEYCODES[keyCode];
      });
      this._$element.on('focus', function() {
         this.setSelectionRange(0, 0);
      });
      this._$element.on('paste', () => false);
   }
}