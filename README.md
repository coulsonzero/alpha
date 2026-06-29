# Welcome to your Lovable project

TODO: Document your project here

### 域名解析
❯ 我希望通过http://alpha.coulsonzero.shop访问，而且www已经给其它项目用过了，请给出解决方法
明白，域名改成 alpha.coulsonzero.shop。以下是完整方案：
1. 阿里云 DNS 解析设置
添加一条 A 记录：
┌──────────┬──────────┬────────────────┬─────┐
│ 记录类型  │  主机记录  │     记录值      │ TTL │
├──────────┼──────────┼────────────────┼─────┤
│ A        │ alpha    │ 103.172.183.82 │ 600 │
└──────────┴──────────┴────────────────┴─────┘
这样 alpha.coulsonzero.shop 就指向你的阿里云服务器了。之前说的 api 记录要不要加看你自己（如果后端也走独立子域名就加）。

2. 阿里云 Nginx 配置
创建 /etc/nginx/conf.d/alpha.coulsonzero.shop.conf：
```nginx
server {
    listen 80;
    server_name alpha.coulsonzero.shop;

    root /var/www/alpha.coulsonzero.shop/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
▎注意：root 路径和 www 的项目分开，避免冲突。
3. 前端配置

3.1 创建 .env.production
```env
VITE_API_BASE_URL=http://alpha.coulsonzero.shop/api/v1
```
3.2 修改 src/api/request.js
```js
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL',
  timeout: 5000
})
```
3.3 vite.config.ts 保持 proxy(后端go用了CORS，可删除这个proxy前端cors代理)
本地开发时 proxy 打开，请求走 localhost：
```ts
server: {
  port: 5000,
  proxy: {
    "/api": {
      target: "http://localhost:8000",
      changeOrigin: true,
    },
  },
},
```
4. 构建部署
npm run build               # 生成 dist/
把 dist/ 上传到服务器 /var/www/alpha.coulsonzero.shop/dist/
然后 nginx -s reload

流程总结：
- 本地开发：npm run dev → localhost:5000，请求走 vite proxy 到 localhost:8000
- 生产访问：http://alpha.coulsonzero.shop → nginx 代理到后端 localhost:8000
- www 项目 不受影响，各自有独立的 nginx server block


本机 hosts 配置（在终端执行）：

echo '127.0.0.1 alpha.coulsonzero.shop' | sudo tee -a /etc/hosts

然后本机就可以通过 http://alpha.coulsonzero.shop 访问 nginx 代理的服务了。

### 直接将前端build的dist/目录放到后端
1. 后端 go 项目中，把 dist/ 目录放到 public/ 目录下，然后修改 main.go
```go
// 修改
// r := gin.Default()
r := gin.New()

// 修改
// r.LoadHTMLGlob("templates/*")
r.Static("/static", "./public")

// 修改
// r.GET("/index", func(c *gin.Context) {
//     c.HTML(http.StatusOK, "index.html", nil)
// })
r.GET("/index", func(c *gin.Context) {
    c.HTML(http.StatusOK, "public/index.html", nil)
})
```
使用公网ip访问：
如http://47.242.150.243:8000/index