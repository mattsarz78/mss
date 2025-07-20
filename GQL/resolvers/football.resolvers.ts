import { IContext } from '@/context';
import { FootballServiceKey, NoTVGames } from '@database/football';
import { NoTvGame, NoTvGamesInput } from '@generated/graphql';
import { BadRequestError, handleError } from '@utils/errorHandler';
import { DateTime } from 'luxon';

export interface NoTvGamesArgs {
  input: NoTvGamesInput;
}

export const noTvGames = async (_1: unknown, { input }: NoTvGamesArgs, context: IContext): Promise<NoTvGame[]> => {
  try {
    if (!input.season || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season is required');
    }

    const results = await context.services[FootballServiceKey].getNoTvGames(input);
    return results.map((result) => ({
      gameTitle: result.gametitle?.trim() ?? '',
      visitingTeam: result.visitingteam?.trim() ?? '',
      homeTeam: result.hometeam?.trim() ?? '',
      location: result.location?.trim() ?? '',
      conference: result.conference?.trim() ?? '',
      tvOptions: updatedTvOptions(result),
      timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : '',
      fcs: result.fcs?.trim() ?? ''
    }));
  } catch (err: unknown) {
    throw handleError(err);
  }
};

const updatedTvOptions = (game: NoTVGames): string => {
  if (game.conference === 'American' && (game.hometeam === 'Navy' || game.hometeam === 'Army West Point')) {
    return game.tvoptions?.replace(' or ESPN+', ' or CBS Sports Network').trim() ?? 'Unknown';
  }

  if (game.conference === 'MWC') {
    if (game.hometeam === "Hawai'i" || game.visitingteam === "Hawai'i") {
      return game.tvoptions?.replace('MW Network', 'Spectrum PPV').trim() ?? 'Unknown';
    }

    if (game.visitingteam === 'Boise State') {
      return 'CBS or CBS Sports Network';
    }

    return game.hometeam === 'Boise State' ? 'FOX, FS1 or FS2' : (game.tvoptions ?? 'Unknown');
  }

  return game.tvoptions ?? 'Unknown';
};
