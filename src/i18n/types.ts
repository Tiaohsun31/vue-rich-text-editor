/** 編輯器所有 UI 文案（toolbar、bubble menus、對話框、提示） */
export interface RteMessages {
	placeholder: string
	ok: string
	cancel: string

	// toolbar
	undo: string
	redo: string
	heading1: string
	heading2: string
	heading3: string
	fontFamily: string
	fontSize: string
	bold: string
	italic: string
	underline: string
	strike: string
	highlight: string
	textColor: string
	alignLeft: string
	alignCenter: string
	alignRight: string
	alignJustify: string
	bulletList: string
	orderedList: string
	blockquote: string
	link: string
	insertImage: string
	insertTable: string
	insertYoutube: string
	horizontalRule: string
	exportHtml: string
	uploadImage: string
	lightbox: string

	// prompts / dialogs
	promptLinkUrl: string
	promptEditLinkUrl: string
	promptImageUrl: string
	promptYoutubeUrl: string
	promptEditYoutubeUrl: string
	invalidYoutubeUrl: string
	promptImageAlt: string
	promptLightboxUrl: string
	promptEditLightboxUrl: string
	lightboxSelectTextFirst: string
	htmlCopied: string
	htmlCopyManual: string

	// table bubble menu（title 與顯示用短字）
	rowAbove: string
	rowBelow: string
	rowDelete: string
	colLeft: string
	colRight: string
	colDelete: string
	mergeCells: string
	splitCell: string
	toggleHeaderRow: string
	deleteTable: string
	rowAboveShort: string
	rowBelowShort: string
	rowDeleteShort: string
	colLeftShort: string
	colRightShort: string
	colDeleteShort: string
	mergeCellsShort: string
	splitCellShort: string
	headerShort: string
	deleteTableShort: string

	// link bubble menu
	openInNewTab: string
	editLink: string
	removeLink: string

	// image bubble menu
	editAlt: string
	deleteImage: string
	toggleImageLightbox: string

	// youtube bubble menu
	editYoutubeUrl: string
	deleteYoutube: string

	// lightbox bubble menu
	editLightbox: string
	removeLightbox: string
	lightboxNotSet: string

	// custom grid（optional extension）
	gridLabel: string
	gridDesktop: string
	gridMobile: string
	gridDecreaseColumns: string
	gridIncreaseColumns: string
	gridAddCell: string
	gridAddCellShort: string
	gridDelete: string
	gridDeleteShort: string

	// flex layout（optional extension）
	flexLabel: string
	flexHint: string
	flexGrowLeft: string
	flexGrowRight: string
	flexGrowSideGroup: string
	flexDelete: string
	flexDeleteShort: string
}
