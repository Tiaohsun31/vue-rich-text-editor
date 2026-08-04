# Changelog

All notable changes to this package are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(pre-`1.0.0`: minor versions may include behavior changes).

## [0.5.0] - 2026-08-03

### Added

- **Sticky toolbar.** The toolbar now pins to the top of whatever scrolls — the
  page, or the nearest scrollable ancestor such as a modal body — so it stays
  reachable while editing long documents. New `stickyToolbar` prop (default
  `true`); pass `false` to opt out. The offset for pages with a fixed header is
  the CSS variable `--rte-toolbar-offset` (default `0`), mirroring CKEditor 5's
  `ui.viewportOffset.top` and TinyMCE's `toolbar_sticky_offset`. The pinned
  toolbar carries a soft drop shadow so it reads as a layer floating above the
  content that scrolls beneath it.
  A sticky element's `top` resolves against the scroll container's *content* box,
  so a scroll container with `padding-top` (a modal body with `p-4`, for example)
  would pin the toolbar that far below the visible top and let content show
  through the strip above it. The toolbar masks that strip itself, so hosts do
  not have to restructure their padding.

- **Two optional layout extensions**, available via subpath imports and off by
  default (multi-column layout is not a core feature of CKEditor 5 or TinyMCE
  either, so it is opt-in):
  - `@tiaohsun/vue-rich-text-editor/extensions/grid` — a responsive grid
    block with configurable desktop (1–6) and mobile (1–3) column counts, plus
    `GridExtension`, `createGridToolbarItem(t)`, and the `insertGrid()` command.
  - `@tiaohsun/vue-rich-text-editor/extensions/flex-columns` — a two-column layout
    where either side can take the remaining width and which stacks on narrow
    containers, plus `FlexColumnsExtension`, `createFlexColumnsToolbarItem(t)`,
    and the `insertFlexColumns()` command.

  Every node these register is `rte`-prefixed (`rteGrid`/`rteGridCell`,
  `rteFlexColumns`/`rteFlexColumn`), and the cell classes in exported HTML are
  likewise `rte-grid-cell` / `rte-flex-column`. Tiptap only `console.warn`s on
  duplicate extension names before silently letting the later one win, so generic
  names would be a hard-to-diagnose collision with a host's own nodes.

  Both export self-contained HTML — the container and item styles are inline, so
  rendered content needs no stylesheet. Their editing chrome uses the package's
  own inline SVG icons and the built-in i18n, and their styles ship in
  `editor.css` like every other part of the package.
- Icons: `ArrowLeftIcon`, `ArrowRightIcon`, `PlusIcon`, `MinusIcon`, `ColumnsIcon`.
- i18n keys for the two layout extensions (`gridLabel`, `gridDesktop`,
  `gridMobile`, `gridDecreaseColumns`, `gridIncreaseColumns`, `gridAddCell`,
  `gridAddCellShort`, `gridDelete`, `gridDeleteShort`, `flexLabel`, `flexHint`, `flexGrowLeft`,
  `flexGrowRight`, `flexGrowSideGroup`, `flexDelete`, `flexDeleteShort`) in all
  three locales.

### Changed

- **BREAKING (behavior):** The toolbar is sticky by default. Set
  `:sticky-toolbar="false"` to restore the previous behavior.
- `.rte-editor` now uses `overflow: clip` instead of `overflow: hidden`
  (`hidden` is kept on the preceding line as a fallback for Safari < 16). Both
  clip the rounded corners identically, but `hidden` makes the element a scroll
  container, which would confine the sticky toolbar to the editor itself instead
  of the page. Sticky positioning therefore does not take effect on Safari < 16;
  layout is unaffected there.
- Bubble menu floating containers carry a `.rte-bubble-root` class with
  `z-index: 25`, so they render above the sticky toolbar (`z-index: 20`).
- `insertGrid()` and `insertFlexColumns()` seed their cells with empty
  paragraphs rather than placeholder text, so the nodes carry no language
  assumption. While editing, cells get a minimum size so an empty one stays
  visible and clickable — the non-growing side of a flex layout is sized to
  `max-content` and would otherwise collapse to a hairline. Read-only rendering
  is unchanged.

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
