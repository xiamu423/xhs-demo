# Mobile Prototype Agent Guide

## Prototype Instructions

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. Do not replace it with a standalone page. Visual fidelity applies to app-owned content inside the device screen, not to template-owned device chrome.
- Keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.

## 本项目用户要求
以用户提供的搜索原UI截图为视觉基准，手机端路演优先。宽度600px及以下直接占满真实浏览器视口，使用系统键盘，不套第二层手机边框。桌面保留模板设备预览；这项响应式展示在prototype.css实现，未修改受保护运行时。原型不接后端、数据库或API，不自动发布上线。

## 用户侧文案原则（2026-11-12确认）
把本项目当作真实的小红书功能设计。用户页面不出现产品方案解释、实现细节、演示/模拟/预设/主案例说明、授权和署名机制解释、计数与召排规则、系统关联过程。不要用免责声明弥补未完成的体验。来源、时效提醒、真正影响选择的限制、保存失败与公开范围等有用信息可以保留，用自然简短的中文表达。创作者管理仅在作者身份下可见，测试控制不混入普通用户菜单。内部范围说明维护在项目文档中。后续新增文案也按此原则检查。

## 素材废弃（2026-11-12）
用户已废弃原永嘉路 Citywalk 笔记，等待新链接。旧笔记采集数据已移至 数据采集/archive/citywalk_01_abandoned，禁止继续采集或用于卡片。原型暂时取消旧 Citywalk 场景搜索映射与推荐入口；替换时使用新素材，不复用旧文案。

## 同主题统一结构（2026-11-12用户澄清）
同一个主题必须使用一致的结构规则。不同笔记只决定哪些字段有依据可以填写；无依据的字段不填写、不展示，不为每篇笔记创建另一套结构。美妆统一为：原帖背景 → 候选列表 → 每个候选的评价依据、用法、选择前留意、不同体验；所有内容绑定真实来源。候选数量不限，不强制三个候选，不补通用勾选清单。统一支持保存选择、独立标记/取消「抄了」、自愿反馈和撤回。提问者需求不等于候选已满足的事实，未购买/未使用不作为使用证据，AI 评论不得混为真人推荐。
本轮先完成美妆两篇笔记的 demo。其他主题采集由用户交给其他模型；不继续采集，不覆盖其采集文件。当前实现、规则和验收记录见 美妆结构规则与实现.txt。

## 搜索结果页 UI（2026-11-12）
按用户标注，搜索结果页右上角「更多」和「用户／商品／图片／视频」保留原有外观，但不可点击、不切换内容、不拉起浮层。「问点点」、搜索、真实笔记及作业入口保持可用。本轮移除含义不清且无反馈时筛空的「有反馈」筛选；真实反馈仍可从原笔记和已有引用入口查看。

## AI 总结与作业链路（2026-11-12）
搜索页 AI 总结采用用户图1的正文渐隐折叠样式，整张卡片是单一可点击热区，任何位置均进入点点详情页，不能在折叠卡里另设来源/作业分流按钮。详情按用户图2–7保留问句气泡、白色长回答、重点高亮、分节建议、候选配图/来源、选择提醒、后续追问与底部输入栏；只引用两篇已选笔记，不编造推荐比例。作业嵌在对应选择建议之后，候选快捷入口打开同一统一作业结构并定位相应项；关闭作业或查看来源返回后保留阅读位置。
AI 总结文案应直接帮助用户选择，采用「如果你偏好/在意 X → 可以考虑 Y → 理由与限制 → 哪篇笔记提供依据」，不能写成逐篇转述「笔记里觉得怎么样」。来源是建议的支撑，分歧应转为选择时需要核对的条件。不把个人体验扩大成对某肤色普遍适用的结论。

