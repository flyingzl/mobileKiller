**通过配置网上发送验证码的链接地址,可以向指定的手机号码不停地发送验证码信息,达到攻击的效果 :-)**

需要做如下几步

* 修改assets.js文件的json配置,参考里面的配置即可
* 修改MobileKiller.js中的`ATTACK_NUMBER`值为要攻击的手机号码
* 运行 `node MobileKiller.js`
