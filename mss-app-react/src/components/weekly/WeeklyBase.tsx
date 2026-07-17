import type { TvGame } from '#/graphQl.mjs';
import { useResetAdsenseHeight } from '#hooks/index.mjs';
import { getDateForGame } from '#utils/index.mjs';
import { WeekGamesTable } from '#weekly/index.tsx';
import React, { useMemo } from 'react';
import styles from './WeeklyBase.module.css';

interface WeeklyBaseProps {
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  isDaily: boolean;
  showPpvColumn: boolean;
}

const WeeklyBase: React.FC<WeeklyBaseProps> = ({ tvGames, isBowlWeek, isMbkPostseason, isDaily, showPpvColumn }) => {
  const mainRef = useResetAdsenseHeight();

  const hasValidTime = (game: TvGame): game is TvGame & { timeWithOffset: string } =>
    typeof game.timeWithOffset === 'string';

  type GamesByDate = Record<string, TvGame[]>;

  // Group games dynamically into an associative map dictionary matching Vue's reducer
  const tvGamesByDate = useMemo<GamesByDate>(() => {
    if (!tvGames) return {};

    return tvGames.filter(hasValidTime).reduce<GamesByDate>((acc, game) => {
      const date = getDateForGame(game.timeWithOffset);
      if (date) {
        acc[date] ??= [];
        acc[date].push(game);
      }
      return acc;
    }, {});
  }, [tvGames]);

  // Extract keys and apply natural sorting order bounds
  const datesList = useMemo(() => {
    return Object.keys(tvGamesByDate).sort();
  }, [tvGamesByDate]);

  if (datesList.length === 0 && !isDaily) {
    return null;
  }

  // Flatten Vue array class checks into a clean text conditional layout string
  const mainPaddingClass =
    isMbkPostseason || isBowlWeek ? styles.shortMainPadding : isDaily ? styles.dailyPadding : styles.mainPadding;

  return (
    <main ref={mainRef} className={mainPaddingClass}>
      <div id="WeeksBase">
        {tvGames.length === 0 ? (
          <p>There are no televised games at this time</p>
        ) : (
          <>
            <p>
              <strong>All start times displayed are based on your device&apos;s location.</strong>
            </p>
            {datesList.map((weekDate) => (
              <div key={weekDate}>
                <WeekGamesTable
                  weekDate={weekDate}
                  isBowlWeek={isBowlWeek}
                  isMbkPostseason={isMbkPostseason}
                  showPpvColumn={showPpvColumn}
                  tvGamesForDate={tvGamesByDate[weekDate]}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
};

export default WeeklyBase;
