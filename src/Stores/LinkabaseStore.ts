import { makeObservable, observable, action, computed } from 'mobx';
import { ILinkabaseData, CombinedValues } from '../Interfaces/ILinkabase';


class LinkabaseStore {
  // Observable property to store the linkabase data
  linkabaseData: ILinkabaseData[] = [];

  constructor() {
    // Make the properties and methods observable, computed, or actions
    makeObservable(this, {
      linkabaseData: observable, 
      getrelayTypes: computed, 
      getTargetTypes: computed, 
      RelayFields: computed, 
      getTargetOptions: computed, 
      getEnabledRowsCount: action, 
      addLinkabaseData: action, 
      updateLinkabaseData: action, 
      deleteLinkabaseData: action, 
      fetchLinkabaseData: action, 
    });

    // Fetch initial data from local storage
    this.fetchLinkabaseData();
  }

  // Computed property to get relay types
  get getrelayTypes() {
    return [
      '1 Signal Display (1 Relay)',
      '1 Signal Display (2 Relay)',
      '2 Signal Display (1 Relay)',
      '2 Signal Display (2 Relay)',
      '3 Signal Display (1 Relay)',
      '4 Signal Display (1 Relay)',
    ];
  }

  // Computed property to get target types
  get getTargetTypes() {
    return ['Parking slot', 'Slot type', 'Slot'];
  }

  // Computed property to get relay fields based on relay type
  get RelayFields() {
    return (relayType: string) => {
      switch (relayType) {
        case '1 Signal Display (2 Relay)':
        case '2 Signal Display (2 Relay)':
          return ['199999', '099999', '009999', '101010'];
        default:
          return ['199999', '099999'];
      }
    };
  }

  // Computed property to get target options based on target type
  get getTargetOptions() {
    return (targetType: string): string[] => {
      switch (targetType) {
        case 'Parking slot':
          return ['Park1', 'Park2', 'Park3'];
        case 'Slot type':
          return ['Slot1', 'Slot2', 'Slot3'];
        case 'Slot':
          return ['Type1', 'Type2', 'Type3'];
        default:
          return [];
      }
    };
  }

  // Action method to fetch linkabase data from local storage
  fetchLinkabaseData() {
    const storedData = localStorage.getItem('linkabaseOutData');
    if (storedData) {
      this.linkabaseData = JSON.parse(storedData);
    }
  }

  // Action method to add new linkabase data
  addLinkabaseData(newData: CombinedValues) {
    this.linkabaseData.push(newData);
    localStorage.setItem('linkabaseOutData', JSON.stringify(this.linkabaseData));
  }

  // Action method to update existing linkabase data
  updateLinkabaseData(index: number, updatedData: CombinedValues) {
    this.linkabaseData[index] = updatedData;
    localStorage.setItem('linkabaseOutData', JSON.stringify(this.linkabaseData));
  }

  // Action method to delete linkabase data
  deleteLinkabaseData(index: number) {
    this.linkabaseData.splice(index, 1);
    localStorage.setItem('linkabaseOutData', JSON.stringify(this.linkabaseData));
  }

  // Action method to get the count of enabled rows based on relay type
  getEnabledRowsCount(relayType: string) {
    switch (relayType) {
      case '2 Signal Display (1 Relay)':
      case '2 Signal Display (2 Relay)':
        return 2;
      case '3 Signal Display (1 Relay)':
        return 3;
      case '4 Signal Display (1 Relay)':
        return 4;
      default:
        return 1;
    }
  }
}

const linkabaseStore = new LinkabaseStore();
export default linkabaseStore;
