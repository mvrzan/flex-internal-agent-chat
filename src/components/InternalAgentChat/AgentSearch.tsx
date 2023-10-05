import { useCallback, useEffect, useState } from 'react';
import { Combobox } from '@twilio-paste/core';
import getWorkers from '../../utils/instantQueryUtil';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import AgentCard from './AgentCard';
import { SelectedAgent } from '../../utils/types';

interface AgentSearchProps {
  selectedAgent: SelectedAgent;
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

const AgentSearch = ({
  selectedAgent,
  setIsAgentSelected,
  setSelectedAgent,
}: AgentSearchProps) => {
  const [workers, setWorkers] = useState([{}]);
  const [inputItems, setInputItems] = useState([{}]);

  useEffect(() => {
    const callGetWorkers = async () => {
      const workers = await getWorkers();
      setInputItems(workers);
      setWorkers(workers);
    };
    callGetWorkers();
  }, []);

  const saveHandler = async (selectedItem: any) => {
    const payload = {
      fullName: selectedItem.fullName,
      firstName: selectedItem.firstName,
      lastName: selectedItem.lastName,
      imageUrl: selectedItem.imageUrl,
      activityName: 'Offline',
      email: selectedItem.email,
      workerSid: selectedItem.workerSid,
      contactUri: selectedItem.contactUri,
    };

    setSelectedAgent(payload);
    setIsAgentSelected(true);
  };

  const DropDownSelection = (worker: any) => {
    return (
      <AgentCard
        key={worker.workerSid}
        fullName={worker.fullName}
        firstName={worker.firstName}
        lastName={worker.lastName}
        imageUrl={worker.imageUrl}
        activityName={'Offline'}
        email={worker.email}
        contactUri={worker.contactUri}
        setIsAgentSelected={setIsAgentSelected}
        setSelectedAgent={setSelectedAgent}
        selectedAgent={selectedAgent}
      />
    );
  };

  return (
    <Combobox
      placeholder="Search for an agent..."
      autocomplete
      labelText=""
      insertBefore={<SearchIcon decorative />}
      items={inputItems}
      optionTemplate={DropDownSelection}
      itemToString={() => ''}
      onSelectedItemChange={item => saveHandler(item.selectedItem)}
      onInputValueChange={({ inputValue }) => {
        if (inputValue !== undefined) {
          setInputItems(
            workers.filter(item =>
              // @ts-ignore
              item.firstName.toLowerCase().startsWith(inputValue.toLowerCase())
            )
          );
        }
      }}
    />
  );
};

export default AgentSearch;
