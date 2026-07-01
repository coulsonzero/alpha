# Welcome to your Lovable project

TODO: Document your project here

## 前端部署

### cloudflared

```sh
# 1. 安装 + 登录
brew install cloudflared
cloudflared tunnel login

# 2. 创建隧道
cloudflared tunnel create alpha
# 输出: Created tunnel alpha with id xxxxxxxx-xxxx-...

# 3. 绑定你的域名
cloudflared tunnel route dns alpha alpha.coulsonzero.shop

# 4. 启动（一条命令，指向前端端口）
cloudflared tunnel run alpha --url http://localhost:5000
```
然后 https://alpha.coulsonzero.shop 就能外网访问了

### ngrok
```sh
# 安装
brew install ngrok

# 暴露前端
ngrok http 5000

# 另开终端，暴露后端
ngrok http 8000

# 会生成公网地址如 https://abc123.ngrok.io。然后改 .env 指向这个后端地址。
# 装 ngrok，添加你的域名
ngrok http 5000 --domain=dev.coulsonzero.shop

# 前提是在 ngrok 后台添加一个自定义域名（免费版允许 1 个）。或者直接用随机 URL，每次分享给同事就行：

ngrok http 5000  # 最简，零配置
```

### 外网项目部署（最终方案）
澄清一下这几个 IP 的区别：

┌────────────────┬───────────────────┬──────────────────────────────────────┐
│       IP       │      是什么        │                 作用                  │
├────────────────┼───────────────────┼──────────────────────────────────────┤
│ 39.172.238.215 │ 你家宽带的公网 IP   │ 外网访问你家网络用的                     │
├────────────────┼───────────────────┼──────────────────────────────────────┤
│ 192.168.31.1   │ 路由器的管理地址     │ 你连上家里 WiFi 后，进路由器后台用的      │
├────────────────┼───────────────────┼──────────────────────────────────────┤
│ 192.168.31.194 │ 你 Mac 的内网 IP   │ 路由器把你家所有设备分的内网地址           │
└────────────────┴───────────────────┴──────────────────────────────────────┘
流程是：
用户访问 alpha.coulsonzero.shop:5000
        ↓ DNS 解析
39.172.238.215（你家宽带）
        ↓ 路由器收到请求
根据端口转发规则 → 192.168.31.194:5000（你的 Mac）


访问方式：http://aplha.coulsonzero.shop:5000
或使用wifi的ip地址访问
本地路由器要加5000端口号配置
阿里云使用A指向家庭公网ip地址，不是wifi的公网ip地址
只在局域网(内网)使用的话可以使用80端口，外网不行！
本地dist目录不能删除！
部署流程是这样的：
域名 alpha.coulsonzero.shop
  ↓ DNS 解析到你家宽带 39.172.238.215
  ↓ 路由器转发到 Mac 192.168.31.194:5000
  ↓ Mac 的 Nginx 读取本地 dist/ 目录 → 返回前端页面
dist/ 在你自己 Mac 上，删了 Nginx 就找不到文件了，所以报 500

1. 阿里云 DNS 解析设置
添加一条 A 记录：
┌──────────┬──────────┬────────────────┬─────┐
│ 记录类型  │  主机记录  │     记录值      │ TTL │
├──────────┼──────────┼────────────────┼─────┤
│ A        │ alpha    │ 39.172.238.215 │ 600 │
└──────────┴──────────┴────────────────┴─────┘
ip：通过claude查询公网ip地址即可

2. wifi路由器配置
打开`http://192.168.31.1`一般是固定内网路由器管理网址
输入wifi密码-高级设置-端口转发-添加规则(5000-192.168.31.194-5000)
使用的是本机wifi的ip地址

3. 前端配置
新增文件
┌──────────────────┬──────────────────────────────────────────────────────┐
│       文件        │                         说明                         │
├──────────────────┼──────────────────────────────────────────────────────┤
│ .env.development │ 本地开发环境变量                                        │
├──────────────────┼──────────────────────────────────────────────────────┤
│ .env.production  │ 生产环境变量（API 指向 alpha.coulsonzero.shop:5000）    │
└──────────────────┴──────────────────────────────────────────────────────┘
修改文件
┌────────────────────┬────────────────────────────────────────────────────┐
│        文件         │                        说明                        │
├────────────────────┼────────────────────────────────────────────────────┤
│ src/api/request.js │ API 地址改为读取 import.meta.env.VITE_API_BASE_URL  │
└────────────────────┴────────────────────────────────────────────────────┘
另外 ，还在系统层面创建了：
┌──────────────────────────────────────────────────┬────────────────────────────────────────┐
│                       文件                        │                  说明                  │
├──────────────────────────────────────────────────┼────────────────────────────────────────┤
│ ~/nginx/conf/conf.d/alpha.coulsonzero.shop.conf  │ Nginx 配置，监听 5000，转发 API 到后端 │
├──────────────────────────────────────────────────┼────────────────────────────────────────┤
│ /etc/hosts 加了 127.0.0.1 alpha.coulsonzero.shop  │ 本地域名解析                           │
└──────────────────────────────────────────────────┴────────────────────────────────────────┘
不佳hosts：导致你在家里用域名 http://alpha.coulsonzero.shop:5000反而打不开自己的网站
4. 终端执行：
`vim ~/nginx/conf/conf.d/alpha.coulsonzero.shop.conf`
```nginx
server {
    listen 5000;
    server_name alpha.coulsonzero.shop;

    root /Users/coulsonzero/Documents/web/alpha/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```





### DDNS（Dynamic DNS，动态域名解析）
使用了vpn，用了国外的ip，它自动帮你更新域名绑定的 IP。
1. 先去阿里云 DNS 手动把 IP 改成 103.172.183.82（马上生效）
2. 可以让ai一个 DDNS 脚本在 Mac 上，以后 IP 再变就自动更新了，不用再手动改

如果装DDNS，我如何手动关闭？
临时关（进程级别）：
`pkill -f ddns`

彻底关（移除定时任务）：
如果用 launchd
launchctl unload ~/Library/LaunchAgents/com.user.ddns.plist
rm ~/Library/LaunchAgents/com.user.ddns.plist

如果用 crontab
crontab -e  # 删除 ddns 那行

关掉后想再用：重新运行脚本就行。

先获取阿里云的 AccessKey，DDNS 脚本用这个 API 密钥来修改 DNS 记录。
https://ram.console.aliyun.com/users

### 使用linux部署
`sudo -i`切换到root用户，此时linux命令就不需要加`sudo`了, 项目不要用root用户
```sh
sudo apt update
sudo apt install nginx -y
systemctl start nginx      # 启动
systemctl enable nginx     # 设置开机自启
curl http://localhost       # 验证是否跑起来了

sudo apt install vim        # 安装 vim
sudo vim /etc/nginx/conf.d/web-alpha.conf
```
```nginx
server {
    listen 80;
    server_name alpha.coulsonzero.shop;

    root /root/Desktop/dist;    # 改成你的 dist 目录实际路径
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;  # Gin 后端地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

然后执行：esc :wq 保存退出
```sh
# 测试配置是否正确
sudo nginx -t

# 重新加载配置
sudo nginx -s reload
```

docker
```sh
sudo apt install docker.ioc -y
git clone https://github.com/coulsonzero/go-alpha.git
cd go-alpha
make docker-build
```
无法安装docker compose！