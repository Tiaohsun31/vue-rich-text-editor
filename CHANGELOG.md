# Changelog

All notable changes to this package are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(pre-`1.0.0`: minor versions may include behavior changes).

## [0.3.0] - 2026-07-24

### Added

- **Link "Open in new tab" toggle.** The link dialog now shows an "Open in new
  tab" checkbox. When enabled, the link is written with `target="_blank"` and
  `rel="noopener noreferrer"`. Available consistently from all three entry
  points: the toolbar link button, the text selection bubble menu, and the link
  bubble menu (which pre-fills the checkbox from the link's current `target`).
- `promptLink` on the dialog service and the `promptLinkWithFallback` helper
  (exported), plus `promptLink` on `ToolbarContext`, for prompts that combine a
  text input with a checkbox.

### Changed

- **BREAKING (behavior):** Links now default to **opening in the same tab**.
  Previously every link inherited Tiptap's default `target="_blank"`. Opening in
  a new tab is now opt-in per link via the new checkbox.
- **BREAKING (behavior):** The default `rel` no longer includes `nofollow`.
  Links get no `rel` by default; only links opened in a new tab receive
  `rel="noopener noreferrer"` (for security), matching the defaults of editors
  like CKEditor and TinyMCE.
- URLs typed without a scheme now default to `https` (`defaultProtocol: 'https'`).
  Values that already carry a scheme (e.g. `mailto:`, `tel:`) are unaffected.
