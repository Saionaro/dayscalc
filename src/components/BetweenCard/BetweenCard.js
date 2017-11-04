/**
 * Implements logic and view for calculating deltas between two dates
 */
import Component from '../Component/Component';
import {
   getDaysDelta,
   getWorkDaysDelta,
   getPadej,
   humanizeDate,
   dehumanizeDate,
   getRoundCurrentTime
} from '../../utils/utils';

export default class BetweenCard extends Component {
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
      from: '',
      to: getRoundCurrentTime().addDay()
   };
   /**
    * Child items refs
    * @type {Object}
    */
   _$children = {
      from: null,
      to: null
   };
   /**
    * @override
    */
   constructor(opts) {
      super(opts);
      this._$onSwitch = opts.onSwitch;
      this._$onSubmit = opts.onSubmit;
      this._$element.find('.dc-button--submit').on('click', this._$onSubmit.bind(this, this));
      this._$element.find('.dc-button--switch').on('click', this._$onSwitch.bind(this, true));
      this._initFields();
      let children = this._$children;
      this._$children.to.on('keydown', function(event) {
         if(event.key === 'Tab') {
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
      var {from, to} = this._getLastestState();
      if(!from.isValid() && !to.isValid()) {
         return this._alert('all');
      }
      if(!from.isValid()) {
         return this._alert('from');
      }
      if(!to.isValid()) {
         return this._alert('to');
      }
      if(!to.isAfter(from)) {
         return this._alert('all');
      }
      return true;
   }
   /**
    * Animate panel shift with hide or show
    * @param {Boolean} up Hide or show control
    */
   switchPosition(up) {
      this._$element.css('opacity', up ? '0' : '1');
      this._$element.css('transform', up ? 'translateY(-200px)' : 'translateY(0px)');
   }
   /**
    * Returns result of calculating deltas
    * @return {String} resulting HTML-code
    */
   getResult() {
      let {from, to} = this._$state,
         includes = this._getCheckboxStatus(),
         simpleDays = getDaysDelta(from, to, includes),
         workDays = getWorkDaysDelta(from, to, includes);
      return this._generateHTML(simpleDays, workDays);
   }
   /**
    * Child controls initializations
    */
   _initFields() {
      this._$children.from = this._$element.find('.dc-between__from-datebox');
      this._$children.to = this._$element.find('.dc-between__to-datebox');
      this._$children.to.val(humanizeDate(this._$state.to));
   }
   /**
    * Calculate actual state and returns it
    * @return {Object}
    */
   _getLastestState() {
      this._$state.from = dehumanizeDate(this._$children.from.val());
      this._$state.to = dehumanizeDate(this._$children.to.val());
      return this._$state;
   }
   /**
    * Generates HTML-code of calc result
    * @param {Number} calendarValue Count of regular days between dates
    * @param {Number} workValue Count of work days between dates
    * @return {String}
    */
   _generateHTML(calendarValue, workValue) {
      let res = [];
      if(calendarValue === 0) {
         res.push('<div>Нет календарных дней между датами.</div>');
      } else {
         let calendDays = getPadej(calendarValue, {
            nom: 'календарный',
            gen: 'календарных',
            plu: 'календарных'
         }),
         days = getPadej(calendarValue, {
            nom: 'день',
            gen: 'дня',
            plu: 'дней'
         });
         res.push(`<div>${calendarValue} ${calendDays} ${days} между датами.</div>`);
      }
      if(workValue === 0) {
         res.push('<div>Нет рабочих дней между датами.</div>');
      } else {
         let works = getPadej(workValue, {
            nom: 'рабочий',
            gen: 'рабочих',
            plu: 'рабочих'
         }),
         days = getPadej(workValue, {
            nom: 'день',
            gen: 'дня',
            plu: 'дней'
         });
         res.push(`<div>${workValue} ${works} ${days} между датами.</div>`);
      }
      return res.join('');
   }
   /**
    * Release red hightlighs for specific controls
    * @param {String} whatBad Childs for highlith
    * @return {Boolean} Always false, bcs its error-handler
    */
   _alert (whatBad) {
      if(/from/.test(whatBad)) {
         this.redLight(this._$children.from);
      } else if(/to/.test(whatBad)) {
         this.redLight(this._$children.to);
      } else {
         this.redLight(this._$element.find('.dc-date'));
      }
      return false;
   }
   /**
    * Retuns current checkboxies (include-exclude days) status
    * @return {Object}
    */
   _getCheckboxStatus() {
      return {
         from: this._$element.find('#dc-between__from-checkbox').is(':checked'),
         to: this._$element.find('#dc-between__to-checkbox').is(':checked')
      };
   }
}