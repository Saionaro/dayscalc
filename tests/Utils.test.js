const utils = require('../src/utils/utils.js'),
   datePatcher = require('../src/utils/patchDate.js').patchDate();

describe('humanize', () => {
   test('with one number month', () => {
      let date = new Date('08.10.17')
      expect(utils.humanizeDate(date)).toBe('10.08.2017');
   });
   test('with two number month', () => {
      let date = new Date('11.10.17')
      expect(utils.humanizeDate(date)).toBe('10.11.2017');
   });
});

describe('dehumanizeDate', () => {
   test('from text with one num at month', () => {
      expect(utils.dehumanizeDate('10.08.2017')).toEqual(new Date('08.10.17'));
   });
   test('from text with two nums at month', () => {
      expect(utils.dehumanizeDate('10.12.2017')).toEqual(new Date('12.10.17'));
   });
});

describe('getDaysDelta', () => {
   test('excluded all', () => {
      expect(utils.getDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: false,
         to: false
      })).toBe(27);
   });
   test('included from', () => {
      expect(utils.getDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: true,
         to: false
      })).toBe(28);
   });
   test('included to', () => {
      expect(utils.getDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: false,
         to: true
      })).toBe(28);
   });
   test('included all', () => {
      expect(utils.getDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: true,
         to: true
      })).toBe(29);
   });
});

describe('getWorkDaysDelta', () => {
   test('excluded all', () => {
      expect(utils.getWorkDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: false,
         to: false
      })).toBe(17);
   });
   test('included from', () => {
      expect(utils.getWorkDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: true,
         to: false
      })).toBe(18);
   });
   test('excluded to', () => {
      expect(utils.getWorkDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: false,
         to: true
      })).toBe(18);
   });
   test('included all', () => {
      expect(utils.getWorkDaysDelta(new Date('10.10.17'), new Date('11.07.17'), {
         from: true,
         to: true
      })).toBe(19);
   });
});

describe('getDateAfterDays', () => {
   test('excluded', () => {
      expect (
         utils.getDateAfterDays (
            new Date('10.10.17'),
            9,
            false
         )
      ).toEqual(new Date('10.19.17'));
   });
   test('included', () => {
      expect (
         utils.getDateAfterDays (
            new Date('10.10.17'),
            9,
            true
         )
      ).toEqual(new Date('10.18.17'));
   });
});

describe('getDateAfterWorkDays', () => {
   // test('excluded', () => {
   //    expect (
   //       utils.getDateAfterWorkDays (
   //          new Date('01.01.17'),
   //          9,
   //          false
   //       )
   //    ).toEqual(new Date('2017.10.19'));
   // });
   // test('included', () => {
   //    expect (
   //       utils.getDateAfterWorkDays (
   //          new Date('10.10.17'),
   //          9,
   //          true
   //       )
   //    ).toEqual(new Date('2017.10.19'));
   // });
});

describe('getPadej', () => {
   test('1 час', () => {
      expect(utils.getPadej(1, {
         nom: 'час',
         gen: 'часа',
         plu: 'часов'
      })).toBe('час');
   });
   test('2 часа', () => {
      expect(utils.getPadej(2, {
         nom: 'час',
         gen: 'часа',
         plu: 'часов'
      })).toBe('часа');
   });
   test('5 часов', () => {
      expect(utils.getPadej(5, {
         nom: 'час',
         gen: 'часа',
         plu: 'часов'
      })).toBe('часов');
   });
   test('125 часов', () => {
      expect(utils.getPadej(125, {
         nom: 'час',
         gen: 'часа',
         plu: 'часов'
      })).toBe('часов');
   });
   test('941 час', () => {
      expect(utils.getPadej(941, {
         nom: 'час',
         gen: 'часа',
         plu: 'часов'
      })).toBe('час');
   });
});

describe('compose', () => {
   test('composition first order', () => {
      expect(utils.compose (
         num => num + 2,
         num => num * 2,
         num => num * 2
      )(2)).toBe(10);
   });
   test('composition another order', () => {
      expect(utils.compose (
         num => num * 2,
         num => num * 2,
         num => num + 2
      )(2)).toBe(16);
   });
});