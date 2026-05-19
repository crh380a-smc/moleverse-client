# moleverse-client

一个使用 Electron 构建的平行摩尔 Flash 微端，可在未安装 Adobe Flash Player 的操作系统上游玩平行摩尔，让您回味童年的美好时光。

## 一、下载方式

1. 本项目仓库 [Release](https://github.com/crh380a-smc/moleverse-client/releases) 页面。
2. [平行摩尔](https://mole.61player.com/) 游戏页面。在 **“没有Flash？”** 选项卡中找到对应的版本下载。

## 二、功能清单

1. 节点切换功能。除了平行摩尔服务器外，还可以切换至官方服务器（国服、台服）进行游玩。
2. 提供服务器镜像模式 <sup>[[1]](#ex1)</sup> ，尝试解决部分地区连接服务器不顺畅的问题。
3. 提供自定义平行摩尔镜像节点设置 <sup>[[2]](#ex2)</sup> 。当微端内置的镜像节点不能满足您的需求，可以选择其余开发者提供的镜像节点或者自建镜像节点。
4. 提供软刷新、硬刷新（清除缓存）菜单功能。
5. 收录米饭社区、米米号注册、淘米客服等官方实用链接，并提供官方服务器更新内容查询。
6. 内置 Chromium 原生开发者工具（DevTools）。如您具备Web调试技能，可开展Web调试。

## 三、应用内快捷键

| 快捷键 | 功能 |
| :-----: | :----- |
| `F5` | 刷新当前页面（软刷新） |
| `Ctrl` + `F5` | 清除缓存并刷新当前页面（硬刷新） |
| `Ctrl` + `F12` | 打开开发者工具（DevTools） |

## 四、自行构建客户端

您可以获取此微端的源代码进行修改，构建符合自身需求的微端。具体步骤如下：

**1.克隆此仓库（通过HTTPS或SSH），或者下载源代码**

```
git clone https://github.com/crh380a-smc/moleverse-client.git (via HTTPS)

git clone git@github.com:crh380a-smc/moleverse-client.git (via SSH)
```

**2.安装 [Node.js](https://nodejs.org/)**

**3.安装必要依赖**

```
npm install
```

**4.启动本地调试**

```
npm run dev
```

此命令将会运行微端的开发模式，并提供控制台输出。

**5.打包微端**

```
npm run pack
```

此命令将会打包生成所在操作系统的微端，默认的生成目录为 `dist/` 。

**6.发布微端**

```
npm run dist
```

此命令将会打包生成所在操作系统的微端，并压缩成 .zip 供后续的发布流程使用。默认的生成目录为 `dist/` 。

## 五、注意事项

<span id="ex1">[1] 此微端内置的镜像节点由 [@C.R.H](https://github.com/crh380a-smc) 提供。以下是镜像列表：</span>

| 镜像名称 | 镜像地址 | 说明 |
| :-----: | :-----: | :----- |
| 官方服务器（国服）镜像 | [http://mole-mirror.kuro-smc.moe/](http://mole-mirror.kuro-smc.moe/) | 适用于境外摩尔回连官方国服 |
| 官方服务器（台服）镜像 | [http://mole-tw-mirror.kuro-smc.moe/](http://mole-tw-mirror.kuro-smc.moe/) | 适用于境内摩尔连接官方台服 |
| 平行摩尔（亚洲节点）镜像 | [https://mole-sub.61player.com/](https://mole-sub.61player.com/) | 适用于平行摩尔主节点网络拥堵、亚洲节点延迟较高的情况 |
| 平行摩尔（亚洲节点）救援镜像 | [http://175.178.55.57/](http://175.178.55.57/) | 适用于境内部分区域（特别是福建）无法正常连接平行摩尔主节点、亚洲节点的情况 |

<span id="ex2">[2] 使用自定义镜像节点时，请您仔细确认镜像提供者的意图和目的。我个人建议您理解其使用风险，保持谨慎，并时刻注意您的账号安全。</span>

## 六、常见问题

### 1. Linux 版本提示 `chrome-sandbox` 权限不足的解决方法

下载 Linux 微端解压后，运行时会提示：

```
The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that /path/to/your/mole-client/chrome-sandbox is owned by root and has mode 4755.
```

此时可通过下列命令获取权限：

```
# 进入您的 Linux 微端目录
cd /path/to/your/mole-client

# 设置所有者为 root
sudo chown root ./chrome-sandbox

# 设置权限
sudo chmod 4755 ./chrome-sandbox
```

此时重新进入微端，即可解决问题。
