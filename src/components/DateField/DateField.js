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

   _initEventListeners() {
      this._$element.on('keypress', function(event) {
         let key = event.key;
         if (/[0-9]/.test(key)) {
            let value = this.value,
               position = this.selectionStart,
               insert = '';
            const data = compose (
               calculateValue,
               addKey,
               fixYear,
               fixMonthScdSymbol,
               fixMonthFirstSymbol,
               fixDayScdSymbol,
               fixDayFirstSymbol,
               pointify
            )({
               value,
               key,
               position,
               insert
            });
            if (data.submit) {
               this.value = data.value;
               this.setSelectionRange(data.shift, data.shift);
            }
         }
         return false;
      });
      this._$element.on('focus', function() {
         this.setSelectionRange(0, 0);
      });
      this._$element.on('paste', () => false);
   }
}