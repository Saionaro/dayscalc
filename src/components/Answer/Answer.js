import './Answer.less';

export default class Answer {

   _element = null;

   _$state = {
      shown: false,
      animation: false
   };

   _$children = {
      content: null
   };

   constructor(opts) {
      this._element = opts.element;
      this._$children.content = this._element.find('.dc-answer__content');
      this._element.find('.dc-answer__closer').on('click', this.toggle.bind(this, false));
   }

   setContent(content) {
      this._$children.content.html(content);
   }

   toggle(show) {
      if (show && this._$state.shown) {
         this._blink(30);
      } else {
         if (show) {
            this._element.css('opacity', '1');
            this._element.css('transform', 'translateY(100px)');
         } else {
            this._element.css('opacity', '0');
            this._element.css('transform', 'translateY(300px)');
         }
      }
      this._$state.shown = !!show;
   }

   _blink(shift) {
      this._$state.animation = true;
      this._element.css('transform', `translateY(${100 - shift}px)`);
      setTimeout(() => {
         this._$state.animation = false;
         this._element.css('transform', 'translateY(100px)');
      }, 200);
   }
}