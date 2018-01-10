import DateField from '../DateField/DateField';
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

   _$dateFields = [];
   /**
    * Constructor of component
    */
   constructor(opts) {
      this._$element = opts.element;
      let fields = this._$dateFields,
         dateFields = this._$element.find('.dc-date');
      dateFields.each(function() {
         fields.push(new DateField({
            element: jQuery(this)
         }));
      });
   }
   /**
    * Makes element hightlighted by red light
    * @param {Object} element jQ element
    */
   redLight(element) {
      if (!element._isErrorAnimation) {
         element._isErrorAnimation = true;
         element.addClass('dc--error');
         setTimeout(() => {
            element._isErrorAnimation = false;
            element.removeClass('dc--error');
         }, 1000);
      }
   }
}