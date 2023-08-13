import { CustomizationProvider } from '@twilio-paste/core/customization';
import { Flex } from '@twilio-paste/core';

const CustomFlexComponent = ({ props }: any) => {
  return (
    <CustomizationProvider
      elements={{
        FLEX_WITH_OVERFLOW: {
          overflow: 'auto',
        },
      }}
    >
      <Flex {...props} element="FLEX_WITH_OVERFLOW">
        {props.children}
      </Flex>
    </CustomizationProvider>
  );
};

export default CustomFlexComponent;
