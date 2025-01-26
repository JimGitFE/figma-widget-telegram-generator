// Components
import { Message } from "@/components/ui"
import { DirectionContainer, PreviewLabel, WithButtons } from "@/components/display/atoms"
import { EDITOR_INPUTS } from "@/constants"

interface MessagePreviewProps extends Partial<AutoLayoutProps>, ReqCompProps {
   editorState: Message
}

/** Message from editor mode (preview labeled) */
export function MessagePreview({ theme, editorState, ...props }: MessagePreviewProps) {
   const { direction, type, text, name, size, extension, isImg, buttons } = editorState

   // Convert
   const directionAsStr = EDITOR_INPUTS.direction.values[direction]
   const typeAsStr = EDITOR_INPUTS.type.values[type]

   // Match Overload
   const propsOfType = [
      {
         isImg,
         name,
         size,
         extension,
         text,
      },
   ]

   return (
      <DirectionContainer name="Preview Container" side={directionAsStr} {...props}>
         <WithButtons buttons={buttons} theme={theme}>
            <PreviewLabel theme={theme} />
            <Message side={directionAsStr} type={typeAsStr} config={propsOfType[0]} theme={theme} />
         </WithButtons>
      </DirectionContainer>
   )
}
