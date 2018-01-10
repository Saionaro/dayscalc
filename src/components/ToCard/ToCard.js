/**
 * Implements logic and view for calculating date after some days
 */
import Component from '../Component/Component';
import {
   getDateAfterDays,
   getDateAfterWorkDays,
   humanizeDate,
   dehumanizeDate,
   getRoundCurrentTime
} from '../../utils/utils';

export default class ToCard extends Component {
   /**
    * Event switch card handler
    * @type {Function}
    */
   _$onSwitch = null;
   /**
    * Event apply operation handler
    * @type {Function}
    */
   _$onSubmit = null;
   /**
    * State-container
    * @type {Object}
    */
   _$state = {
      from: getRoundCurrentTime(),
      days: 1
   };
   /**
    * Child items refs
    * @type {Object}
    */
   _$children = {
      from: null,
      days: null
   };
   /**
    * @override
    */
   constructor(opts) {
      super(opts);
      this._$onSwitch = opts.onSwitch;
      this._$onSubmit = opts.onSubmit;
      this._$element.find('.dc-button--submit').click(this._$onSubmit.bind(this, this));
      this._$element.find('.dc-button--switch').click(this._$onSwitch.bind(this, false));
      this._initFields();
      let children = this._$children;
      this._$children.days.on('keydown', function(event) {
         if (event.key === 'Tab') {
            children.from.focus();
            return false;
         }
      });
   }
   /**
    * Verify card complection
    * @return {Boolean}
    */
   validate() {
      let {from, days} = this._getLastestState();
      if (!from.isValid()) {
         return this._alert('from');
      }
      if (!days || days < 1) {
         return this._alert('days');
      }
      return true;
   }
   /**
    * Animate panel shift with hide or show
    * @param {Boolean} up Show or hide control
    */
   switchPosition(up) {
      this._$element.css('opacity', up ? '1' : '0');
      this._$element.css('transform', up ? 'translateY(-200px)' : 'translateY(0px)');
   }
   /**
    * Returns result of calculating deltas
    * @return {String} resulting HTML-code
    */
   getResult() {
      let {from, days} = this._$state,
         includes = this._getCheckboxStatus(),
         simpleDate = getDateAfterDays(from, days, includes.from),
         workDate = getDateAfterWorkDays(from, days, includes.from);
      return this._generateHTML(simpleDate, workDate);
   }
   /**
    * Child controls initializations
    */
   _initFields() {
      this._$children.from = this._$element.find('.dc-to__from-datebox');
      this._$children.days = this._$element.find('.dc-to__days');
      this._$children.from.val(humanizeDate(this._$state.from));
      this._$children.days.val(this._$state.days);
   }
   /**
    * Calculate actual state and returns it
    * @return {Object}
    */
   _getLastestState() {
      this._$state.from = dehumanizeDate(this._$children.from.val());
      this._$state.days = parseInt(this._$children.days.val(), 10);
      return this._$state;
   }
   /**
    * Generates HTML-code of calc result
    * @param {Number} calendarValue Count of regular days between dates
    * @param {Number} workValue Count of work days between dates
    * @return {String}
    */
   _generateHTML(calendarValue, workValue) {
      return [
         `<div>Будет ${humanizeDate(calendarValue)}, если указаны календарные дни.</div>`,
         `<div>Будет ${humanizeDate(workValue)}, если указаны рабочие дни.</div>`
      ].join('');
   }
   /**
    * Release red hightlighs for specific controls
    * @param {String} whatBad Childs for highlith
    * @return {Boolean} Always false, bcs its error-handler
    */
   _alert(whatBad) {
      if (/from/.test(whatBad)) {
         this.redLight(this._$children.from);
      } else {
         this.redLight(this._$children.days);
      }
      return false;
   }
   /**
    * Retuns current checkboxies (include-exclude days) status
    * @return {Object}
    */
   _getCheckboxStatus() {
      return {
         from: this._$element.find('#dc-to__from-checkbox').is(':checked')
      };
   }
}