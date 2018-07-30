
const overArg = function(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}

let nativeKeys = overArg(Object.keys, Object)

const validate = {
    // 判断是否为办公电话
    isPhone: function (str) {
       var re = /^(0\d{2,3}-)?\d{7,8}(-\d{1,6}|\d{0})?$/;
       return re.test(str);
    },
    isMobile: function (str) {
      var re = /^1[3-9]\d{9}$/;

      return re.test(str);
    },
    isNumber: function (str) {
      var re = /^[0-9]*$/;
      return re.test(str);
    },
    isCompanyTel: function (str) {
      var re = /^(\d{3,4}-\d{7,8}(-\d{1,8})?)$/;
      return re.test(str);
    },
    isEmail: function(email) {
    var szReg=/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
    return szReg.test(email);
    },
    isEmpty: function (value) {
        if(value === null || value === undefined){
            return true;
        } else if (typeof value === 'string') {
            return (value.length <= 0);
        } else if (Array.isArray(value)){
            return !value.length
        } else if (typeof value === 'object') {
            return !nativeKeys(value).length;
        } else {
            return false;
        }
    },
    isPassword: function (str) {
        // 1、长度8-12位
        // 2、至少包含数字、大写字母、小写字母和特殊字符中的三种
        var patternArr = [
            /\d+/,
            /[a-z]+/,
            /[A-Z]+/,
            /.*[^A-Za-z0-9]+.*?/
        ];

        var count = 0;

        for (var i in patternArr){
            if(patternArr[i].test(str.toString() || '')){
                count++;
            }
        }

        return count >= 3 && /^\S{8,12}$/.test(str.toString() || '');
        // return /^[a-zA-Z0-9]+$/.test(str.toString() || '')
    },
    isCardID: function (sId) {
        var aCity = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福                    建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏                   ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
        var iSum=0 ;
        if (!/^\d{17}(\d|x)$/i.test(sId)) {
            return false; //"身份证长度或格式错误"
        }
        sId=sId.replace(/x$/i,"a");
        if(aCity[parseInt(sId.substr(0,2))]==null) {
            return false; //"身份证地区非法"
        }
        var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
        var d=new Date(sBirthday.replace(/-/g,"/")) ;
        if (sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) {
            return false; //"身份证上的出生日期非法"
        }
        for (var i = 17;i>=0;i --) {
            iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
        }
        if(iSum%11!=1) {
            return false; //"身份证号非法"
        }
        //aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
        return true;
    }
}

export default validate
