export const THEME_MODES = ["light", "dark"] as const
/** Editor Manager State
 * direction - 0: out, 1: in
 * type - 0: image, 1: text
 */
export const EDITOR_STATE = { direction: 0, type: 1, text: "Sample Text", name: "File_Name", size: "1.4", extension: ".PNG", buttons: [] }

/** TODO: use numbers */
export const EDITOR_INPUTS = {
   direction: { values: ["In", "Out"], tips: ["Incoming Message", "Outgoing Message"] },
   type: { values: ["File", "Text", "Image"], tips: ["File / Compressed Image", "Text Message", "Uncompressed Image"] },
} as const

export const WIDGET_MENU = {
   dimensions: [
      { width: 390 + 19 * 2, height: 844 + 16 * 2 }, // lg
      { width: 390, height: 844 }, // md
      { width: 320, height: 568 }, // sm
   ],
}
