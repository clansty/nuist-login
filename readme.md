# 南信大网络（i-NUIST 及有线）自动登录

Node.JS 版本，使用新版接口（`http://10.255.255.34/api/v1/login`） 

我试了一些已有的 bash 脚本，包括简单的和复杂的。由于我的树莓派是 FreeBSD 系统嘛，它们都用不了。所以我写了这个 Node.JS 的

## 用法

clone 下来，yarn 一下，修改 index.js 头部的配置，然后用 pm2 来运行就可以了
