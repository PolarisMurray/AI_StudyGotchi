# 📚 AI Learning Companion

<div align="center">

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Your Live2D AI Study Buddy**

[English](#english) | [中文](#中文)

</div>

---

<a id="english"></a>

## 🌟 Introduction

**AI Learning Companion** is an intelligent study assistant designed for students, developers, and knowledge workers. It combines **Live2D animated characters** with an **AI learning engine** to provide high-quality explanations, key point extraction, auto-generated practice questions, and a companion that truly "studies with you."

## ✨ Core Features

### 🎓 AI Study Assistant
- **Multi-Subject Support**: Math, Physics, CS, Chemistry, English, Economics, etc.
- **Photo Q&A (OCR)**: Instant explanations in seconds
- **Auto Summarization**: Generate examples and practice questions
- **Model Support**: OpenAI / GPT-4.1 / Local Models / MLX

### 📕 Auto-Generated Study Materials
- **Flashcards**: Automatically create memory cards
- **Exam Highlights**: Extract key points for tests
- **Auto Quiz Generation**: Multiple choice & short answer questions
- **Lecture Notes**: Organize class notes automatically

### 🪄 Live2D Study Companion
- **Multiple Character Themes**: Choose your favorite study buddy
- **Focus Mode**: Character enters study mode with you
- **Smart Reminders**: Gentle nudges when you check your phone
- **Adaptive Expressions**: Reactions based on your study progress

### ⏱ Pomodoro Timer + Study Reports
- **Pomodoro Technique**: Built-in productivity timer
- **Weekly Reports**: Automatic study progress summaries
- **iCloud Sync**: Seamless data backup across devices

### 📌 Global Study Assist (Floating Window)
- **PiP-Style Mini Window**: Quick access anywhere
- **Cross-App AI**: Call AI assistant from any app
- **Screen OCR**: Explain current screen content instantly

## 🧩 Technical Stack

```
SwiftUI + Live2D iOS SDK
OpenAI API / Apple MLX / Local Models
Vision Framework (OCR)
Core Data + iCloud Sync
```

### Key Technologies
- **SwiftUI**: Modern declarative UI framework
- **Live2D Cubism SDK**: Smooth 2D character animations
- **Vision Framework**: On-device OCR with full privacy protection
- **MLX Integration**: Local AI inference on Apple Silicon
- **Universal App**: Native support for iPhone & iPad

## 🛍 Monetization Strategy (Planned)

| Feature | Free | Pro |
|---------|------|-----|
| Basic AI Queries | 10/day | ∞ |
| OCR Scans | 5/day | ∞ |
| Live2D Characters | 2 | All |
| Study Packs | Basic | Premium (CS, AP, SAT, TOEFL) |
| PDF Reports | ✗ | ✓ |
| Character Store | ✗ | ✓ |

## 📦 Project Structure

```
AI_StudyGotchi/
├── AI_StudyGotchi/          # Main app
│   ├── Views/               # SwiftUI views
│   ├── Models/              # Data models
│   ├── Services/            # AI, OCR services
│   └── Live2D/              # Live2D integration
├── live2d-extension/        # Chrome extension companion
│   ├── models/              # Live2D models
│   ├── waifu-tips.js        # Character interactions
│   └── manifest.json        # Extension config
└── Resources/               # Assets & configs
```

## 🚀 Quick Start

### Prerequisites
```bash
Xcode 15.0+
iOS 17.0+ / iPadOS 17.0+
Swift 5.9+
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/AI_StudyGotchi.git
cd AI_StudyGotchi
```

2. **Install dependencies**
```bash
# Install Live2D Cubism SDK (follow official guide)
# Add your OpenAI API key to Config.swift
```

3. **Build and run**
```bash
open AI_StudyGotchi.xcodeproj
# Press Cmd+R to build and run
```

## 🎯 Roadmap

- [x] Basic AI Q&A functionality
- [x] OCR image recognition
- [x] Live2D character integration
- [x] Chrome extension companion
- [ ] Flashcard system
- [ ] Pomodoro timer
- [ ] Study analytics dashboard
- [ ] Multi-language support
- [ ] App Store release

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature suggestions
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 Translations

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Live2D Cubism SDK](https://www.live2d.com/) - Character animation
- [OpenAI](https://openai.com/) - AI capabilities
- [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget) - Web integration inspiration

## 📮 Contact

- **Author**: Alex
- **Project**: [AI_StudyGotchi](https://github.com/yourusername/AI_StudyGotchi)
- **Issues**: [GitHub Issues](https://github.com/yourusername/AI_StudyGotchi/issues)

---

<div align="center">

**Made with ❤️ for students worldwide**

[⬆ Back to Top](#-ai-learning-companion)

</div>

---

<a id="中文"></a>

## 🌟 项目简介

**AI Learning Companion** 是一款专为学生、开发者、知识工作者打造的智能学习助手 App。它将 **Live2D 动态角色**与 **AI 学习引擎**深度结合，让你在学习过程中随时获得高质量解释、重点提取、自动生成练习题，并拥有一个真正能"陪你学习"的伙伴。

## ✨ 核心功能

### 🎓 AI 智能学习助手
- **支持任何科目**：数学、物理、CS、化学、英语、经济等
- **拍照提问（OCR）**：秒级解释
- **自动总结**：生成例题、练习题
- **模型支持**：OpenAI / GPT-4.1 / 本地模型 / MLX

### 📕 自动生成学习素材
- **记忆卡片**：自动生成 Flashcards
- **考试重点**：自动提取重点内容
- **自动出题**：多选题、简答题
- **课堂笔记**：自动整理 Lecture Notes

### 🪄 Live2D 学习陪伴角色
- **多主题角色**：选择你喜欢的学习伙伴
- **专注模式**：学习时角色进入专注状态
- **智能提醒**：刷手机会提醒你重新专注
- **动态表情**：根据学习进度变化表情与互动

### ⏱ 番茄钟 + 学习报告
- **番茄工作法**：内置专注计时器
- **每周报告**：自动生成学习进度总结
- **iCloud 同步**：跨设备无缝数据备份

### 📌 全局学习辅助（浮窗）
- **类似 PiP 的小窗**：随时随地快速访问
- **跨应用 AI**：在任何 App 中调出助手
- **屏幕 OCR**：即时解释当前屏幕内容

## 🧩 技术栈

```
SwiftUI + Live2D iOS SDK
OpenAI API / Apple MLX / 本地模型
Vision Framework (OCR)
Core Data + iCloud Sync
```

### 核心技术
- **SwiftUI**：现代声明式 UI 框架
- **Live2D Cubism SDK**：流畅的 2D 角色动画
- **Vision Framework**：设备端 OCR，完整隐私保护
- **MLX 集成**：Apple 芯片本地 AI 推理
- **通用应用**：原生支持 iPhone & iPad

## 🛍 商业化模式（规划中）

| 功能 | 免费版 | Pro 版 |
|------|--------|--------|
| AI 查询次数 | 10次/天 | 无限 |
| OCR 扫描 | 5次/天 | 无限 |
| Live2D 角色 | 2个 | 全部 |
| 学习包 | 基础 | 高级 (CS, AP, SAT, TOEFL) |
| PDF 报告 | ✗ | ✓ |
| 角色商店 | ✗ | ✓ |

## 📦 项目结构

```
AI_StudyGotchi/
├── AI_StudyGotchi/          # 主应用
│   ├── Views/               # SwiftUI 视图
│   ├── Models/              # 数据模型
│   ├── Services/            # AI、OCR 服务
│   └── Live2D/              # Live2D 集成
├── live2d-extension/        # Chrome 扩展配套
│   ├── models/              # Live2D 模型
│   ├── waifu-tips.js        # 角色交互
│   └── manifest.json        # 扩展配置
└── Resources/               # 资源与配置
```

## 🚀 快速开始

### 环境要求
```bash
Xcode 15.0+
iOS 17.0+ / iPadOS 17.0+
Swift 5.9+
```

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/AI_StudyGotchi.git
cd AI_StudyGotchi
```

2. **安装依赖**
```bash
# 安装 Live2D Cubism SDK（参考官方指南）
# 在 Config.swift 中添加你的 OpenAI API 密钥
```

3. **构建运行**
```bash
open AI_StudyGotchi.xcodeproj
# 按 Cmd+R 构建并运行
```

## 🎯 开发路线

- [x] 基础 AI 问答功能
- [x] OCR 图像识别
- [x] Live2D 角色集成
- [x] Chrome 扩展配套
- [ ] 记忆卡片系统
- [ ] 番茄钟计时器
- [ ] 学习分析仪表板
- [ ] 多语言支持
- [ ] App Store 上架

## 🤝 参与贡献

我们欢迎各种形式的贡献：
- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🎨 UI/UX 优化
- 🌍 多语言翻译

详情请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Live2D Cubism SDK](https://www.live2d.com/) - 角色动画技术
- [OpenAI](https://openai.com/) - AI 能力支持
- [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget) - Web 集成灵感

## 📮 联系方式

- **作者**：Alex
- **项目地址**：[AI_StudyGotchi](https://github.com/yourusername/AI_StudyGotchi)
- **问题反馈**：[GitHub Issues](https://github.com/yourusername/AI_StudyGotchi/issues)

---

<div align="center">

**用 ❤️ 为全球学生打造**

[⬆ 返回顶部](#-ai-learning-companion)

</div>

