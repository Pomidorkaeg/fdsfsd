import { playersApi, newsApi, mediaApi, matchesApi, teamsApi, coachesApi, tournamentsApi } from '../lib/api';
import { PlayerItem, NewsItem, MediaItem } from '../lib/api';

const checkDatabase = async () => {
  console.log('Checking database state...');
  
  try {
    const [players, news, media, matches, teams, coaches, tournaments] = await Promise.all([
      playersApi.getAll() as Promise<PlayerItem[]>,
      newsApi.getAll() as Promise<NewsItem[]>,
      mediaApi.getAll() as Promise<MediaItem[]>,
      matchesApi.getAll() as Promise<any[]>,
      teamsApi.getAll() as Promise<any[]>,
      coachesApi.getAll() as Promise<any[]>,
      tournamentsApi.getAll() as Promise<any[]>
    ]);

    console.log('\nCurrent database state:');
    console.log('Players:', players.length);
    console.log('News:', news.length);
    console.log('Media:', media.length);
    console.log('Matches:', matches.length);
    console.log('Teams:', teams.length);
    console.log('Coaches:', coaches.length);
    console.log('Tournaments:', tournaments.length);
  } catch (error) {
    console.error('Error checking database:', error);
  }
};

checkDatabase(); 