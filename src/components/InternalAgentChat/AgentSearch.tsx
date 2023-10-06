import { useCallback, useEffect, useState } from 'react';
import { Combobox } from '@twilio-paste/core';
import getWorkers from '../../utils/instantQueryUtil';
import { SearchIcon } from '@twilio-paste/icons/esm/SearchIcon';
import { SelectedAgent } from '../../utils/types';
import SearchResults from './SearchResults';

interface AgentSearchProps {
  setIsAgentSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<SelectedAgent>>;
}

const AgentSearch = ({
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

  //TODO: Send the search query directly into the util
  const agentSearchHandler = async (agentName: string) => {
    const workers = await getWorkers(agentName);
    setInputItems(workers);
    // setWorkers(workers);
  };

  const DropDownSelection = (worker: any) => (
    <SearchResults
      fullName={worker.fullName}
      imageUrl={worker.imageUrl}
      activityName={worker.activityName}
    />
  );

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
          //   agentSearchHandler(inputValue);
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
