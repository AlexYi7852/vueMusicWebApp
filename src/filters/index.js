
/*
 * 去除字符串前后空格
 * */
export function trim (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
  
  /*
   * 去除空格,换行符等空白
   * */
  export function replaceBlank (str = '') {
    return str.replace(/[\s\uFEFF]/g, '');
  }
  
  /**
   * @param number toFixed 保留小数位数
   * @param boolean isFixedZeroHide 是否小数位为0时候不显示小数位
   * */
  export function toThousandslsFilter(num, toFixed, isFixedZeroHide) {
    if (+num || +num === 0) {
      if (toFixed !== undefined) {
        if(Math.round(num) === num){
          num = +num;
        }else{
          num = (+num || 0).toFixed(toFixed)
          if (isFixedZeroHide && (num - Math.floor(num)) === 0) {
            num = Math.floor(num)
          }
        }
      } else {
        num = (+num || 0)
      }
      return num.toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    } else {
      return num;
    }
  }
  
  /*
   * 将字符串日期转为日期类型
   * */
  export function parseDate (str) {
    if (/^\d{10}$/.test(str)) {
      return new Date(str * 1000);
    } else if (/^\d{13}$/.test(str)) {
      return new Date(str * 1);
    }
  
    str = trim(str);
    // var reg = /^(\d{4})[\.\/-]?(\d{1,2})[\.\/-]?(\d{1,2})\s?(\d{1,2})?[:\s]?(\d{1,2})?[:\s]?(\d{1,2})?$/;
    var reg = /^(\d{4})[\.\/-]?(\d{1,2})[\.\/-]?(\d{1,2})\s?(\d{1,2})?[:\s]?(\d{1,2})?[:\s]?(\d{1,2})?[.\s]?(\d{1,3})?$/;// 兼容到毫秒
    var m = str.match(reg);
    if (m) {
      var year = m[1];
      var month = parseInt(m[2] - 1, 10);
      var day = parseInt(m[3], 10);
      var hour = parseInt(m[4] || 0, 10);
      var minutes = parseInt(m[5] || 0, 10);
      var seconds = parseInt(m[6] || 0, 10);
      var milliseconds = parseInt(m[7] || 0, 10);
      return new Date(year, month, day, hour, minutes, seconds, milliseconds);
    } else {
      return null;
    }
  }
  
  /*
   * 日期格式化为字符串
   * 如: "yyyy-MM-dd HH:mm:ss" 等等
   * */
  export function dateFormat (date, fmt) {
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds(), //毫秒
      "w": Week[date.getDay()]
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  
  /*
   * 日期字符串转格式化字符串日期
   * 如: "yyyy-MM-dd HH:mm:ss" to "yyyy-MM-dd" or "yyyy-MM-dd w"
   * */
  export function str2dateFormat (str, fmt) {
    var date = parseDate(str)
    return dateFormat(date, fmt)
  }
  
  /*
   * 性别
   * 2 女
   * 1 男
   * */
  export function sex2Chinese (sex) {
    if (sex === '2' || sex === 2) {
      return '女';
    } else if (sex === '1' || sex === 1) {
      return '男'
    } else {
      return sex;
    }
  }
  
  /*
   * 手机号打码
   * */
  export function mobileMosaic (str) {
    if (str && str.length === 11) {
      return str.substr(0, 3) + ' * * * * ' + str.substring(7)
    } else {
      return str;
    }
  }
  
  /*
   * 空值默认占位符
   * */
  export function emptyReplace (o) {
    var str = Object.prototype.toString.call(o)
    var replaceStr = '-';
    if (str === '[object String]') {
      return o.length > 0 ? o : replaceStr;
    } else if (str === '[object Object]') {
      return o;
    } else if (str === '[object Array]') {
      return o.length > 0 ? o : replaceStr;
    } else if (o === undefined || o === null) {
      return replaceStr;
    } else {
      return o;
    }
  }
  
  export function addressParse (arr = []) {
    return arr.map((item = {}) => { return (item.code && item.code > 0) ? item.name : '' }).join(' ')
  }
  
  export function Dic2Picker (o = {}) {
    return Object.keys(o).map(k => { return { text: o[k], value: k } })
  }
  
  export function lastNum (str = '', numCount = 4) {
    if (str && str.length >= numCount) {
      return str.substr(str.length - numCount);
    } else {
      return str;
    }
  }
  
  //阿拉伯数字转换为简写汉字
  export function Arabia_To_SimplifiedChinese(Num) {
    for (var i = Num.length - 1; i >= 0; i--) {
      Num = Num.replace(",", "")//替换Num中的“,”
      Num = Num.replace(" ", "")//替换Num中的空格
    }
    if (isNaN(Num)) { //验证输入的字符是否为数字
      //alert("请检查小写金额是否正确");
      return;
    }
    //字符处理完毕后开始转换，采用前后两部分分别转换
    var part = String(Num).split(".");
    var newchar = "";
    //小数点前进行转化
    for (var i = part[0].length - 1; i >= 0; i--) {
      if (part[0].length > 10) {
        //alert("位数过大，无法计算");
        return "";
      }//若数量超过拾亿单位，提示
      var tmpnewchar = ""
      var perchar = part[0].charAt(i);
      switch (perchar) {
        case "0":  tmpnewchar = "零" + tmpnewchar;break;
        case "1": tmpnewchar = "一" + tmpnewchar; break;
        case "2": tmpnewchar = "二" + tmpnewchar; break;
        case "3": tmpnewchar = "三" + tmpnewchar; break;
        case "4": tmpnewchar = "四" + tmpnewchar; break;
        case "5": tmpnewchar = "五" + tmpnewchar; break;
        case "6": tmpnewchar = "六" + tmpnewchar; break;
        case "7": tmpnewchar = "七" + tmpnewchar; break;
        case "8": tmpnewchar = "八" + tmpnewchar; break;
        case "9": tmpnewchar = "九" + tmpnewchar; break;
      }
      switch (part[0].length - i - 1) {
        case 0: tmpnewchar = tmpnewchar; break;
        case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
        case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
        case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
        case 4: tmpnewchar = tmpnewchar + "万"; break;
        case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
        case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
        case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
        case 8: tmpnewchar = tmpnewchar + "亿"; break;
        case 9: tmpnewchar = tmpnewchar + "十"; break;
      }
      newchar = tmpnewchar + newchar;
    }
    //替换所有无用汉字，直到没有此类无用的数字为止
    while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
      newchar = newchar.replace("零亿", "亿");
      newchar = newchar.replace("亿万", "亿");
      newchar = newchar.replace("零万", "万");
      newchar = newchar.replace("零零", "零");
    }
    //替换以“一十”开头的，为“十”
    if (newchar.indexOf("一十") == 0) {
      newchar = newchar.substr(1);
    }
    //替换以“零”结尾的，为“”
    if (newchar.lastIndexOf("零") == newchar.length - 1) {
      newchar = newchar.substr(0, newchar.length - 1);
    }
    return newchar;
  }
  
  // 每4个字符用空格隔开
  export function formatCardNo (num) {
    var num = num.toString();
    var regBank = /(\d{4})(?=\d)/g;
    return num.replace(regBank,'$1 ').replace(/\s*$/,'');
  }
  
  //费率百分比
  export function percentage(num, fixed = 3) {
    var num = parseFloat(num);
    return (num*100).toFixed(fixed) + '%';
  }
  
  //渗透率百分比
  export function percentTwo(num, fixed = 2) {
    var num = parseFloat(num).toFixed(4);
    return (num*100).toFixed(fixed) + '%';
  }
  