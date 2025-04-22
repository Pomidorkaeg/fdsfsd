import { clearAllData } from '../lib/api';

const clearDatabase = async () => {
  console.log('Starting to clear all data...');
  const success = await clearAllData();
  if (success) {
    console.log('All data has been successfully cleared!');
  } else {
    console.error('Failed to clear data');
  }
};

clearDatabase(); 