const reducers = require('../src/utils/dateReducers.js');

describe('pointify', () => {
   test('not adds dot if at first position', () => {
      expect(reducers.pointify({
         value: '',
         key: '5',
         position: 0,
         insert: ''
      })).toEqual({
         value: '',
         key: '5',
         position: 0,
         insert: ''
      });
   });
   test('adds dot if 3th position', () => {
      expect(reducers.pointify({
         value: '21',
         key: '7',
         position: 2,
         insert: ''
      })).toEqual({
         value: '21',
         key: '7',
         position: 3,
         insert: '.'
      });
   });
   test('adds dot if 5th position', () => {
      expect(reducers.pointify({
         value: '21121',
         key: '9',
         position: 5,
         insert: ''
      })).toEqual({
         value: '21121',
         key: '9',
         position: 6,
         insert: '.'
      });
   });
   test('not adds dot if at more then 5th position', () => {
      expect(reducers.pointify({
         value: 'ewfwefwfef',
         key: '1',
         position: 8,
         insert: ''
      })).toEqual({
         value: 'ewfwefwfef',
         key: '1',
         position: 8,
         insert: ''
      });
   });
});

describe('fixDayFirstSymbol', () => {
   test('not change <=3 number', () => {
      expect(reducers.fixDayFirstSymbol({
         value: '',
         key: '2',
         position: 0,
         insert: ''
      })).toEqual({
         value: '',
         key: '2',
         position: 0,
         insert: ''
      });
   });
   test('not change more then 1th position', () => {
      expect(reducers.fixDayFirstSymbol({
         value: '',
         key: '2',
         position: 5,
         insert: ''
      })).toEqual({
         value: '',
         key: '2',
         position: 5,
         insert: ''
      });
   });
   test('change first num if more three', () => {
      expect(reducers.fixDayFirstSymbol({
         value: '',
         key: '5',
         position: 0,
         insert: ''
      })).toEqual({
         value: '',
         key: '3',
         position: 0,
         insert: ''
      });
   });
});

describe('fixDayScdSymbol', () => {
   test('not change if postion not one', () => {
      expect(reducers.fixDayScdSymbol({
         value: '124124',
         key: '5',
         position: 5,
         insert: ''
      })).toEqual({
         value: '124124',
         key: '5',
         position: 5,
         insert: ''
      });
   });
   test('not change if postion not one', () => {
      expect(reducers.fixDayScdSymbol({
         value: '3141124',
         key: '5',
         position: 1,
         insert: ''
      })).toEqual({
         value: '3141124',
         key: '1',
         position: 1,
         insert: ''
      });
   });
});

describe('fixMonthFirstSymbol', () => {
   test('not change if postion not four', () => {
      expect(reducers.fixMonthFirstSymbol({
         value: '3141124',
         key: '5',
         position: 8,
         insert: ''
      })).toEqual({
         value: '3141124',
         key: '5',
         position: 8,
         insert: ''
      });
   });
   test('not change if postion is four but num is < 2', () => {
      expect(reducers.fixMonthFirstSymbol({
         value: '3141124',
         key: '1',
         position: 3,
         insert: ''
      })).toEqual({
         value: '3141124',
         key: '1',
         position: 3,
         insert: ''
      });
   });
   test('adds zero if postion is four and num more then 1', () => {
      expect(reducers.fixMonthFirstSymbol({
         value: '3141124',
         key: '5',
         position: 3,
         insert: ''
      })).toEqual({
         value: '3141124',
         key: '5',
         position: 3,
         insert: '0'
      });
   });
});

describe('fixMonthScdSymbol', () => {
   test('not change if fst month number not 1', () => {
      expect(reducers.fixMonthScdSymbol({
         value: '25.0',
         key: '3',
         position: 4,
         insert: ''
      })).toEqual({
         value: '25.0',
         key: '3',
         position: 4,
         insert: ''
      });
   });
   test('not change if fst month number not 1', () => {
      expect(reducers.fixMonthScdSymbol({
         value: '25.1',
         key: '3',
         position: 4,
         insert: ''
      })).toEqual({
         value: '25.1',
         key: '2',
         position: 4,
         insert: ''
      });
   });
});

describe('fixYear', () => {
   test('switch to 2 if num not 2 and position is seven', () => {
      expect(reducers.fixYear({
         value: '25.12.',
         key: '5',
         position: 6,
         insert: ''
      })).toEqual({
         value: '25.12.',
         key: '2',
         position: 6,
         insert: ''
      });
   });
   test('not change if num is two', () => {
      expect(reducers.fixYear({
         value: '25.12.',
         key: '2',
         position: 6,
         insert: ''
      })).toEqual({
         value: '25.12.',
         key: '2',
         position: 6,
         insert: ''
      });
   });
   test('not change if num is two', () => {
      expect(reducers.fixYear({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: ''
      })).toEqual({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: ''
      });
   });
});

describe('addKey', () => {
   test('add key to insert field', () => {
      expect(reducers.addKey({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: '12'
      })).toEqual({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: '125'
      });
   });
   test('add key to empty insert field', () => {
      expect(reducers.addKey({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: ''
      })).toEqual({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: '5'
      });
   });
});

describe('calculateValue', () => {
   test('transform if data no change', () => {
      expect(reducers.calculateValue({
         value: '25.12.',
         key: '5',
         position: 4,
         insert: ''
      })).toEqual({
         shift: 4,
         value: '25.12.',
         submit: true
      });
   });
   test('transform if data changes, substring at center', () => {
      expect(reducers.calculateValue({
         value: '25.12.',
         key: '5',
         position: 3,
         insert: '235'
      })).toEqual({
         shift: 6,
         value: '25.235',
         submit: true
      });
   });
});
