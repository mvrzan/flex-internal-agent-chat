import React, { useEffect, useState, useCallback } from 'react';
import { Combobox } from '@twilio-paste/core/combobox';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';

import { debounce } from 'lodash';
import SearchResults from './SearchResults';
import { SelectedAgent } from '../../utils/types';
import getWorkers from '../../utils/instantQueryUtil';
import { formatSelectedAgentUtil } from '../../utils/formatSelectedAgentUtil';

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

  const debouncedAgentSearch = useCallback(
    debounce(
      async (agentName: string) => setInputItems(await getWorkers(agentName)),
      500
    ),
    []
  );

  useEffect(() => {
    const callGetWorkers = async () => {
      const workers = await getWorkers();
      setInputItems(workers);
    };
    callGetWorkers();
  }, []);

  const saveHandler = (selectedAgent: Worker) => {
    const formattedAgentData = formatSelectedAgentUtil(selectedAgent);

    setSelectedAgent(formattedAgentData);
    setIsAgentSelected(true);
  };

  const agentSearchHandler = (agentName: string) => {
    debouncedAgentSearch(agentName);
  };

  const DropDownSelection = (worker: Worker) => (
    <SearchResults
      fullName={worker.fullName}
      imageUrl={worker.imageUrl}
      activityName={worker.activityName}
    />
  );

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
        if (inputValue === undefined) return;
        setInputItems(
          inputItems.filter(item =>
            item.firstName.toLowerCase().startsWith(inputValue.toLowerCase())
          )
        );
        agentSearchHandler(inputValue);
      }}
    />
  );
};

export default AgentSearch;
