import React from 'react';

import {
  ProgressSteps,
  ProgressStepIncomplete,
  ProgressStepComplete,
  ProgressStepCurrent,
  ProgressStepSeparator,
} from '@twilio-paste/core/progress-steps';

import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Stack } from '@twilio-paste/core/stack';
import { Separator } from '@twilio-paste/core/separator';
import { Box } from '@twilio-paste/core/box';

const LandingScreen = () => {
  return (
    <Box
      overflow="auto"
      padding="space80"
      width="100%"
      margin="space40"
      marginTop="space0"
      borderRadius="borderRadius30"
      backgroundColor="colorBackgroundPrimaryWeakest"
    >
      <Stack orientation="vertical" spacing="space40">
        <ProgressSteps orientation="horizontal">
          <ProgressStepCurrent as="div">
            Search for the Agent(s) you want to chat with
          </ProgressStepCurrent>
          <ProgressStepSeparator />
          <ProgressStepIncomplete as="div">
            Click on the Agent&apos;s profile to start a chat
          </ProgressStepIncomplete>
          <ProgressStepSeparator />
          <ProgressStepIncomplete as="div">
            Optional: Add additional Agent&apos;s to your chat
          </ProgressStepIncomplete>
          <ProgressStepSeparator />
          <ProgressStepComplete as="div">Start your chat</ProgressStepComplete>
        </ProgressSteps>
        <Separator
          orientation="horizontal"
          verticalSpacing="space50"
        ></Separator>
        <Card>
          <Heading as="h2" variant="heading20">
            Agent-To-Agent Chat
          </Heading>
          <Paragraph>
            The Agent-To-Agent Chat operates outside of Twilio Flex. This means
            that your Agent-To-Agent communication will not be generated as
            Twilio Flex Tasks and will not affect Contact Center operations or
            reporting.
          </Paragraph>
        </Card>
      </Stack>
    </Box>
  );
};

export default LandingScreen;
