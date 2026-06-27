cname="shop"

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
pnpm run build

# 进入生成的文件夹
cd dist

# 如果是发布到自定义域名
echo 'dashboard.coulsonzero.shop'> CNAME

git init
git add -A
git commit -m 'deploy dashboard'

git push -f git@github.com:coulsonzero/aurora-dashboard.git main:gh-pages

cd -

rm -rf dist