# 李晨鸣 & 高雅婷的婚礼邀请

婚期：2026 年 11 月 20 日（农历十月十二，星期五）。

访问：https://lichenming0226-coder.github.io/wedding-invitation/

当前版本使用半透明深棕色纸张，透出参考图重建的灰色蕾丝与四组无文字白色装饰图案。封面为轮廓柔和的闭合蕾丝信封，带艺术 LG 火漆章；轻触后封口掀开，拍立得只从信封口向上出现。封面与照片页的英文标题使用本地 Italianno 婚礼手写体。右上角音乐按钮控制陶喆《就是爱你》的 Apple Music 官方试听片段。两只鸟独立飞动，织物感椭圆蕾丝相框配合平滑的照片进退场。信息标签为 DATE、TIMELINE、ADDRESS，时间线居中。

## 分享预览与加载策略

页面提供完整的 Open Graph、Twitter Card、`image_src` 与 canonical 元数据。主分享封面是 `assets/share-thumbnail-20260925.jpg`（600×600 JPEG，公开绝对 HTTPS URL），使微信等偏好方图的平台生成方形带图卡片。

首屏视觉使用按展示尺寸重采样的 WebP；序言、相框和二十张相册图改为进入相应阶段前再加载。背景音乐在页面进入时立即发起官方试听音源的加载与播放，并在微信桥接器就绪或首次触摸时重试；浏览器或微信仍可能依据自己的自动播放策略拦截首次有声播放。`service-worker.js` 会缓存同源核心资源和已访问的后续资源，降低重复打开时对 GitHub Pages 边缘缓存与网络状态的依赖。

注意：微信是否显示外链安全提示由微信的链接风控、域名信誉、备案和公众号配置共同决定，网页前端代码不能关闭或绕过该提示。若需要可控的微信自定义分享卡片与更高的中国大陆可用性，应使用自有已备案域名、认证公众号的 JS 接口安全域名，以及可在中国大陆稳定访问的 CDN/对象存储；这属于后续域名与平台配置，不由当前 GitHub Pages 静态页单独完成。

## 源文件与部署

本仓库根目录的 `index.html`、`styles.css`、`app.js`、`fonts.css` 和 `assets/` 是当前维护源。GitHub Pages 从 `main` 根目录发布，`.nojekyll` 保留静态文件原样输出，无需构建。除 Apple 官方音乐试听外，页面资源均为同源相对路径。

修改在独立任务分支验证，再快进发布至 `main`。`migration-manifest.json` 记录文件校验值及可恢复的上一版本。旧的本地恢复副本不是这一版本的维护源。

优化图与分享封面由 `scripts/optimize-assets.mjs` 使用 Sharp 0.35.4 从仓库内的原始素材确定性生成。执行时需让 Node.js 能解析 `sharp`（例如设置包含 Sharp 的 `NODE_PATH`）。该脚本只用于素材更新时重建；运行时不依赖 Node.js。

每次修改 precache 清单或核心资源时都要同步更新 `service-worker.js` 的 `CACHE` 名称，避免已安装客户端长期沿用旧壳。页面导航采用联网优先，断网时才回退到缓存壳，确保新分享元数据和样式及时生效。

## 本次验证

