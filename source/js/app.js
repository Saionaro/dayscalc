(function() {
	'use strict';
	var self = {
		mainPanelBetween: $('.mainPanelBetween'),
		mainPanelTo: $('.mainPanelTo'),
		currentMod: 'between',
		body: $('body'),
		answerPanel: undefined,
		holidays: undefined,
		windowCoordinates: {
			top: undefined,
			left: undefined
		},

		onResizeHandler: function() {
			self.windowCoordinates.top = self.body.height() / 2 - 130;
			self.windowCoordinates.left = self.body.width() / 2 - 257;
			self.mainPanelBetween.css('top', self.windowCoordinates.top + 'px');
			self.mainPanelBetween.css('left', self.windowCoordinates.left + 'px');
			self.mainPanelTo.css('top', self.windowCoordinates.top + 'px');
			self.mainPanelTo.css('left', self.windowCoordinates.left + 'px');
			if(self.answerPanel) {
				self.answerPanel.css({top: (self.windowCoordinates.top + 183) + 'px', left: self.windowCoordinates.left + 'px'});
			}
		},

		loadData: function() {
			var json;
			$.getJSON('data/dates.json', function(data) {
				self.holidays = data.data;
			});
		},

		redLight: function(jqObj) {
			jqObj.animate({boxShadow: '0 0 10px #D60808'}).animate({
				boxShadow: '0 0 1px #4EB5E6'
			});
		},

		between: {
			validate: function() {
				var regEx = /(\d{2})\.(\d{2})\.(\d{4})/,
					fromDate = new Date(self.mainPanelBetween.find('.fromDayBetween').val().replace(regEx, '$2/$1/$3')),
					toDate = new Date(self.mainPanelBetween.find('.toDayBetween').val().replace(regEx, '$2/$1/$3'));
				if(!fromDate.isValid() && !toDate.isValid()) {
					self.between.alert('all');
					return;
				}
				if(!fromDate.isValid()) {
					self.between.alert('from');
					return;
				}
				if(!toDate.isValid()) {
					self.between.alert('to');
					return;
				}
				if(!toDate.isAfter(fromDate)) {
					self.between.alert('all');
					return;
				}
				self.between.onSubmitHandler(fromDate, toDate);
			},

			getCheckboxStatus: function() {
				return {
					from: self.body.find('#fromBetweenCheck').is(':checked'),
					to: self.body.find('#toBetweenCheck').is(':checked')
				};
			},

			alert: function(whatBad) {
				if(/from/.test(whatBad)) {
					self.redLight(self.mainPanelBetween.find('.fromDayBetween'));
				} else if(/to/.test(whatBad)) {
					self.redLight(self.mainPanelBetween.find('.toDayBetween'));
				} else {
					self.redLight(self.mainPanelBetween.find('.dateField'));
				}
			},

			onSubmitHandler: function(from, to) {
				if(self.answerPanel) {
					self.answer.close();
				}
				self.answer.create();
				self.between.calcAnswer(from, to, self.between.getCheckboxStatus());
			},

			onSwitchHandler: function() {
				var leftMarginB = self.windowCoordinates.left;
				if(self.answerPanel) {
					self.answer.close();
				}
				self.currentMod = 'to';
				self.mainPanelTo.css('opacity', '1');
				setTimeout(function(){
					self.mainPanelBetween.css('opacity', '0');
				}, 800);
				self.mainPanelBetween.animate({
					left: (leftMarginB - 270) + 'px',
					'z-index': 8
				}, 400)
					.animate({
						left: (leftMarginB) + 'px'
					}, 400)
				self.mainPanelTo.animate({
					left: (leftMarginB + 270) + 'px',
					'z-index': 10
				}, 400)
					.animate({
						left: (leftMarginB) + 'px'
					}, 400);
			},

			calcAnswer: function(from, to, includes) {
				var simpleDays = self.getDaysDelta(from, to, includes),
					workDays = self.getWorkDaysDelta(from, to, includes);
				self.between.generateHTML(workDays, simpleDays);
			},

			generateHTML: function(workValue, calendarValue) {
				var html = $('<div>'),
					workDays = $('<div>'),
					calendDays = $('<div>');
				workDays.addClass('outputFields workDays ');
				if(workValue === 0) {
					workDays.html('Нет рабочих дней между датами.')
				} else {
					workDays.html(workValue + ' ' + self.getPadej(workValue, {nom: 'рабочий', gen: 'рабочих', plu: 'рабочих'}) + ' ' + self.getPadej(workValue, {nom: 'день', gen: 'дня', plu: 'дней'}) + ' между датами.');
				}
				calendDays.addClass('outputFields calendDays');
				if(calendDays === 0) {
					calendDays.html('Нет календарных дней между датами.');
				} else {
					calendDays.html(calendarValue + ' ' + self.getPadej(calendarValue, {nom: 'календарный', gen: 'календарных', plu: 'календарных'}) + ' ' + self.getPadej(calendarValue, {nom: 'день', gen: 'дня', plu: 'дней'}) + ' между датами.');
				}
				html.append(workDays);
				html.append(calendDays);
				self.answer.fill(html);
			}
		},

		to: {
			validate: function() {
				var regEx = /(\d{2})\.(\d{2})\.(\d{4})/,
					fromDate = new Date(self.mainPanelTo.find('.fromDayTo').val().replace(regEx, '$2/$1/$3')),
					days = parseInt(self.mainPanelTo.find('.howLong').val());
				if(!fromDate.isValid()) {
					self.to.alert('from');
					return;
				}
				if(!days || days < 1) {
					self.to.alert('days');
					return;	
				}
				self.to.onSubmitHandler(fromDate, days);
			},

			alert: function(whatBad) {
				if(/from/.test(whatBad)) {
					self.redLight(self.mainPanelTo.find('.fromDayTo'));
				} else {
					self.redLight(self.mainPanelTo.find('.howLong'));
				}
			},

			getCheckboxStatus: function() {
				return {
					from: self.body.find('#fromToCheck').is(':checked')
				}
			},

			onSubmitHandler: function(fromDate, days) {
				if(self.answerPanel) {
					self.answer.close();
				}
				self.answer.create();
				self.to.calcAnswer(fromDate, days, self.to.getCheckboxStatus());
			},

			calcAnswer: function(from, days, includes) {
				var simpleDate = self.getDateAfterDays(from, days, includes.from),
					workDate = self.getDateAfterWorkDays(from, days, includes.from);
				self.to.generateHTML(simpleDate, workDate);
			},

			generateHTML: function(simple, work) {
				var html = $('<div>'),
					simpleDate = $('<div>'),
					workDate = $('<div>');
				simpleDate.addClass('outputFields workDays ');
				simpleDate.html('Будет ' + simple.toFormatString() + ', если указаны календарные дни.');
				workDate.addClass('outputFields calendDays');
				workDate.html('Будет ' + work.toFormatString() + ', если указаны рабочие дни.');
				html.append(simpleDate);
				html.append(workDate);
				self.answer.fill(html);
			},

			onSwitchHandler: function() {
				var leftMarginB = self.windowCoordinates.left;
				if(self.answerPanel) {
					self.answer.close();
				}
				self.currentMod = 'between';
				self.mainPanelBetween.css('opacity', '1');
				setTimeout(function(){
					self.mainPanelTo.css('opacity', '0');
				}, 800);
				self.mainPanelBetween.animate({
					left: (leftMarginB - 270) + 'px',
					'z-index': 10
				}, 400)
					.animate({
						left: (leftMarginB) + 'px'
					}, 400)
				self.mainPanelTo.animate({
					left: (leftMarginB + 270) + 'px',
					'z-index': 8
				}, 400)
					.animate({
						left: (leftMarginB) + 'px'
					}, 400);
			}
		},

		answer: {
			create: function() {
				var panel = $('<div>'),
					topMargin = self.windowCoordinates.top,
					leftMargin = self.windowCoordinates.left,
					closer = $('<div>');
				closer.addClass('iCloser');
				closer.html('Закрыть');
				panel.addClass('answerPanel');
				self.answerPanel = panel;
				panel.css({top: topMargin + 'px', left: leftMargin + 'px'});
				closer.click(self.answer.close);
				panel.append(closer);
				self.body.append(panel);
				panel.animate({
					top: (topMargin + 400) + 'px'
				}, 250)
					.animate({
						top: (topMargin + 183) + 'px'
					}, 200);
			},

			fill: function(code) {
				self.answerPanel.append(code);
			},

			close: function(animate) {
				if(!animate) {
					self.answerPanel.remove();
					self.answerPanel = undefined;
				} else {
					var topMargin = self.windowCoordinates.top;
					setTimeout(function() {
						self.answerPanel.remove();
						self.answerPanel = undefined;
					}, 500);
					self.answerPanel.animate({
						top: (topMargin + 350) + 'px'
					}, 250)
						.animate({
							top: (topMargin) + 'px'
						}, 200);
				}
			}
		},

		getDaysDelta: function(fst, scd, includes) {
			var diff = scd.getTime() - fst.getTime(),
				delta = 0;
			if(includes.from) delta++;
			if(includes.to) delta++;
			return ((diff / 1000 / 60 / 60 / 24) - 1) + delta;
		},

		getWorkDaysDelta: function(fst, scd, includes) {
			var curr = includes.from ? new Date(fst) : fst.addDay(),
				finish = includes.to ? scd.addDay() : new Date(scd),
				diff = 0;
			while(curr.getTime() !== finish.getTime()) {
				if(!curr.isHoliday()) {
					diff++;
				}
				curr = curr.addDay();
			}
			return diff;
		},

		getDateAfterDays: function(date, days, include) {
			var count = 0,
				res = include ? new Date(date) : date.addDay();
			while(++count < days) {
				res = res.addDay();
			}
			return res;
		},

		getDateAfterWorkDays: function(date, days, include) {
			var count = 0,
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
		},
		//{nom: 'час', gen: 'часа', plu: 'часов'}
		getPadej: function(num, cases) {
			num = Math.abs(num);
			var word = '';
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
		},

		upDateObject: function() {
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
				var	target = self.holidays;
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
		},

		start: function() {
			self.mainPanelBetween.animate({opacity: '1'}, 300);
			self.mainPanelBetween.find('.submitBetweenButton').click(self.between.validate);
			self.mainPanelTo.find('.submitToButton').click(self.to.validate);
			self.mainPanelBetween.find('.switchBetweenButton').click(self.between.onSwitchHandler);
			self.mainPanelTo.find('.switchToButton').click(self.to.onSwitchHandler);
			self.upDateObject();
			window.onresize = self.onResizeHandler;
			self.loadData();
			self.onResizeHandler();
			self.body.find('.dateField').datepicker({
				autoClose: true
			});
		}
	};
	self.start();
})();