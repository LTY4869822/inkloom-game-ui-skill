# Inkloom · 墨织

**Weave a game's world into its interface.**

An adaptive Codex game UI skill inspired by INKWAVE: understand the premise, experience, gameplay and input devices, then design and implement colors, layout, interactions and motion.

[中文文档](README.md) · [Skill](skills/inkwave-game-ui/SKILL.md) · [Gallery](docs/gallery.md)

![Inkloom nightwatch theme](docs/images/02-nightwatch.jpg)

This is a real browser screenshot of the bundled component demo with original placeholder scenery. It is not a complete shipped game.

## What adapts

- Colors come from the target game's context and existing semantics. The five original palettes are optional research references.
- Layout follows player tasks, information priorities, camera view and devices.
- Interactions preserve real preview, commit, back, pause and save behavior.
- Motion is tuned separately for navigation, urgent information, transitions and rewards.
- Chunky ink outlines, printed sticker layers, hard shadows and organic ink shapes preserve the INKWAVE-inspired visual language.

The skill works through Codex. The runtime theme helper applies an already designed theme; it does not infer a story or automatically lay out a game.

## Install and invoke

Ask Codex:

```text
Install the skill at skills/inkwave-game-ui from
https://github.com/LTY4869822/inkloom-game-ui-skill
```

The display name is **Inkloom · 墨织**. The invocation remains **`$inkwave-game-ui`** for compatibility:

```text
$inkwave-game-ui
Analyze this game's premise, setting and gameplay. Design and implement
appropriate colors, layout, interactions and motion while preserving its
gameplay and INKWAVE-inspired design language. Use custom colors as needed.
```

Use the official Codex skill installer when available:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo LTY4869822/inkloom-game-ui-skill --path skills/inkwave-game-ui
```

For an existing installation, preserve local changes and use an update flow.

## Try the demo

```bash
git clone https://github.com/LTY4869822/inkloom-game-ui-skill.git
cd inkloom-game-ui-skill
python3 skills/inkwave-game-ui/scripts/serve-preview.py
```

Open `http://127.0.0.1:8493/web/preview.html`. On Windows, use `python` if needed. Pass `--port 8494` for another port. The server uses Python's standard library, binds only to localhost and supplies the correct module MIME types. No build step or API key is needed for the static demo.

Try equipment preview versus commit, focus feedback, semantic themes, arbitrary `#rrggbb` primary/secondary colors, input validation and reduced motion. The demo's interface is in Chinese.

## Contents and validation

- [Adaptive design decisions](skills/inkwave-game-ui/references/adaptive-design.md)
- [Source research](skills/inkwave-game-ui/references/source-analysis.zh-CN.md)
- [Interaction contract](skills/inkwave-game-ui/references/interaction-spec.md)
- [Engine adapters](skills/inkwave-game-ui/references/engine-adapters.md)
- [Acceptance criteria](skills/inkwave-game-ui/references/acceptance.md)
- [Project theme example](skills/inkwave-game-ui/assets/theme-profile.example.json)

Run theme API checks with:

```bash
node tests/theme-api.test.mjs
```

The Web reference has been exercised in a browser. Godot and Unity have implementation guidance, without editor validation in this repository. The demo does not include real matches, full results, maps or gamepad polling. Integrate those with the target game's systems.

Source-study screenshots are labeled separately from the Inkloom gallery. Included Latin fonts do not contain Chinese glyphs.

## License and attribution

[MIT](LICENSE) for the project and derived code, with Jayden Davis's INKWAVE notice retained. Bundled fonts use SIL OFL 1.1. See [third-party notices](THIRD_PARTY_NOTICES.md) and [contribution guidance](CONTRIBUTING.md).

Inkloom is independent and inspired by [amiaoapp/inkwave](https://github.com/amiaoapp/inkwave). It is not an official INKWAVE or Nintendo project.
