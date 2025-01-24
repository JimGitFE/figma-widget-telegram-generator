// Dependencies
const { AutoLayout, Text } = figma.widget
// Components
import { remapTokens } from "@/utils"
import { type SetterProp } from "@/hooks"
import { EDITOR_STATE, EDITOR_INPUTS } from "@/constants"
// Internal
import { Section, Label, ButtonsRow, Button, ButtomSmall, ChatButtonEditable, Selector, TextInput, Icon } from "@/components/edit-mode/atoms"

/** Import Changelog
 * Generate Interface, colors & extracted svg paths
 * Separated reusable components ()
 */

interface MessageBuilderProps extends Partial<AutoLayoutProps>, ReqCompProps {
   /** Fully Hide from layers tree */
   renderElement: boolean
   /** Editor State Manager (New Message Inputs Centralized State at base code.tsx) & setMessagesState */
   editorManager: [EditorState, SetterProp<EditorState>, SetterProp<MessagesState>]
}

export function MessageBuilder({ editorManager, renderElement, theme, ...props }: MessageBuilderProps) {
   const [{ direction, type, text, name, extension, size, buttons, hidePreview }, setEditorState, setMessagesState] = editorManager

   const resetIsNew = () => setEditorState("isNew", true) // Reset isNew

   /** Reset all Inputs to default */
   const resetInputs = () => {
      Object.entries(EDITOR_STATE).map(([key, value]) => {
         setEditorState(key as keyof EditorState, value)
      })
   }

   /** Overrides values of a specific button */
   const updateButton = (row: number, id: number, newvals: Partial<Message["buttons"][number][number]>) => {
      resetIsNew()
      setEditorState(
         "buttons",
         buttons.map((buttonRow, rowIndex) => (rowIndex === row ? buttonRow.map((button, buttonIndex) => (buttonIndex === id ? { ...button, ...newvals } : button)) : buttonRow)),
      )
   }

   const addButtonToRow = (row: number, nextId: number) => {
      resetIsNew()
      setEditorState(
         "buttons",
         buttons.map((buttonsRow, rowIndex) => (rowIndex === row ? [...buttonsRow, { id: nextId, text: `Button ${rowIndex + 1}-${nextId}`, hasRef: false }] : buttonsRow)),
      )
   }
   const removeButtonFromRow = (row: number, id: number) => {
      resetIsNew()
      if (buttons[row].length === 1) {
         // Remove row
         setEditorState(
            "buttons",
            buttons.filter((_, rowIndex) => rowIndex !== row),
         )
      } else {
         // Remove Last Button
         setEditorState(
            "buttons",
            buttons.map((buttonsRow, rowIndex) => (rowIndex === row ? buttonsRow.filter((button) => button.id !== id) : buttonsRow)),
         )
      }
   }

   const addRowOfButtons = () => {
      resetIsNew()
      setEditorState("buttons", [...buttons, [{ id: 1, text: `Button ${buttons.length}-1`, hasRef: false }]])
   }

   const addMessageToChat = () => {
      setEditorState("isNew", false) // Set isNew
      const newMessage = { direction, type, text, name, extension, size, buttons }
      setMessagesState("messages", (prevMessages) => {
         // Array of In & Out Messages
         const allMsgs = [...(prevMessages ?? [])]
         // Array of Messages in a specific direction
         const dirMsgs = allMsgs.pop()
         // Handle No Messages & Direction Change
         if (typeof dirMsgs !== "undefined" && dirMsgs[0]?.direction === direction) {
            dirMsgs.push(newMessage)
            allMsgs.push(dirMsgs)
         } else {
            allMsgs.push(dirMsgs)
            allMsgs.push([newMessage])
         }
         return allMsgs
      })
   }

   // Theme Mode
   /** Edit Module Color Palette */
   const color = remapTokens({
      surface: {
         // Toned
         primaryHover: { dark: "#EAFFC8", light: "#567FE7" },
         primary: { dark: "#D3FF8D", light: "#2851B7" },
         primary30: { dark: "#D3FF8D4D", light: "#2851B74D" },
         //  Action
         telegramButton: { dark: "#FFF3", light: "#24242487" },
         action: { dark: "#313131", light: "#313131" },
         actionHover: { dark: "#444444", light: "#444444" },
         inputBg: { dark: "#0000004D", light: "#00000015" },
         // Module
         bg: { dark: "#252525", light: "#FFFFFF" },
      },
      text: {
         default: { dark: "#FFFFFF", light: "#000" },
         inverted: { dark: "#000", light: "#FFF" },
         black: { dark: "#000", light: "#000" },
         white: { dark: "#FFF", light: "#FFF" },
      },
   })[theme]

   function ButtonsSection() {
      return (
         <AutoLayout name="Buttons Container" cornerRadius={8} overflow="visible" direction="vertical" spacing={12} width="fill-parent">
            {buttons.map(
               (buttonsRow, rowIndex) =>
                  buttonsRow.length > 0 && (
                     <ButtonsRow key={rowIndex}>
                        <ButtomSmall onEvent={() => removeButtonFromRow(rowIndex, buttonsRow.length - 1)} icon="minus" tooltip="Remove Button From Row" colorPalette={color} />

                        {buttonsRow.map((button, buttonIndex) => (
                           <ChatButtonEditable
                              key={buttonIndex}
                              value={button.text}
                              onEvent={(e) => updateButton(rowIndex, buttonIndex, { text: e.characters })}
                              name="chat-button"
                              width="fill-parent"
                              colorPalette={color}
                           />
                        ))}
                        <ButtomSmall onEvent={() => addButtonToRow(rowIndex, buttonsRow.length + 1)} tooltip="Add Button To Row" colorPalette={color} />
                     </ButtonsRow>
                  ),
            )}
            <ButtonsRow>
               <ButtomSmall onEvent={() => addRowOfButtons()} colorPalette={color}>
                  Add Row of Buttons
               </ButtomSmall>
            </ButtonsRow>
         </AutoLayout>
      )
   }

   return (
      renderElement && (
         <AutoLayout
            name="MessageBuilder"
            positioning="absolute"
            overflow="visible"
            width={390}
            y={16}
            x={{
               type: "right",
               offset: -25 - 390,
            }}
            effect={[
               {
                  type: "drop-shadow",
                  color: "#00000059",
                  offset: {
                     x: 0,
                     y: 3,
                  },
                  blur: 26,
                  showShadowBehindNode: false,
               },
               {
                  type: "drop-shadow",
                  color: "#00000040",
                  offset: {
                     x: 0,
                     y: 4,
                  },
                  blur: 108.5,
                  showShadowBehindNode: false,
               },
            ]}
            fill={color.surface.bg}
            cornerRadius={16}
            direction="vertical"
            spacing={24}
            padding={{
               vertical: 32,
               horizontal: 16,
            }}
            height={"hug-contents"}
            horizontalAlignItems="center"
            stroke={color.surface.primary30}
            strokeAlign="outside"
            strokeDashPattern={[16, 8]}
            {...props}
         >
            {/* Title */}
            <Section horizontalAlignItems={"center"}>
               <Text name="title" fill={color.text.default} verticalAlignText="center" lineHeight={22} fontSize={22} fontWeight={600} height={46}>
                  Add New Message
               </Text>
               <Icon
                  tooltip={hidePreview ? "Show Preview Message" : "Hide Preview Message"}
                  onEvent={() => {
                     resetIsNew(), setEditorState("hidePreview", (bool) => !bool)
                  }}
                  icon={hidePreview ? "show" : "hide"}
                  theme={theme}
                  opacity={hidePreview ? 1 : 0.5}
                  x={{ type: "left", offset: 6 }}
                  color={hidePreview ? (color.surface.primaryHover as string) : (color.text.default as string)}
               />
               <Icon
                  tooltip="Reset New Message Inputs"
                  onEvent={() => {
                     resetIsNew(), resetInputs()
                  }}
                  icon={"reset"}
                  theme={theme}
                  color={color.text.default as string}
               />
            </Section>
            {/* Direction */}
            <Section>
               <Label colorPalette={color}>Message Direction</Label>
               <Selector
                  onEvent={(e, i) => {
                     resetIsNew(), setEditorState("direction", i++)
                  }}
                  value={direction}
                  options={[...EDITOR_INPUTS.direction.values]}
                  colorPalette={color}
               />
            </Section>
            {/* Type */}
            <Section>
               <Label colorPalette={color}>Message Type</Label>
               <Selector
                  onEvent={(e, i) => {
                     resetIsNew(), setEditorState("type", i++)
                  }}
                  value={type}
                  options={[...EDITOR_INPUTS.type.values]}
                  colorPalette={color}
               />
            </Section>
            {/* Message Type File */}
            <Section hidden={type !== 0}>
               <Label colorPalette={color}>Image Details</Label>
               <TextInput
                  onEvent={(e) => {
                     resetIsNew(), setEditorState("name", e.characters)
                  }}
                  value={name}
                  placeholder="Image/ File Name"
                  colorPalette={color}
               />
               <TextInput
                  onEvent={(e) => {
                     resetIsNew(), setEditorState("extension", e.characters)
                  }}
                  value={extension}
                  placeholder="Image/ File Extension"
                  colorPalette={color}
               />
               <TextInput
                  onEvent={(e) => {
                     resetIsNew(), setEditorState("size", e.characters)
                  }}
                  value={size}
                  placeholder="Image/ File Size"
                  colorPalette={color}
               />
               <ButtonsSection />
            </Section>
            {/* Message Type Text */}
            <Section hidden={type !== 1}>
               <Label colorPalette={color}>Message Content</Label>
               <TextInput
                  onEvent={(e) => {
                     resetIsNew(), setEditorState("text", e.characters)
                  }}
                  value={text}
                  placeholder="Text Message..."
                  isResizable={true}
                  colorPalette={color}
               />
               <ButtonsSection />
            </Section>
            {/* Message Type Image */}
            <Section hidden={type !== 2}>
               <Label colorPalette={color}>Message Content</Label>
               <TextInput
                  onEvent={(e) => {
                     resetIsNew(), setEditorState("text", e.characters)
                  }}
                  value={text}
                  placeholder="Text Message..."
                  isResizable={true}
                  colorPalette={color}
               />
               <ButtonsSection />
               <TextInput
                  onEvent={console.log} // TODO: Accept https
                  value={"Preview Image"}
                  placeholder="Image Source"
                  opacity={0.5}
                  colorPalette={color}
               />
            </Section>
            <Section>
               <Label isCollapsable={true} colorPalette={color}>
                  Advanced
               </Label>
            </Section>
            {/* Editor Main Event */}
            <Button onEvent={addMessageToChat} colorPalette={color}>
               Add To Chat
            </Button>
         </AutoLayout>
      )
   )
}
