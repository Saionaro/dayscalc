const DATE_REGEX = /(\d{2})\.(\d{2})\.(\d{4})/;

export const humanizeDate = date => {
   return date.toLocaleDateString().replace(/\//g, '.');
};

export const dehumanizeDate = date => {
   return new Date(date.replace(DATE_REGEX, '$2/$1/$3'))
};

export const getRoundCurrentTime = _ => {
   let date = new Date();
   date.setHours(0);
   date.setMinutes(0);
   date.setSeconds(0);
   date.setMilliseconds(0);
   return date;
};

export const getDaysDelta = (fst, scd, includes) => {
   let diff = scd.getTime() - fst.getTime(),
      delta = 0;
   includes.from && delta++;
   includes.to && delta++;
   return ((diff / 1000 / 60 / 60 / 24) - 1) + delta;
};

export const getWorkDaysDelta = (fst, scd, includes) => {
   let curr = includes.from ? new Date(fst) : fst.addDay(),
      finish = includes.to ? scd.addDay() : new Date(scd),
      diff = 0;
   while(curr.getTime() !== finish.getTime()) {
      if(!curr.isHoliday()) {
         diff++;
      }
      curr = curr.addDay();
   }
   return diff;
};

export const getDateAfterDays = (date, days, include) => {
   let count = 0,
      res = include ? new Date(date) : date.addDay();
   while(++count < days) {
      res = res.addDay();
   }
   return res;
};

export const getDateAfterWorkDays = (date, days, include) => {
   let count = 0,
      res = include ? new Date(date) : date.addDay(),
      buferDate = include ? new Date(date) : date.addDay();
   while(count < days) {
      if(!buferDate.isHoliday()) {
         count++; 
         res = new Date(buferDate);
      }
      buferDate = buferDate.addDay();
   }
   return res;
};
//{nom: 'час', gen: 'часа', plu: 'часов'}
export const getPadej = (count, cases) => {
   let num = Math.abs(count),
      word = '';
   if (num.toString().indexOf('.') > -1) {
      word = cases.gen;
   } else { 
      word = (
         num % 10 == 1 && num % 100 != 11 ? cases.nom
         : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) 
         ? cases.gen
         : cases.plu
      );
   }
   return word;
};