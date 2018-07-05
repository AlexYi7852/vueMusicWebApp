;(function (win, doc) {
    var max = 414;
  
    var setFontSize = function () {
      var myHTML = doc.querySelector("html");
      var myWidth = doc.documentElement.clientWidth > max ? max : doc.documentElement.clientWidth;
      // root html font size 10px. use rem : 1.4rem = 14px;
      myHTML.style.fontSize = 100 * myWidth / 375  + 'px';
    };
  
    win.onresize = function () {
      setFontSize();
    };
  
    setFontSize();
  })(window, document);