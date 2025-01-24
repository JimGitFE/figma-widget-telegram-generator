// Dependencies
const { AutoLayout } = figma.widget
// Components
import { DirectionContainer, WithButtons } from "@/components/display/atoms"
import { Message } from "@/components/ui"
import { EDITOR_INPUTS } from "@/constants"

interface MessagesLayoutProps extends Partial<AutoLayoutProps>, ReqCompProps, OptionalRender {
   messagesState: MessagesState
}

/** A component that arranges messages in a specific layout (In & Out Messages). */
export function MessagesLayout({ messagesState, renderElements, children, theme, ...props }: MessagesLayoutProps) {
   return !renderElements ? (
      children // TODO: last message
   ) : (
      <AutoLayout
         name="Container Layout" // Container
         x={{
            type: "left-right",
            leftOffset: 0,
            rightOffset: 0,
         }}
         y={{
            type: "bottom",
            offset: 0,
         }}
         overflow="visible"
         direction="vertical"
         spacing={24}
         padding={{
            vertical: 16,
            horizontal: 8,
         }}
         width={390}
         verticalAlignItems="end"
         horizontalAlignItems="center"
         {...props}
      >
         {messagesState.messages?.map(
            (dirMsg, key) =>
               dirMsg && (
                  <DirectionContainer key={key} side={(["in", "out"] as const)[dirMsg[0].direction]}>
                     {dirMsg.map((msg, key) => (
                        <WithButtons key={key} buttons={msg.buttons} theme={theme}>
                           <Message type={EDITOR_INPUTS.type.values[msg.type]} side={(["in", "out"] as const)[msg.direction]} config={msg} theme={theme}></Message>
                        </WithButtons>
                     ))}
                  </DirectionContainer>
               ),
         )}
         {children}
      </AutoLayout>
   )
}
