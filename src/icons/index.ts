import { defineComponent, h } from 'vue'

// Icon paths are derived from Lucide. See THIRD_PARTY_NOTICES.md.
function svgIcon(inner: string) {
  return defineComponent({
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          width: '1em',
          height: '1em',
          innerHTML: inner,
          ...attrs,
        })
    },
  })
}

export const UndoIcon = svgIcon(
  '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
)

export const RedoIcon = svgIcon(
  '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>',
)

export const BoldIcon = svgIcon(
  '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
)

export const ItalicIcon = svgIcon(
  '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
)

export const UnderlineIcon = svgIcon(
  '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>',
)

export const StrikeIcon = svgIcon(
  '<path d="M16 4H9a3 3 0 0 0-2.83 4"/>' +
    '<path d="M14 12a4 4 0 0 1 0 8H6"/>' +
    '<line x1="4" x2="20" y1="12" y2="12"/>',
)

export const Heading1Icon = svgIcon(
  '<path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/>',
)

export const Heading2Icon = svgIcon(
  '<path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/>',
)

export const Heading3Icon = svgIcon(
  '<path d="M4 12h8"/>' +
    '<path d="M4 18V6"/>' +
    '<path d="M12 18V6"/>' +
    '<path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/>' +
    '<path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/>',
)

export const BulletListIcon = svgIcon(
  '<path d="M3 5h.01"/>' +
    '<path d="M3 12h.01"/>' +
    '<path d="M3 19h.01"/>' +
    '<path d="M8 5h13"/>' +
    '<path d="M8 12h13"/>' +
    '<path d="M8 19h13"/>',
)

export const OrderedListIcon = svgIcon(
  '<path d="M11 5h10"/>' +
    '<path d="M11 12h10"/>' +
    '<path d="M11 19h10"/>' +
    '<path d="M4 4h1v5"/>' +
    '<path d="M4 9h2"/>' +
    '<path d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"/>',
)

export const BlockquoteIcon = svgIcon(
  '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>' +
    '<path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
)

export const HorizontalRuleIcon = svgIcon(
  '<path d="m16 16-4 4-4-4"/><path d="M3 12h18"/><path d="m8 8 4-4 4 4"/>',
)

export const LinkIcon = svgIcon(
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
    '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
)

export const ImageIcon = svgIcon(
  '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>' +
    '<circle cx="9" cy="9" r="2"/>' +
    '<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
)

export const TableIcon = svgIcon(
  '<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>',
)

export const TrashIcon = svgIcon(
  '<path d="M10 11v6"/>' +
    '<path d="M14 11v6"/>' +
    '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>' +
    '<path d="M3 6h18"/>' +
    '<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
)

export const ExternalLinkIcon = svgIcon(
  '<path d="M15 3h6v6"/>' +
    '<path d="M10 14 21 3"/>' +
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
)

export const PencilIcon = svgIcon(
  '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>' +
    '<path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>',
)

export const UnlinkIcon = svgIcon(
  '<path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/>' +
    '<path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/>' +
    '<line x1="8" x2="8" y1="2" y2="5"/>' +
    '<line x1="2" x2="5" y1="8" y2="8"/>' +
    '<line x1="16" x2="16" y1="19" y2="22"/>' +
    '<line x1="19" x2="22" y1="16" y2="16"/>',
)

export const UploadIcon = svgIcon(
  '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
)

export const MediaLibraryIcon = svgIcon(
  '<path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/>' +
    '<path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/>' +
    '<circle cx="13" cy="7" r="1" fill="currentColor"/>' +
    '<rect x="8" y="2" width="14" height="14" rx="2"/>',
)

export const GridIcon = svgIcon(
  '<path d="M12 3v18"/><path d="M3 12h18"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
)

export const CollapseIcon = svgIcon(
  '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 15h18"/><path d="m15 8-3 3-3-3"/>',
)

export const CodeIcon = svgIcon(
  '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
)

export const YoutubeIcon = svgIcon(
  '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"/>',
)

export const AlignLeftIcon = svgIcon(
  '<path d="M21 5H3"/><path d="M15 12H3"/><path d="M17 19H3"/>',
)

export const AlignCenterIcon = svgIcon(
  '<path d="M21 5H3"/><path d="M17 12H7"/><path d="M19 19H5"/>',
)

export const AlignRightIcon = svgIcon(
  '<path d="M21 5H3"/><path d="M21 12H9"/><path d="M21 19H7"/>',
)

export const AlignJustifyIcon = svgIcon(
  '<path d="M3 5h18"/><path d="M3 12h18"/><path d="M3 19h18"/>',
)

export const HighlighterIcon = svgIcon(
  '<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
)

export const TextColorIcon = svgIcon(
  '<path d="M4 20h16"/><path d="m6 16 6-12 6 12"/><path d="M8 12h8"/>',
)

export const LightboxIcon = svgIcon(
  '<path d="m15 15 6 6"/>' +
    '<path d="m15 9 6-6"/>' +
    '<path d="M21 16v5h-5"/>' +
    '<path d="M21 8V3h-5"/>' +
    '<path d="M3 16v5h5"/>' +
    '<path d="m3 21 6-6"/>' +
    '<path d="M3 8V3h5"/>' +
    '<path d="M9 9 3 3"/>',
)
