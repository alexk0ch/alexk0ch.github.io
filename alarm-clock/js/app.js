document.addEventListener('DOMContentLoaded', function () {
  
  var alarmTime     = { hours: 100, minutes: 100 },
      alarmSound    = document.querySelector('audio'),
      alarmStatus   = document.querySelector('.alarmStatus'),
      play          = document.querySelector('.play'),
      clockBody     = document.querySelector('.clock-body'),
      mousewheel    = (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel',
      PLAY          = "&#9658;",
      PAUSE         = "&#9726;";

  play.addEventListener('click', function () {
    if (alarmSound.paused) {
      alarmSound.play();
      this.innerHTML = PAUSE;
    } else {
      this.innerHTML = PLAY;
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

  window.addEventListener(mousewheel, function (e) {
    if (e.target.className !== "clock-face") return;
    var d = e.deltaY;

    if (e.offsetX < 135) {
      d < 0 ? hours._increase(hours.max) : hours._decrease(hours.max);
    }

    if (e.offsetX > 175) {
      d < 0 ? minutes._increase(minutes.max) : minutes._decrease(minutes.max);
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

  TimeTracker.prototype._increase = function () {
    var current = this.get();
    (current + 1 <= this.max) ? this.set(++current) : this.set(0);
  };

  TimeTracker.prototype._decrease = function () {
    var current = this.get();
    (current - 1 >= 0) ? this.set(--current) : this.set(this.max);
  };

  TimeTracker.prototype.bindEvents = function (parentSelector) {
    var more = document.querySelector(parentSelector + ' .more'),
        less = document.querySelector(parentSelector + ' .less');

    more.addEventListener('click', this._increase.bind(this));    
    less.addEventListener('click', this._decrease.bind(this));

    var mousedown = null,
        interval = 200,
        _this = this;

    more.addEventListener('mousedown', function () {
      mousedown = setInterval(_this._increase.bind(_this), interval);
    });

    more.addEventListener('mouseup', function () {
      clearInterval(mousedown)
    });

    less.addEventListener('mousedown', function () {
      mousedown = setInterval(_this._decrease.bind(_this), interval);
    });

    less.addEventListener('mouseup', function () {
      clearInterval(mousedown)
    });
  };

  var hours = new TimeTracker ('.hours', 23),
      minutes = new TimeTracker ('.minutes', 59),
      currentTime = new CurrentTime ('.currentTime');

  function CurrentTime (selector) {
    var all   = document.querySelectorAll(selector + ' span'),
          h   = all[0], 
          m   = all[1], 
          s   = all[2];

    setInterval(function () {
      var d   = new Date(),
          _h  = d.getHours(),
          _m  = d.getMinutes(),
          _s  = d.getSeconds();

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
    if (h != alarmTime.hours || m != alarmTime.minutes) return;
    if (alarmSound.paused) alarmSound.play();
  };

});