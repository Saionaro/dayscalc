/**
 * Root component, implements interactions between other components 
 */
import BetweenCard from '../BetweenCard/BetweenCard';
import ToCard from '../ToCard/ToCard';
import Answer from '../Answer/Answer';

import './App.less';
import 'air-datepicker';
import 'air-datepicker/dist/css/datepicker.css';

export default class App {
   /**
    * State-container
    * @type {Object}
    */
   _$state = {
      mode: 'between'
   };
   /**
    * Child items refs
    * @type {Object}
    */
   _$children = {
      betweenCard: null,
      toCard: null,
      answerCard: null
   };
   /**
    *
    */
   constructor(opts) {
      this._$children.betweenCard = new BetweenCard({
         element: opts.element.find('.dc-card--between'),
         onSwitch: ::this._onSwitch,
         onSubmit: ::this._onSubmit
      });
      this._$children.toCard = new ToCard({
         element: opts.element.find('.dc-card--to'),
         onSwitch: ::this._onSwitch,
         onSubmit: ::this._onSubmit
      });
      this._$children.answerCard = new Answer({
         element: opts.element.find('.dc-answer')
      });
      this._initListeners();
   }
   /**
    * Subscribes dom events for shortcutting (enter, esc)
    */
   _initListeners() {
      document.body.addEventListener('keydown', event => {
         if (event.keyCode === 13) {
            this._onSubmit (
               this._$state.mode === 'between' ?
                  this._$children.betweenCard
                  :
                  this._$children.toCard
            );
         }
         if (event.keyCode === 27) {
            this._$children.answerCard.toggle(false);
         }
      });
   }
   /**
    * Switch-handler
    * @param {Boolean} flag Up or down animation
    */
   _onSwitch(flag) {
      this._$children.betweenCard.switchPosition(flag);
      this._$children.toCard.switchPosition(flag);
      this._$children.answerCard.toggle(false);
      this._$state.mode = flag ? 'to' : 'between';
   }
   /**
    * Apply handler. Invoke validate card, then show answer panel
    * @param {Object} card Between or to card
    */
   _onSubmit(card) {
      if (card.validate()) {
         let content = card.getResult();
         this._$children.answerCard.setContent(content);
         this._$children.answerCard.toggle(true);
      }
   }
}
