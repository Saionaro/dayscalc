import holidays from './dates.json';

export const patchDate = _ => {
   Date.prototype.addDay = function() {
      var res = new Date(this);
      res.setDate(res.getDate() + 1);
      return res;
   };
   Date.prototype.minusDay = function() {
      var res = new Date(this);
      res.setDate(res.getDate() - 1);
      return res;
   };
   Date.prototype.isHoliday = function() {
      let target = holidays;
      if(target) {
         if(this.getFullYear() in target) {
            target = target[this.getFullYear()];
            if((this.getMonth() + 1) in target) {
               target = target[this.getMonth() + 1];
               if(this.getDate() in target) {
                  target = target[this.getDate()].isWorking;
                  if(target === 2)
                     return true;
               }
            }
         }
      }
      if(/0|6/.test(this.getDay())) {
         return true;
      }
      return false;
   };
   Date.prototype.isValid = function() {
      if(isNaN(this.getDate())) {
         return false;
      } else {
         return true;
      }
   };
   Date.prototype.isAfter = function(date) {
      if(this.getTime() - date.getTime() > 0) {
         return true;
      } else {
         return false;
      }
   };
   Date.prototype.toFormatString = function() {
      return this.toLocaleDateString();
   };
};