import { basketball, football } from '__generated__/prisma';
import { DateTime } from 'luxon';
import { TvGame, TvGamesInput } from '../../__generated__/graphql';
import { IContext } from '../../context';
import { CommonServiceKey } from '../../database/common';
import { BadRequestError, handleError } from '../../utils/errorHandler';
import { formatNetworkJpgAndCoverage } from '../../utils/image';

export interface TvGamesArgs {
  input: TvGamesInput;
}

export const getTvGames = async (_1: unknown, { input }: TvGamesArgs, context: IContext): Promise<TvGame[]> => {
  try {
    if (!input.season || !input.sport || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season, sport, and week are required');
    }

    const results = await context.services[CommonServiceKey].getTvGames(input);

    return results.map((result: football | basketball) => ({
      season: result.season?.trim() ?? '',
      gameTitle: result.gametitle?.trim() ?? '',
      visitingTeam: result.visitingteam?.trim().split(',') ?? [],
      homeTeam: result.hometeam?.trim().split(',') ?? [],
      location: result.location?.trim() ?? '',
      network: result.network?.trim() ?? '',
      networkJpg: formatNetworkJpgAndCoverage(result.networkjpg?.trim() ?? '', input.season),
      coverageNotes: formatNetworkJpgAndCoverage(result.coveragenotes?.trim() ?? '', input.season),
      ppv: formatNetworkJpgAndCoverage(result.ppv?.trim() ?? '', input.season),
      mediaIndicator: result.mediaindicator?.trim() ?? '',
      timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : ''
    }));
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { tvGames: getTvGames } };
