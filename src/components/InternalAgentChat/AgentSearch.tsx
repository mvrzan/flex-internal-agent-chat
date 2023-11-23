import React, { useEffect, useState } from 'react';
import { Combobox } from '@twilio-paste/core/combobox';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

import SearchResults from './SearchResults';
import { SelectedAgent } from '../../utils/types';
import getWorkers from '../../utils/instantQueryUtil';

interface AgentSearchProps {
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

interface Worker {
  activityName: string;
  contactUri: string;
  email: string;
  firstName: string;
  fullName: string;
  lastName: string;
  imageUrl: string;
  workerSid: string;
}

const AgentSearch = ({
  setIsAgentSelected,
  setSelectedAgent,
}: AgentSearchProps) => {
  const [inputItems, setInputItems] = useState<Worker[]>([]);

  useEffect(() => {
    const callGetWorkers = async () => {
      const workers = await getWorkers();
      setInputItems(workers);
    };
    callGetWorkers();
  }, []);

  const saveHandler = (selectedItem: Worker) => {
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

  // TODO: Implement debounce
  const agentSearchHandler = async (agentName: string) => {
    const workers = await getWorkers(agentName);

    setInputItems(workers);
  };

  const DropDownSelection = (worker: Worker) => {
    return (
      <SearchResults
        fullName={worker.fullName}
        imageUrl={worker.imageUrl}
        activityName={worker.activityName}
      />
    );
  };

  return (
    <Combobox
      autocomplete
      placeholder="Search for an agent..."
      labelText=""
      insertBefore={<SearchIcon decorative />}
      items={inputItems}
      optionTemplate={DropDownSelection}
      itemToString={() => ''}
      onSelectedItemChange={item => saveHandler(item.selectedItem)}
      onInputValueChange={({ inputValue }) => {
        if (inputValue !== undefined) {
          agentSearchHandler(inputValue);
          setInputItems(
            inputItems.filter(item =>
              item.firstName.toLowerCase().startsWith(inputValue.toLowerCase())
            )
          );
        }
      }}
    />
  );
};

export default AgentSearch;
