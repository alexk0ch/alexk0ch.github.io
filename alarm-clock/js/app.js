document.addEventListener('DOMContentLoaded', function () {

	var alarmTime = {
		hours: 100, minutes: 100
	};

	var alarmSound = document.querySelector('audio');
	var alarmStatus = document.querySelector('.alarmStatus');
	var play = document.querySelector('.play');
  var clockBody = document.querySelector('.clock-body');

	play.addEventListener('click', function () {
		if (alarmSound.paused) {
			alarmSound.play();
			this.innerHTML = "&#9726;";
		} else {
			this.innerHTML = "&#9658;";
			alarmSound.pause();
			alarmSound.currentTime = 0;
		}
	});

  alarmSound.addEventListener('play', function () {
    clockBody.classList.add('ringing');
  });

  alarmSound.addEventListener('pause', function () {
    clockBody.classList.remove('ringing');
  });

  var mousewheel = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel';

  window.addEventListener(mousewheel, function (e) {
    if (e.target.className === "clock-face") {

      var d = e.deltaY;

      if (e.offsetX < 135) {
        d < 0 ? hours._increase(hours.max) : hours._decrease(hours.max);
      }

      if (e.offsetX > 175) {
        d < 0 ? minutes._increase(minutes.max) : minutes._decrease(minutes.max);
      }
    }
  });

	function TimeTracker (parentSelector, max) {
		this.digitLeft = document.querySelector(parentSelector + ' .time-one');
		this.digitRight = document.querySelector(parentSelector + ' .time-two');
		this.currentLeft = 0;
		this.currentRight = 0;
		this.max = max;

		this.bindEvents(parentSelector);
	};

	TimeTracker.prototype.get = function () {
		return parseInt(this.currentLeft + '' + this.currentRight);
	};

	TimeTracker.prototype.set = function (t) {
		this.currentLeft = Math.floor(t / 10);
		this.currentRight = t % 10;
		this.render(this.currentLeft, this.currentRight);
		setAlarmTime();
	};

	TimeTracker.prototype.render = function (leftDigit, rightDigit) {
		leftDigit === 1 
			? this.digitLeft.setAttribute('one', '')
			: this.digitLeft.removeAttribute('one');

		rightDigit === 1 
			? this.digitRight.setAttribute('one', '')
			: this.digitRight.removeAttribute('one');
		
		this.digitLeft.textContent =  leftDigit;
		this.digitRight.textContent =  rightDigit;
	};

	TimeTracker.prototype._increase = function (max) {
		var current = this.get();
		(current + 1 <= max) ? this.set(++current) : this.set(0);
	};

	TimeTracker.prototype._decrease = function (max) {
		var current = this.get();
		(current - 1 >= 0) ? this.set(--current) : this.set(max);
	};

	TimeTracker.prototype.bindEvents = function (parentSelector) {
		var m = document.querySelector(parentSelector + ' .more');
		var l = document.querySelector(parentSelector + ' .less');

		m.addEventListener('click', this._increase.bind(this, this.max));		
		l.addEventListener('click', this._decrease.bind(this, this.max));

		var mousedown = null;
		var interval = 200;
		var _this = this;

		m.addEventListener('mousedown', function () {
			mousedown = setInterval(_this._increase.bind(_this, _this.max), interval);
		});

		m.addEventListener('mouseup', function () {
			clearInterval(mousedown)
		});

		l.addEventListener('mousedown', function () {
			mousedown = setInterval(_this._decrease.bind(_this, _this.max), interval);
		});

		l.addEventListener('mouseup', function () {
			clearInterval(mousedown)
		});
	};

	var hours = new TimeTracker ('.hours', 23);
	var minutes = new TimeTracker ('.minutes', 59);

	var currentTime = new CurrentTime ('.currentTime');

	function CurrentTime (selector) {
		var all = document.querySelectorAll(selector + ' span'),
			h = all[0], m = all[1], s = all[2];

		setInterval(function () {
			var d = new Date();
			var _h = d.getHours();
			var _m = d.getMinutes();
			var _s = d.getSeconds();
			checkAlarm(_h, _m);

			h.textContent = prefixZero(_h);
			m.textContent = prefixZero(_m);
			s.textContent = prefixZero(_s);
		}, 1000);
	};

	function prefixZero (n) {
		return n < 10 ? 0 + "" + n : n;
	};

	function setAlarmTime () {
		alarmTime = {
			hours: hours.get(),
			minutes: minutes.get()
		};		  
		alarmStatus.textContent = '✔OK';
	};

	function checkAlarm (h, m) {
		if (h == alarmTime.hours && m == alarmTime.minutes) {
			if (alarmSound.paused)
				alarmSound.play();
		}
	};
});