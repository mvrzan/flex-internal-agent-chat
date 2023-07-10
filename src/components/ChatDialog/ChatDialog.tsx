import {
  MinimizableDialogContainer,
  MinimizableDialogButton,
  MinimizableDialog,
  MinimizableDialogHeader,
  MinimizableDialogContent,
  Box,
  Heading,
  Paragraph,
  Label,
  Input,
  TextArea,
  Button,
} from '@twilio-paste/core/';
import { IconButton } from '@twilio/flex-ui';

const ChatDialog = () => {
  return (
    <MinimizableDialogContainer>
      <MinimizableDialogButton variant="reset" size="reset">
        <IconButton icon="Message" />
      </MinimizableDialogButton>
      <MinimizableDialog aria-label="Live chat">
        <MinimizableDialogHeader>Agent-to-Agent Chat</MinimizableDialogHeader>
        <MinimizableDialogContent>
          <Box padding="space70">
            <Heading as="div" variant="heading30">
              Hi there!
            </Heading>
            <Paragraph>
              We're here to help. Please give us some info to get started.
            </Paragraph>
            <Box display="flex" flexDirection="column" rowGap="space60">
              <Box>
                <Label htmlFor="name-input">Name</Label>
                <Input id="name-input" type="text" />
              </Box>
              <Box>
                <Label htmlFor="email-input">Email address</Label>
                <Input id="email-input" type="email" />
              </Box>
              <Box>
                <Label htmlFor="question-textarea">How can we help you?</Label>
                <TextArea id="question-textarea" />
              </Box>
            </Box>
            <Box marginTop="space190">
              <Button variant="primary">Start chat</Button>
            </Box>
          </Box>
        </MinimizableDialogContent>
      </MinimizableDialog>
    </MinimizableDialogContainer>
  );
};

export default ChatDialog;
