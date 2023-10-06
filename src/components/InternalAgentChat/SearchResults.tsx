import { StatusBadge } from '@twilio-paste/core/status';
import { Stack, Avatar, Text, Flex, Tooltip, Box } from '@twilio-paste/core';

interface SearchResultsProps {
  fullName: string;
  imageUrl: string;
  activityName: string;
}

const SearchResults = ({
  fullName,
  imageUrl,
  activityName,
}: SearchResultsProps) => {
  return (
    <Box width="220px">
      <Flex hAlignContent="between" vAlignContent="center" width="100%">
        <Stack orientation="horizontal" spacing="space30">
          <Avatar size="sizeIcon80" name={fullName} src={imageUrl} />
          <Text as="span" marginRight="space40">
            {fullName}
          </Text>
        </Stack>
        <Tooltip text={activityName}>
          <StatusBadge
            as="span"
            variant={
              activityName === 'Available'
                ? 'ProcessSuccess'
                : activityName === 'Offline'
                ? 'ProcessDisabled'
                : 'ProcessWarning'
            }
          >
            {' '}
          </StatusBadge>
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default SearchResults;
