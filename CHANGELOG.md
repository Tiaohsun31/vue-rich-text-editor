# Changelog

All notable changes to this package are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(pre-`1.0.0`: minor versions may include behavior changes).

## [0.4.0] - 2026-08-03

### Added

- **YouTube video bubble menu.** Selecting an embedded video now shows a bubble
  menu with align left / center / right, edit URL, and delete. Alignment is
  written to the wrapper `<div data-youtube-video>` as `data-align` plus inline
  `margin` styles, so exported HTML aligns without the editor stylesheet.
- **Resizable / alignable video node** (`ResizableYoutube`), replacing the plain
  official `Youtube` extension in `createDefaultExtensions`. Adds an `align`
  attribute and a `size` attribute (percentage width) on top of the official
  node, plus a Vue NodeView with a drag-to-resize handle.
- i18n keys: `promptEditYoutubeUrl`, `invalidYoutubeUrl`, `editYoutubeUrl`,
  `deleteYoutube` (all three locales).

### Changed

- `createDefaultExtensions` now includes `ResizableYoutube` instead of the plain
  official `Youtube`. The node name is unchanged (`youtube`), so stored documents
  and `setYoutubeVideo()` keep working; existing videos load as left-aligned at
  the configured default width. Exported HTML for a video now carries inline
  `width`/`margin` styles on the wrapper `<div>` and a `data-align` attribute.

### Fixed

- **Clicking an embedded video in the editor played it instead of selecting it.**
  The cross-origin `<iframe>` swallowed `mousedown`, so ProseMirror never created
  a `NodeSelection` and no bubble menu could ever trigger. While editing, the
  iframe no longer receives pointer events; in read-only mode it stays fully
  interactive and playable.
- The text bubble menu no longer shows on top of the video bubble menu (a
  `NodeSelection` is not an empty selection).
- **Image and video node views ignored `readonly` changes made after mount.**
  `editor.isEditable` is a plain getter, not a reactive source, so a `computed`
  wrapping it kept the value captured at node view creation. Toggling `readonly`
  at runtime left the resize handle active on a read-only editor (dragging it
  actually mutated the document and emitted `update:modelValue`), or hid it
  permanently after switching back to editable. Both node views now track
  editability from the editor's `update` event. Editors whose `readonly` never
  changes after mount were unaffected.

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
