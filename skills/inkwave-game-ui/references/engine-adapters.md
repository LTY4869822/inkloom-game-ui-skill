# 引擎适配：只读当前项目对应章节

先读adaptive-design.md，根据项目事实生成主题。assets/inkwave.tokens.json的source仅为原作参考，assets/theme-profile.example.json示范项目主题结构。共同输出项目主题、重新决定的布局/反馈、真实数据绑定和能运行的页面。以下是迁移建议，非原作使用Godot/Unity的证据。API不确定时查安装版本的官方文档。

## Web / React / Vue / Canvas

DOM项目将项目token映射为局部CSS变量。applyInkTheme(root,theme)支持完整自定义角色色和反馈时长/幅度；setInkPalette(root,a,b)仍可接任意#rrggbb，inkPalettes仅是可选研究参考。主题函数不自动重排场景，按项目需求实际修改Grid/Flex、锚点、组件流程与密度。`assets/web/inkwave-ui.css`限于`.inkwave-theme`。mountInkFeedback(root,{sound})返回清理函数，使用原生click和冒泡ink-action；data-ink-nav仅给同组按钮上下导航，字段/滑杆保留原生行为。

React/Vue由组件状态派生aria-pressed/selected，在effect/onMounted挂载并清理；不要让模块与框架同时维护selected。复用项目手柄与焦点系统，样例未内置手柄轮询。卸载清理事件、pointer、rAF和计时。

独立scale/translate需在目标浏览器验证；旧环境改成外层倾斜、内层缩放。Canvas/bitmap UI复用token、状态与命中，无需强制改DOM。WebGL独立渲染，通常不把全部界面烘到3D平面。

原生button/range/dialog和键盘/aria/disabled优先保留；focus-visible持续可见，触屏短暂press。小屏grid重排或滚动并保留最小命中尺寸。preview.html只验证组件，不代替目标项目实现。

## Godot 4

Theme/ThemeVariation、StyleBoxFlat或项目九宫格区分dark panel与sticker。白切边/墨外圈/硬影可嵌套Control/Panel或NinePatchTexture；不要每卡新增模糊视口。多重轮廓不易用单StyleBox表示时分层。

标题用合法字体及FontVariation，Label/Theme的outline_size/color和shadow对应轮廓；正文不描粗边。附带Latin WOFF2只供Web，Godot需支持的TTF/OTF等格式，优先用项目合法字体。中文确认含汉字。

CanvasLayer分HUD/菜单/覆盖，anchors+Container布局，横屏stretch参考16:9，安全区/小屏滚动另处理。倾斜外层、press内层，pivot居中；不要Tween Container管理的位置，动画子节点scale/modulate/偏移。

复用InputMap的ui方向/accept/cancel，focus_neighbor/next/previous设图；进屏grab_focus，返回恢复ID。LineEdit独占编辑输入，消费GUI事件防穿透，装饰mouse_filter=IGNORE。

mouse_entered/focus_entered汇到focus，button_down/up做挤压，pressed调用现有动作。SceneTreeTween TRANS_BACK只是原CSS曲线的近似，需调参；取消旧Tween后确定最终状态。玩法物理参数不随UI换皮修改。

2D用已有Sprite/TextureRect，3D用已有相机或SubViewport，限制多次渲染。不造乌贼角色。泼墨Shader/TextureRect中点切屏一次，低动态改短淡入。

验证编辑器/场景、返回、弹窗、重开、窗口尺寸；无Godot执行条件时区分源修改与未运行。

## Unity UGUI / UI Toolkit

保留项目既有系统。UGUI用CanvasScaler、anchors/LayoutGroup/SafeArea；不额外挂多个EventSystem或全局InputActionAsset。UIToolkit用USS变量/class/事件，按项目版本确认transform/mask/focus。

粗边贴纸用九宫格或少量嵌套Image，避免多个Outline组件膨胀顶点/draw call。标题用已有TMP材质outline/underlay；中文atlas/fallback含目标字形，不把WOFF2直接当TMP字体。倾斜外层、press/focus内层。

Selectable明确邻居，EventSystem.currentSelectedGameObject为焦点入口，复用UI InputModule。PointerEnter/Exit与Select/Deselect共享状态；pointer和submit只调用一次Button.onClick。触屏清残留hover。

暂停保持原TimeScale/网络语义，UI动画用unscaled时间以便暂停可操作。DOTween/LeanTween仅在项目已有时使用；否则Coroutine/Animator。取消旧动画并清理OnDisable/Destroy，中点动作至多一次。移动端优先轮廓/对比/反馈，控制模糊与透明过绘。

验证项目版本Editor/Play Mode、键鼠/已有手柄、暂停、结算连按、SafeArea。无Editor时不把静态/编译检查称为实机测试。
