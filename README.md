# 小红书「抄作业」原型

四个主题、八篇笔记的移动端交互原型：眼影选购、电饭煲焖饭、白鞋清洁、上海半日游。

线上地址：https://xiamu423.github.io/xhs-demo/

## 本地运行

使用 Node.js 22.12 及以上版本：

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4173
```

## 发布

仓库启用 Settings → Pages → GitHub Actions。推送到 `main` 后，工作流检查受保护移动运行时、构建并部署静态页面。

```sh
npm run build:pages
```

Pages 专用配置通过构建期转换将资源路径适配到 `/xhs-demo/`，原本的本地配置、移动运行时与 Sites 构建保持不变。

数据已经包含在 `src` 和 `public` 中，部署不依赖外部采集目录。聊天、反馈、收藏和“抄了”状态仅存当前浏览器；没有模型 API、服务端账号或跨用户同步。

笔记内容和媒体用于本交互原型的展示，保留原作者与来源标识。第三方图标的许可随对应资源保留。

### 展示图片维护

原始采集资源保留在 public/assets/beauty 与 public/assets/scenes。导入新图片后，使用安装 Pillow 的 Python 执行 `python3 scripts/optimize-content-images.py`，生成预裁切的 WebP 预览/详情和 src/image-assets.json，再运行 `npm run check:images`。生成物随仓库保存，部署时不依赖 Python。

手机使用应用层原生滚动适配，桌面设备预览继续使用模板滚动物理。手机性能修复、分批回复与体验配图已完成本地验收，用户于 2026-11-13 确认发布。

使用体验可选填最多 9 张图片。图片在浏览器压缩后存入 IndexedDB，反馈与图片仅在当前浏览器保留，未接图片服务器或跨用户同步。`?qa=1` 使用独立附件库。
