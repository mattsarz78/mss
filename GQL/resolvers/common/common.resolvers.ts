import { getDailyTvGames } from './common.dailyTvGames';
import { getTvGames } from './common.tvGames';

export default { Query: { tvGames: getTvGames, dailyTvGames: getDailyTvGames } };
