# 李晨鸣 & 高雅婷的婚礼邀请

婚期：2026 年 11 月 20 日（农历十月十二，星期五）。

访问：https://lichenming0226-coder.github.io/wedding-invitation/

当前版本使用半透明深棕色纸张，透出参考图重建的灰色蕾丝与四组无文字白色装饰图案。封面为轮廓柔和的闭合蕾丝信封，带艺术 LG 火漆章；轻触后封口掀开，拍立得只从信封口向上出现。封面与照片页的英文标题使用本地 Italianno 婚礼手写体；封面底部的 “Love begins our journey” 使用更细、更小的本地 Italianno 专用子集。右上角音乐按钮控制陶喆《就是爱你》的本地完整 AAC/M4A 音源。两只鸟独立飞动，织物感椭圆蕾丝相框配合平滑的照片进退场。信息标签为 DATE、TIMELINE、ADDRESS，时间线居中。

## 分享预览与加载策略

页面提供完整的 Open Graph、Twitter Card、`image_src` 与 canonical 元数据。主分享封面是 `assets/share-thumbnail-original-20260925.jpg`（600×600 JPEG，公开绝对 HTTPS URL）：仅从仓库原始 `gallery-01.jpg` 固定裁切、缩放并叠加细边框，不使用生成式重绘、磨皮、补脸或色彩调制。

分享卡片描述精简为“2026年11月20日｜台州 In The Ark 在方舟礼堂”，不再显示“诚邀您见证我们的婚礼”。

首屏视觉使用按展示尺寸重采样的 WebP；序言、相框和二十张相册图改为进入相应阶段前再加载。背景音乐在页面进入时立即发起官方试听音源的加载与播放，并在微信桥接器就绪或首次触摸时重试；浏览器或微信仍可能依据自己的自动播放策略拦截首次有声播放。`service-worker.js` 会缓存同源核心资源和已访问的后续资源，降低重复打开时对 GitHub Pages 边缘缓存与网络状态的依赖。

注意：微信是否显示外链安全提示由微信的链接风控、域名信誉、备案和公众号配置共同决定，网页前端代码不能关闭或绕过该提示。若需要可控的微信自定义分享卡片与更高的中国大陆可用性，应使用自有已备案域名、认证公众号的 JS 接口安全域名，以及可在中国大陆稳定访问的 CDN/对象存储；这属于后续域名与平台配置，不由当前 GitHub Pages 静态页单独完成。

仓库根目录包含微信要求的站点校验文件 `c90bc8a611d176d0a69aa5b0dcf7337b.txt`。在当前 GitHub Project Pages 部署结构中，其公网地址为 `https://lichenming0226-coder.github.io/wedding-invitation/c90bc8a611d176d0a69aa5b0dcf7337b.txt`。该文件完成的是站点所有权校验材料发布，微信是否解除安全提示以及生效时间仍由微信侧审核和缓存决定。

## 源文件与部署

本仓库根目录的 `index.html`、`styles.css`、`app.js`、`fonts.css` 和 `assets/` 是当前维护源。GitHub Pages 从 `main` 根目录发布，`.nojekyll` 保留静态文件原样输出，无需构建。页面资源均为同源相对路径。

修改在独立任务分支验证，再快进发布至 `main`。`migration-manifest.json` 记录文件校验值及可恢复的上一版本。旧的本地恢复副本不是这一版本的维护源。

优化图与分享封面由 `scripts/optimize-assets.mjs` 使用 Sharp 0.35.4 从仓库内的原始素材确定性生成。方形分享图直接从无字 `gallery-01.jpg` 固定裁切，不使用生成式人脸重绘，也不改变色彩。执行时需让 Node.js 能解析 `sharp`（例如设置包含 Sharp 的 `NODE_PATH`）。该脚本只用于素材更新时重建；运行时不依赖 Node.js。

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
- 封面底部文案 “Love begins our journey” 改用更细的 Italianno 专用子集，并缩小约 20%；320×568 与 390×844 下均保持单行且页面无溢出。
- 「轻触信封」「婚礼指南」「前往导航」从首次呈现起均使用金色。
- 分享图尺寸、Open Graph 字段、JavaScript 语法、相对资源引用、透明边框及字体加载检查通过。
- 方形分享图不含任何文字；从原始 `gallery-01.jpg` 裁切，不做 AI 重绘或色彩美化，人物面部保持原始照片像素特征。
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
- 无字居中分享图提交：`0940f6ca9b600046daaff4df5a6f024078601089`
- 无字分享图 GitHub Pages 运行：[36101975386](https://github.com/lichenming0226-coder/wedding-invitation/actions/runs/36101975386)，结论 `success`
- 线上新图为 600×600 JPEG、40,796 字节，SHA-256 与本地一致；浏览器只请求新无字文件，旧带字图请求为 0

## 美术素材

`assets/lace-envelope.png`、`assets/lace-envelope-v2.png`、`assets/oval-lace-v2.png`、`assets/side-lace.png`、`assets/seal-lg.png` 和 `assets/lace-ornament-bg-v2.png` 使用内置 image_gen 根据用户提供参考图提取、重建或调整。新版背景保留蕾丝织物和白色装饰轮廓，并清除参考图中的所有文字、编号、标志与水印。提示词记录在 `art-prompts.json`、`art-prompts-seal.json`、`art-prompts-envelope-v2.json` 和 `art-prompts-background-v2.json`。

字体：IM Fell English、ZCOOL XiaoWei、Italianno；授权文件在 `assets/`。Wedding Invitation 与 Welcome to our wedding 使用 Italianno；Love begins our journey 使用仅保留所需字符的更细 Italianno WOFF2 子集。

## 场地与高德地图

In The Ark 在方舟礼堂，页面补充地区小字「台州市椒江区」。

页面不再展示完整门牌或“高德地图”文字，只保留定位图标和「前往导航」。入口继续采用用户提供的原始分享链接 https://surl.amap.com/2GpW2KO1tfrK ，点击后进入已核对的场地页面。

## 背景音乐

用户提供的源文件为 `/Users/lichenming/Downloads/04 - 就是爱你.flac`。源文件是可完整解码的 44.1 kHz、16-bit、双声道 FLAC，时长 261.906667 秒，元数据为陶喆《就是爱你》、专辑《太平盛世》。网页使用由该文件转码得到的 `assets/love-can-full-20260925.m4a`：AAC-LC 160 kbps、44.1 kHz、双声道、faststart，时长 261.906009 秒、大小约 5.1 MB。音频不加入 Service Worker 预缓存，浏览器通过普通 HTTP/Range 渐进加载。页面进入时立即尝试播放；浏览器拦截有声自动播放时，会持续监听首次 `touchstart`、`pointerdown`、`click` 或 `keydown`，直到真正播放成功后才解除监听。微信桥接器无论在脚本前后就绪都会触发重试，页面恢复和音频 metadata 就绪时也会补充重试。
