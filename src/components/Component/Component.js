/**
 * Base class for cards
 */
export default class Component {
   /**
    * jQuery-element of component
    * @type {Object}
    */
   _$element = null;
   /**
    * Animation in progress
    * @type {Boolean}
    */
   _isErrorAnimation = false;
   /**
    * Constructor of component
    */
   constructor(opts) {
      this._$element = opts.element;
      let dateFields = this._$element.find('.dc-date');
      dateFields.datepicker({
         autoClose: true
      });
      this._initDateMask(dateFields);
   }

   _initDateMask(inputs) {
      inputs.on('keypress', function(event) {
         if(/[0-9]/.test(event.key)) {
            const vallen = this.value.length;
            if(vallen === 2 || vallen === 5) {
               this.value += '.';
            }
            return true;
         }
         return false;
      });
   }
   /**
    * Makes element hightlighted by red light
    * @param {Object} element jQ element
    */
   redLight(element) {
      if(!element._isErrorAnimation) {
         element._isErrorAnimation = true;
         element.addClass('dc--error');
         setTimeout(_ => {
            element._isErrorAnimation = false;
            element.removeClass('dc--error');
         }, 1000);
      }
   }
}