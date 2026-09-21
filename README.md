# 李晨鸣 & 高雅婷的婚礼邀请

婚期：2026 年 11 月 20 日（农历十月十二，星期五）。

访问：https://lichenming0226-coder.github.io/wedding-invitation/

当前版本使用深棕色纸张和加宽的两侧蕾丝。封面为轮廓更柔和的闭合蕾丝信封，带艺术 LG 火漆章；轻触后封口掀开，拍立得只从信封口向上出现，运动中不会穿出信封底部。右上角音乐按钮控制陶喆《就是爱你》的 Apple Music 官方试听片段，轻触信封时也会尝试开始播放。两只鸟独立飞动，织物感椭圆蕾丝相框配合平滑的照片进退场。信息标签为 DATE、TIMELINE、ADDRESS，时间线居中。

## 源文件与部署

本仓库根目录的 `index.html`、`styles.css`、`app.js`、`fonts.css` 和 `assets/` 是当前维护源。GitHub Pages 从 `main` 根目录发布，`.nojekyll` 保留静态文件原样输出，无需构建。所有运行时资源均为本地相对路径。

修改在独立任务分支验证，再快进发布至 `main`。`migration-manifest.json` 记录文件校验值及可恢复的上一版本。旧的本地恢复副本不是这一版本的维护源。

## 本次验证

- 320×568、390×844 手机布局：一屏展示，底部按钮可见，无横向溢出。
- 闭合信封与「轻触信封」均可开封；上升动画中照片不会从信封底部穿出，最终仍有一部分留在信封内。
- 序言字符直接落到最终排版位置，支持减少动态效果设置。
- 六张轮播照片完整加载，保留 4.2 秒停留、0.9 秒平滑横向进退场；切换中两张不透明照片边缘紧邻，无人脸叠影或空白间隙。
- ADDRESS 页面只显示场地名和带定位图标的「前往导航」；既有时间线与飞鸟动画保留。
- 音乐可由开封动作启动，并可通过右上角按钮暂停、继续；播放器状态与无障碍标签同步。
- JavaScript 语法、相对资源引用、透明边框及字体加载检查通过。

## 美术素材

`assets/lace-envelope.png`、`assets/lace-envelope-v2.png`、`assets/oval-lace-v2.png`、`assets/side-lace.png`、`assets/seal-lg.png` 使用内置 image_gen 根据用户提供参考图提取、重建或调整。新版信封只改变外轮廓和比例，保留原有蕾丝材质与花纹。提示词记录在 `art-prompts.json`、`art-prompts-seal.json` 和 `art-prompts-envelope-v2.json`。

字体：IM Fell English、ZCOOL XiaoWei；授权文件在 `assets/`。数字使用系统 Georgia 衬线体。

## 场地与高德地图

In The Ark 在方舟礼堂：葭沚街道一江山大道7888号心海天地5号街区4幢103、203号。

页面不再展示完整门牌或“高德地图”文字，只保留定位图标和「前往导航」。入口继续采用用户提供的原始分享链接 https://surl.amap.com/2GpW2KO1tfrK ，点击后进入已核对的场地页面。

## 背景音乐

页面使用 Apple Music/iTunes Search API 返回的陶喆《就是爱你》官方试听音源。试听片段由 Apple 服务器提供，网站不托管或复制完整歌曲；其可用性取决于访问设备的网络与 Apple 服务。
