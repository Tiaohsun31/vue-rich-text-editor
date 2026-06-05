import { defineComponent, h } from 'vue'

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
  '<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
)

export const RedoIcon = svgIcon(
  '<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 0 4-4h12"/>',
)

export const BoldIcon = svgIcon(
  '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>',
)

export const ItalicIcon = svgIcon(
  '<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>',
)

export const UnderlineIcon = svgIcon(
  '<path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/>',
)

export const StrikeIcon = svgIcon(
  '<line x1="4" y1="12" x2="20" y2="12"/>' +
    '<path d="M17.5 6.5C17.5 4.01 14.46 3 12 3c-2.19 0-4.5.9-4.5 3.5C7.5 9.5 10 10 12 10"/>' +
    '<path d="M6.5 17.5C6.5 19.99 9.54 21 12 21c2.19 0 4.5-.9 4.5-3.5 0-2.5-2.5-3.5-4.5-3.5"/>',
)

export const Heading1Icon = svgIcon(
  '<path d="M4 6v12M12 6v12M4 12h8"/>' +
    '<text x="15" y="18.5" font-size="9" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">1</text>',
)

export const Heading2Icon = svgIcon(
  '<path d="M4 6v12M12 6v12M4 12h8"/>' +
    '<text x="15" y="18.5" font-size="9" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">2</text>',
)

export const Heading3Icon = svgIcon(
  '<path d="M4 6v12M12 6v12M4 12h8"/>' +
    '<text x="15" y="18.5" font-size="9" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">3</text>',
)

export const BulletListIcon = svgIcon(
  '<line x1="9" y1="6" x2="20" y2="6"/>' +
    '<line x1="9" y1="12" x2="20" y2="12"/>' +
    '<line x1="9" y1="18" x2="20" y2="18"/>' +
    '<circle cx="5" cy="6" r="1" fill="currentColor" stroke="none"/>' +
    '<circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/>' +
    '<circle cx="5" cy="18" r="1" fill="currentColor" stroke="none"/>',
)

export const OrderedListIcon = svgIcon(
  '<line x1="9" y1="6" x2="20" y2="6"/>' +
    '<line x1="9" y1="12" x2="20" y2="12"/>' +
    '<line x1="9" y1="18" x2="20" y2="18"/>' +
    '<text x="3" y="8.5" font-size="6" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">1</text>' +
    '<text x="3" y="14.5" font-size="6" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">2</text>' +
    '<text x="3" y="20.5" font-size="6" font-weight="700" font-family="sans-serif" fill="currentColor" stroke="none">3</text>',
)

export const BlockquoteIcon = svgIcon(
  '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>' +
    '<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
)

export const HorizontalRuleIcon = svgIcon(
  '<line x1="3" y1="12" x2="21" y2="12"/>' +
    '<line x1="3" y1="6" x2="21" y2="6" stroke-dasharray="3 3"/>' +
    '<line x1="3" y1="18" x2="21" y2="18" stroke-dasharray="3 3"/>',
)

export const LinkIcon = svgIcon(
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
    '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
)

export const ImageIcon = svgIcon(
  '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>' +
    '<circle cx="8.5" cy="8.5" r="1.5"/>' +
    '<polyline points="21 15 16 10 5 21"/>',
)

export const TableIcon = svgIcon(
  '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>' +
    '<line x1="3" y1="9" x2="21" y2="9"/>' +
    '<line x1="3" y1="15" x2="21" y2="15"/>' +
    '<line x1="9" y1="3" x2="9" y2="21"/>' +
    '<line x1="15" y1="3" x2="15" y2="21"/>',
)

export const TrashIcon = svgIcon(
  '<polyline points="3 6 5 6 21 6"/>' +
    '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
)

export const ExternalLinkIcon = svgIcon(
  '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' +
    '<polyline points="15 3 21 3 21 9"/>' +
    '<line x1="10" y1="14" x2="21" y2="3"/>',
)

export const PencilIcon = svgIcon(
  '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>' +
    '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
)

export const UnlinkIcon = svgIcon(
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
    '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' +
    '<line x1="4" y1="4" x2="20" y2="20"/>',
)

export const AlignLeftIcon = svgIcon(
  '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>',
)

export const AlignCenterIcon = svgIcon(
  '<line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="5" y1="18" x2="19" y2="18"/>',
)

export const AlignRightIcon = svgIcon(
  '<line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>',
)

export const AlignJustifyIcon = svgIcon(
  '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
)

export const HighlighterIcon = svgIcon(
  '<path d="M9 11l-4 4v3h3l4-4"/><path d="M13 7l4 4"/><path d="M15 5l4 4-7 7-4-4z"/>',
)

export const TextColorIcon = svgIcon(
  '<path d="M4 20h16" stroke-width="2.5"/><path d="M7 16l5-12 5 12"/><line x1="9" y1="11" x2="15" y2="11"/>',
)

export const LightboxIcon = svgIcon(
  '<polyline points="15 3 21 3 21 9"/>' +
    '<polyline points="9 21 3 21 3 15"/>' +
    '<line x1="21" y1="3" x2="14" y2="10"/>' +
    '<line x1="3" y1="21" x2="10" y2="14"/>',
)