## 作业卡方案 Tab 与公共区域（2026-11-12用户确认）
候选折叠列表改为独立方案 Tab，点击切换一个当前方案，不叠加筛选。第一篇按日常粉色、粉紫闪片、全哑光、粉棕配色、跨品牌搭配命名；测评笔记按已确认系列或原帖图序命名。全部方案可展开选择；默认进入已保存方案，否则第一个方案，AI入口优先定位指定方案。浏览切换不等于保存；「选这个」保存单项决定，「抄了」独立记录。
方案专属用法、注意点、分歧和使用反馈随Tab切换；通用提醒、公共讨论、问一问、最新信息在下方作为共享区域。问答先用原评论真实问答并提供来源，新提问可关联当前方案或整份作业，支持回答、我也想问及撤回。
最新信息必须有内容、更新时间与可靠来源才展示；当前无核实更新，不造下架/停业消息，不放空占位。无教程依据不编造化妆步骤。所有美妆笔记复用同一结构，缺失字段不展示。

## 作业卡精简（2026-11-12，覆盖前述保存选择与独立背景规则）
用户确认移除作业卡顶部作者/来源归属、引导文案及独立的原帖信息模块，直接进入方案Tab；不展示「选一个方案看」。有价值的背景融入具体方案正文，无价值则不展示。
删除「选这个」及独立保存选择功能的UI入口、标记和说明；只保留「抄了」一个主按钮，标记后可取消。菜单改为我抄过的作业，旧choices仅兼容保留，不再参与展示或默认选择。
所有自己的反馈、问答及原评论区中的「撤回」统一称为「删除」，同一反馈删除后各引用同步消失。个人情况字段应跨主题通用：标签「个人情况」，placeholder「选填」；心得placeholder「说说抄作业的心得」。
移除反馈/提问/回答的公开展示及撤回说明，回答输入框不放placeholder；去掉「通用提醒」辅助标签、「没想明白的，问问用过的人」和作业底部「回到原笔记」。来源核对、返回作业和AI阅读返回链路保留。

## 标题留白与 AI 用户名引用（2026-11-12，按用户最新纠正）
弹层标题上下增加留白，保持拖拽条、标题、关闭按钮对齐。仅 AI 总结和作业方案 AI 归纳正文中的人名引用加「」并用浅蓝色；评论区用户名、原评论正文、笔记作者、来源署名、问答用户及其他身份字段保持原样，不全局替换。

## 搜索结果页精简（2026-11-12）
移除筛选条下方的“有一条新的使用反馈”提示模块，不再在搜索结果中额外插入反馈横条。底部“没有更多了”占满内容宽度并水平居中。

## 提问方案多选（2026-11-13）
提问区的候选必须来自当前作业全部方案，与作业Tab名称及顺序一致，不再只展示“整份作业＋当前产品”。使用勾选式多选，默认选中当前Tab，允许增加/取消选择；至少选一个方案并填写问题才能发布。新提问保存candidateIds数组，列表和详情展示全部关联方案；兼容历史candidateId单项记录。

提问方案选择区不展示“可多选”辅助文案，保留复选框及多选行为。

## 方案导航精简（2026-11-13）
作业卡去掉“全部 N 个/收起”整行及展开网格功能，直接显示可横向滑动的方案Tab，不保留该行占位；提问区全部方案多选不受影响。

点点详情页不展示底部“作业里的新体验”模块；仅移除该页面的模块，不删除实际反馈数据。

## 点点图标（2026-11-13）
搜索“问点点”入口、点点详情标题等场景统一使用 public/assets/content/diandian.svg。图标按用户参考重绘完整薄荷绿渐变轮廓，透明底，保持等比contain且不压缩，不再引用原本已裁切的diandian.png。

