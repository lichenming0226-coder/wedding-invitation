# 李晨鸣 & 高雅婷的婚礼邀请

婚期：2026 年 11 月 20 日（农历十月十二，星期五）。

访问：https://lichenming0226-coder.github.io/wedding-invitation/

当前版本使用深棕色纸张、两侧蕾丝织物、独立提取的蕾丝信封和椭圆法式蕾丝相框。轻触信封，宽明信片缓缓升起；序言逐字从上方落到各自行内位置。婚礼信息页按手机可用高度缩放照片，保留完整姓名、信息和底部切换按钮。

## 源文件与部署

本仓库根目录的 `index.html`、`styles.css`、`app.js`、`fonts.css` 和 `assets/` 是当前维护源。GitHub Pages 从 `main` 根目录发布，`.nojekyll` 保留静态文件原样输出，无需构建。所有运行时资源均为本地相对路径。

修改在独立任务分支验证，再快进发布至 `main`。`migration-manifest.json` 记录文件校验值及可恢复的上一版本。旧的本地恢复副本不是这一版本的维护源。

## 本次验证

- 320×568、375×667、390×844 手机布局：一屏展示，底部按钮可见，无横向溢出。
- 蕾丝信封和宽明信片在小屏正常展开；照片完整保留。
- 序言字符直接落到最终排版位置，支持减少动态效果设置。
- 六张轮播照片完整加载，日期、流程、地点可切换，保留 4.2 秒照片停留。
- JavaScript 语法、相对资源引用、透明边框及字体加载检查通过。

## 美术素材

`assets/lace-envelope.png`、`assets/oval-lace.png`、`assets/side-lace.png` 使用内置 image_gen 根据用户提供参考图提取和重建。仅保留指定蕾丝元素，不包含参考图的人物、文字或其他装饰。提示词记录在 `art-prompts.json`。

字体：IM Fell English、ZCOOL XiaoWei；授权文件在 `assets/`。数字使用系统 Georgia 衬线体。
