import fetch from 'node-fetch';

const API_BASE_URL = 'https://bds-server.onrender.com/api';

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    return [];
  }
}

async function deleteItem(endpoint, id) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting item ${id} from ${endpoint}:`, error);
    return false;
  }
}

async function deleteAllData() {
  try {
    console.log('Fetching all data...');
    
    // Get all data
    const [players, news, media, matches, teams, coaches, tournaments] = await Promise.all([
      fetchData('/players'),
      fetchData('/news'),
      fetchData('/media'),
      fetchData('/matches'),
      fetchData('/teams'),
      fetchData('/coaches'),
      fetchData('/tournaments')
    ]);

    console.log('Current items count:');
    console.log('Players:', players.length);
    console.log('News:', news.length);
    console.log('Media:', media.length);
    console.log('Matches:', matches.length);
    console.log('Teams:', teams.length);
    console.log('Coaches:', coaches.length);
    console.log('Tournaments:', tournaments.length);

    console.log('\nDeleting all items...');

    // Delete all items
    const deletePromises = [
      ...players.map(item => deleteItem('/players', item._id)),
      ...news.map(item => deleteItem('/news', item._id)),
      ...media.map(item => deleteItem('/media', item._id)),
      ...matches.map(item => deleteItem('/matches', item._id)),
      ...teams.map(item => deleteItem('/teams', item._id)),
      ...coaches.map(item => deleteItem('/coaches', item._id)),
      ...tournaments.map(item => deleteItem('/tournaments', item._id))
    ];

    await Promise.all(deletePromises);
    console.log('All data has been successfully deleted!');
  } catch (error) {
    console.error('Error in delete operation:', error);
  }
}

// Run the script
deleteAllData(); 