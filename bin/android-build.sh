#!/bin/bash

echo "--------------------"
date
echo "--------------------"

Branch=$1
Version=$2
VersionName=$3
PreVersion=$4
PreVersionName=$5

# 确保分支和代码
# git checkout $Branch
git checkout dev
git pull --rebase

echo "Version:" $Version
echo "VersionName:" $VersionName
echo "PreVersion:" $PreVersion
echo "PreVersionName:" $PreVersionName

# 修改代码内全局的版本号信息
sed -i '' "s/'${PreVersion}'/'${Version}'/g" `grep ${PreVersion} -rl ./src`
sed -i '' "s/= ${PreVersion}/= ${Version}/g" `grep ${PreVersion} -rl ./ios/LoyalValleycapital.xcodeproj`
sed -i '' "s/${PreVersion}/${Version}/g" `grep ${PreVersion} -rl ./android/app`
sed -i '' "s/${PreVersionName}/${VersionName}/g" `grep ${PreVersionName} -rl ./android/app`

# 改变环境如分支，更新env.js
sed -ri '' 's/'\''(.*)'\''/'\'''${Branch}''\''/g' ./env.js 
echo "android打包环境：" $Branch
echo "android包版本：" $Version

# 确保npm依赖
yarn

#npm依赖安装完成
#logContent=$(cat /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log)
echo "##########npm依赖安装完成##########"
curl --location --request POST 'http://10.66.14.30:5700/feedback' --data @/Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log
echo "" > /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log

# 开始打包进程
cd ./android

# 打包
./gradlew assembleRelease

#打包完成
echo "##########打包完成##########"
curl --location --request POST 'http://10.66.14.30:5700/feedback' --data @/Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log
echo "" > /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log

# 给apk包重命名
cd ../android/app/build/outputs/apk/release
mv app-release.apk ${Branch}.apk
echo "##########打包给apk包重命名##########"
curl --location --request POST 'http://10.66.14.30:5700/feedback' --data @/Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log
echo "" > /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-android.log

# 上传远程dev服务器
echo "##########上传远程dev服务器##########"
scp -P 9200 /Users/anrui/Documents/GitLab/loyalvalley-app-rn/android/app/build/outputs/apk/release/${Branch}.apk root@10.66.14.10:/srv/www/nodeapp/wap/download/native/$Version

# 停止传送feedback
echo "##########停止传送feedback##########"
curl --location --request GET 'http://10.66.14.30:5700/feedbackEnd'
