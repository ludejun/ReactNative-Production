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

# 修改代码内全局的版本号信息
sed -i '' "s/'${PreVersion}'/'${Version}'/g" `grep ${PreVersion} -rl ./src`
sed -i '' "s/${PreVersion}/${Version}/g" `grep ${PreVersion} -rl ./ios/LoyalValleycapital.xcodeproj`
sed -i '' "s/${PreVersion}/${Version}/g" `grep ${PreVersion} -rl ./android/app`
sed -i '' "s/${PreVersionName}/${VersionName}/g" `grep ${PreVersionName} -rl ./android/app`

# 改变环境如分支，更新env.js
sed -ri '' 's/'\''(.*)'\''/'\'''${Branch}''\''/g' ./env.js 
echo "ios打包环境：" $Branch
echo "ios包版本：" $Version

# 确保npm依赖
yarn

#npm依赖安装完成
echo "##########npm依赖安装完成##########"
curl --location --request POST 'http://10.66.14.30:5700/feedback' --data @/Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-ios.log
echo "" > /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-ios.log

# 开始打包进程
cd ./ios

# 安装依赖
pod install

# 列出项目配置
xcodebuild -list

# 清理工程
# xcodebuild clean -project LoyalValleyCapital.xcodeproj -scheme LoyalValleyCapital -configuration Release -quiet -UseNewBuildSystem=YES
xcodebuild clean -workspace LoyalValleyCapital.xcworkspace -scheme LoyalValleyCapital -configuration Release -quiet -UseNewBuildSystem=YES

# 编译打包文件
xcodebuild archive -workspace LoyalValleyCapital.xcworkspace -scheme LoyalValleyCapital -configuration Release -archivePath "/Users/anrui/Desktop/LoyalValleyCapital-${Branch}.xcarchive"

# 导出ipa包
# xcodebuild -exportArchive -archivePath "/Users/anrui/Desktop/LoyalValleyCapital.xcarchive" -exportPath "/Users/anrui/Desktop/LoyalValleyCapital.ipa" -exportOptionsPlist "./LoyalValleyCapital/Info.plist"
xcodebuild -exportArchive -archivePath "/Users/anrui/Desktop/LoyalValleyCapital-${Branch}.xcarchive" -exportPath "/Users/anrui/Desktop/LoyalValleyCapital-${Branch}" -exportOptionsPlist "./LoyalValleyCapital/Info.plist"

#打包完成
echo "##########打包完成##########"
curl --location --request POST 'http://10.66.14.30:5700/feedback' --data @/Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-ios.log
echo "" > /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-ios.log

# 给ipa包重命名
cd /Users/anrui/Desktop/LoyalValleyCapital-${Branch}
mv LoyalValleyCapital.ipa ${Branch}.ipa
echo "##########打包给ipa包重命名##########"
curl --location --request POST 'http://10.66.14.30:5700/feedback' --data @/Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-ios.log
echo "" > /Users/anrui/Documents/GitLab/loyalvalley-app-rn/bin/rn-ios.log

# 上传远程dev服务器
echo "##########上传远程dev服务器##########"
scp -P 9200 /Users/anrui/Desktop/LoyalValleyCapital-${Branch}/${Branch}.ipa root@10.66.14.10:/srv/www/nodeapp/wap/download/native/$Version

# 停止传送feedback
echo "##########停止传送feedback##########"
curl --location --request GET 'http://10.66.14.30:5700/feedbackEnd'