- 320×568、390×844 手机布局：一屏展示，底部按钮可见，无横向溢出。
- 闭合信封与「轻触信封」均可开封；上升动画中照片不会从信封底部穿出，最终仍有一部分留在信封内。
- 新序言共十一行，整体居中并在一屏内呈现；字符直接落到最终排版位置，支持减少动态效果设置。
- 二十张用户原始 JPEG 继续作为保真源文件保留；页面运行时使用 720px 以内的 WebP 衍生图并按轮播进度加载，每张约展示 3 秒，保留 0.9 秒平滑横向进退场。
- ADDRESS 页面显示场地名、地区小字「台州市椒江区」和带定位图标的「前往导航」；导航文字明确使用与正文一致的中文字体。
- 半透明棕色内容层可见下方蕾丝和白色装饰图案，参考图中的文字、编号、标志和水印均未保留。
- 音乐在页面进入时立即预加载并尝试播放；若浏览器拦截，则在微信桥接器就绪、第一次轻触页面或点击音乐按钮时重试。右上角按钮可暂停、继续，播放器状态与无障碍标签同步。
- 喷泉插画在常规手机上放大至约 203px、短屏上约 131px，并与上方文字分别保留约 35px 和 15px 间距；两个尺寸下按钮仍完整位于首屏。
- 「轻触信封」「婚礼指南」「前往导航」从首次呈现起均使用金色。
- 分享图尺寸、Open Graph 字段、JavaScript 语法、相对资源引用、透明边框及字体加载检查通过。
- 原始线上冷开基线为 37 个响应、约 16.9 MB 同源资源、提前请求全部 20 张相册图；图片优化后首屏仍低于 0.7 MB 且不请求相册或序言图。当前按本次要求会立即请求音乐，但不会让后续图片与它争抢带宽。
- 320×568 与 390×844 均无横向或纵向溢出；Service Worker 安装、控制、缓存命中和离线首屏恢复通过。

## 发布记录

- 功能提交：`61520f36619d98a82d716266eb2116d928e66371`
- GitHub Pages 运行：[36097953892](https://github.com/lichenming0226-coder/wedding-invitation/actions/runs/36097953892)，结论 `success`
- 上一性能版本线上冷开：16 个响应、约 0.67 MB 同源资源、0 张相册预载、0 个音频请求；当前版本额外恢复 1 个立即发起的官方音频请求
- 线上完整路径：开信封、序言、相册轮播、ADDRESS 导航、Service Worker 控制与离线回访均通过，控制台无错误
- 线上 `index.html`、分享横图、分享方图与 Service Worker 的 SHA-256 均与提交内容一致
- 方图、音乐启动与喷泉调整提交：`9ed5fd67fc163bc8cfa4f2b218b2eccfa5b2afb4`；缓存刷新提交：`57e8e8e49bb3bc531b3213058385292aac00ef58`
- 最终 GitHub Pages 运行：[36099664083](https://github.com/lichenming0226-coder/wedding-invitation/actions/runs/36099664083)，结论 `success`
- 线上方图为 600×600 JPEG；自动播放允许时进入即播放，默认策略下首次触摸恢复；390×844 喷泉约 203px、文字间距约 35px，均无控制台错误

## 美术素材

`assets/lace-envelope.png`、`assets/lace-envelope-v2.png`、`assets/oval-lace-v2.png`、`assets/side-lace.png`、`assets/seal-lg.png` 和 `assets/lace-ornament-bg-v2.png` 使用内置 image_gen 根据用户提供参考图提取、重建或调整。新版背景保留蕾丝织物和白色装饰轮廓，并清除参考图中的所有文字、编号、标志与水印。提示词记录在 `art-prompts.json`、`art-prompts-seal.json`、`art-prompts-envelope-v2.json` 和 `art-prompts-background-v2.json`。

字体：IM Fell English、ZCOOL XiaoWei、Italianno；授权文件在 `assets/`。Wedding Invitation 与 Welcome to our wedding 使用 Italianno，数字使用系统 Georgia 衬线体。

## 场地与高德地图

In The Ark 在方舟礼堂，页面补充地区小字「台州市椒江区」。

页面不再展示完整门牌或“高德地图”文字，只保留定位图标和「前往导航」。入口继续采用用户提供的原始分享链接 https://surl.amap.com/2GpW2KO1tfrK ，点击后进入已核对的场地页面。

## 背景音乐

用户提供的网易云分享链接为 https://163cn.tv/bgOWYThL ，对应歌曲 ID 150430。已核对网易云官方外链播放器，但它在当前浏览器环境中仍要求用户触发播放，并且不能作为本站自定义按钮可控的同源背景音频。仓库未下载、复制或盗链未经授权的完整歌曲；在没有用户提供的授权音频文件或合法可直连完整音源前，页面继续使用 Apple Music/iTunes Search API 返回的陶喆《就是爱你》官方试听音源。其可用性取决于访问设备的网络、浏览器自动播放策略与 Apple 服务。
