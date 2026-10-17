# 素材与玩法来源

- 四方向人物与走路帧：Kenney RPG Urban Pack，CC0。https://kenney.nl/assets/rpg-urban-pack
- 后备人物组合：Kenney Roguelike Characters，CC0。https://kenney.nl/assets/roguelike-characters
- Kenney 作者页面：https://kenney-assets.itch.io/
- 现代办公家具、地图绘制、用户界面与剧情：本项目原创；房间布局来自用户确认的设计。
- 机制参考研究：https://github.com/HamzaKhanBUIC/Last-Signal （视锥、墙体遮挡、状态机）；https://github.com/Priyanshu-Iron/Echoes-of-the-Hidden （NPC日常和事件）。本项目独立编写，没有复制仓库代码。
- 日常生活游戏氛围参考，不使用《星露谷物语》的美术、角色或音乐。

本作是虚构卡通游戏，所有特制茶、电路、空调机关仅为抽象计时与状态切换，无现实配方或操作步骤。

## 回合制与潜行升级参考（独立实现）
- https://github.com/TheCelestialMarauder/Mini-RPG （MIT）：对标玩家行动、对手回合、物品和结算的分离。
- https://github.com/ondras/rot.js （BSD-3-Clause）：对标行动调度、通行回调和寻路思路。
- https://github.com/HamzaKhanBUIC/Last-Signal ：阅读其公开 EnemyAI 组织结构，对标巡逻、调查、搜索的状态划分；未复制源代码。
- 本版战斗引擎、事件链、技能、文案、检查点和UI均为原创代码，未引入上述仓库依赖。