## 四主题扩展（2026-11-13 用户确认）
用户已确认进入其他主题实现，新增 query：电饭煲腊肠焖饭怎么做 / 白鞋洗完发黄怎么办 / 上海半天怎么逛。美妆仍为第一盘眼影怎么选。使用数据采集/notes 下 cooking_01/02、cleaning_01/02、citywalk_01/02；现 citywalk_01 是用户确认的新替代笔记，旧 archive/citywalk_01_abandoned 仍禁止使用。citywalk_02 的骑行内容已被用户允许纳入此场景。采集细节有用户批准的省略，不继续补采，也不覆盖原采集文件。
四场景统一保留搜索结果、原笔记、作业Tab、点点总结与来源/问答/心得链路。同主题采用相同字段：做饭可填用料、步骤、体验、注意与分歧；清洁可填适用条件、准备、步骤、体验与限制；出行可填路线、沿途安排、时间与限制。无依据字段不展示，不凑方案或“最新信息”。
新增采集是浏览器截图，展示时用 ContentImage 的 SVG 视口呈现照片区域；正文图片、评论真实照片与评论上下文证据截图要区分。无法识别的表情占位可以在展示层省略，原始采集保留。AI 评论不作为真人依据。特别注意腊肠不够加火腿的原反馈，不外推成完全替代；白鞋清洁的成功/损伤分歧；旅行历史营业与通行反馈不冒充当前信息。
本地存储沿用 xhs-beauty-v2，兼容既有反馈和“抄了”记录。点点总结收藏按场景保存，兼容旧美妆 answerSaved。新数据准备与引用校验分别见 scripts/prepare-scene-data.py、scripts/check-scene-content.mjs。

## 首页与点点入口（2026-11-13 用户确认）
默认首页参考用户发现页截图，只展示已采集的八篇笔记，双列瀑布流，真实封面、标题、作者和点赞数。顶部“关注”“上海”及底部“市集”“＋”“消息”“我”保留外观但不可点；发现/首页为当前频道。搜索入口连接已有输入页，本轮暂不重新设计搜索输入页。
首页左上点点可点击：整个首页向右滑出，露出点点聊天页；首页滚动位置在过渡与返回时保留。聊天页展示实际已有聊天记录及新的引导问题；无记录时只展示欢迎语和引导问题，不伪造历史。搜索点点总结与追问也进入聊天记录，沿用本地存储持久化；点击关闭回首页。引导优先尚未浏览的已有主题，回答和作业沿用现有来源数据。聊天仍为本地规则原型，不接模型或外部服务。
验收使用 ?qa=1，数据隔离到 xhs-qa-session；普通用户仍使用 xhs-beauty-v2，不覆盖原反馈。

## 搜索输入页（2026-11-13 用户确认，覆盖暂缓设计要求）
按用户搜索输入页参考重做：顶部灰色禁用搜索框，底纹词完整展示“受内容接口限制 请点击下方推荐query进行搜索”（按语义分两行）；猜你想搜只展示已有四个query，双列排布，去掉继续看等其他推荐。问ai、拍照搜、底部语音输入均不可点，搜索框不可编辑、不可获取焦点。首页搜索入口进入此页不拉起键盘，点击任一推荐query直接搜索。此处接口限制提示为用户明确指定的文案，优先于此前不露出技术说明的一般原则。

## 点点输入与更多入口禁用（2026-11-13）
首页进入的点点聊天页、搜索进入的点点总结页统一将聊天输入框置灰并禁用，不加额外提示，原占位文字保留；不获取输入焦点、不拉起键盘。所有场景右上角“…”均不可点，不再打开菜单。推荐query和预设追问保持原有可点击行为。

笔记底部评论输入入口的底纹词统一为“说点什么...”，设为disabled，不再点击打开作业或其他浮层（2026-11-13）。

搜索返回链路（2026-11-13）：搜索结果页左上返回及搜索框右侧叉号均进入搜索输入页；搜索输入页左上返回始终回首页，不再根据入口返回搜索结果。叉号不是原地清空。

## GitHub Pages 发布（2026-11-13 用户授权）
用户明确要求部署到账号xiamu423的github.io供线上验收。账号已有根站点，不覆盖；本项目使用独立仓库xhs-demo及路径/xhs-demo/。保留本地预览，发布采用Pages专用构建和GitHub Actions。受保护运行时不改，vite.pages.config.ts在构建期转换src内的资源URL和图片裁剪索引键，原本vite.config.ts不变。后续修改完成后校验并推送main触发线上更新，不接模型API。
