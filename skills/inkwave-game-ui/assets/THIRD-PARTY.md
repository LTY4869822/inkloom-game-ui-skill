# 来源与复用

设计参数、视觉分析与CSS参考来自amiaoapp/inkwave固定提交7c970e65beea8f54ca94d2ac326674e0c2e7279b，原作者Jayden Davis，MIT全文见INKWAVE-LICENSE.txt。复用派生代码时一并保留该文件。

fonts/TitanOne-latin.woff2与Rubik-latin.woff2原样来自该仓库，分别采用SIL OFL1.1；随附TitanOne-OFL.txt与Rubik-OFL.txt，来源为Google Fonts官方仓库对应字体目录。Latin子集不含汉字。其他引擎需支持的TTF/OTF等格式，不应直接使用这些WOFF2文件。

web/preview.html是原创组件演示，以抽象形状作场景，不包含原作Logo、乌贼角色、地图素材。references/screenshots/为原仓库UI Lab观察记录，仅作研究参照，不应直接混入目标游戏运行资产。

v2的adaptive-design决策、theme-profile.example.json虚构项目主题、applyInkTheme及新增主题示例为迁移设计；不是上游源码中的配色/功能或对真实游戏设定的声明。原作研究tokens保持冻结，新主题由调用技能的Codex依据项目生成。
