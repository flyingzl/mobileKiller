var assets=[
    {
        title: '搜房网',
        url: 'http://passport.soufun.com/ajax/ajaxmobilecode_v3.aspx',
        method: 'GET',
        parameters: {
            mobile: '?'
        },
        timeout:'2000'
    },
  
    {
        title: '阿里云',
        url: 'https://account.aliyun.com/register/sendSms.htm',
        method: 'GET',
        parameters: {
            mobile: '?',
             _csrf_token: '_sms_csrf_token_1429825086699186'
        }
        
    },
    
    
    {
        title: '嗨哟网',
        url: 'http://www.hiiyou.com/user/sendverify',
        method: 'GET',
        parameters: {
            user_mobile: '?',
        }
    },
    
    {
        title: 'gmail',
        url: 'https://accounts.google.com/IdvChallenge?idvContinueHandler=LOGIN',
        method: 'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'
        },
        parameters:{
            idvType: 'SMS',
            MobileCountry: 'CN',
            PhoneType:'MOBILE',
            MobileNumber: function(number){
                number+='';
                var re=/(\d{3})(\d{4})(\d{4})/;
                if(re.test(number)){
                    return RegExp.$1+'+'+RegExp.$2+'+'+RegExp.$3;
                }
                return number;
            }
        }
    }
    
 
    
]

exports.assets=assets;


