import type { TvGame } from '#/graphQl.mjs';
import { useResetAdsenseHeight } from '#/hooks/useResetAdsenseHeight.mjs';
import WeekTextTable, { type WeekTextTableHandle } from '#text/WeekTextTable.tsx';
import { forwardRef } from 'react';
import styles from './WeekTextBase.module.css';

interface WeekTextBaseProps {
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season: string;
}

const WeekTextBase = forwardRef<WeekTextTableHandle, WeekTextBaseProps>(({
  tvGames,
  isBowlWeek,
  isMbkPostseason,
  showPpvColumn,
  season
}, ref) => {
  const mainRef = useResetAdsenseHeight();

  return (
    <main ref={mainRef} className={styles.mainContainer}>
      <p id="Directions" className={`${styles.directions} DONTPrint`}>
        All start times displayed are based on your device's location. If you have trouble selecting &amp; printing games,
        please try selecting games, changing your print settings to "Print to PDF", print, then open the PDF file and
        print that.
      </p>
      
      <WeekTextTable
        ref={ref} // 👈 Forward the macro command handler hook reference down to table
        season={season}
        isBowlWeek={isBowlWeek}
        isMbkPostseason={isMbkPostseason}
        showPpvColumn={showPpvColumn}
        tvGames={tvGames}
      />
    </main>
  );
});

export default WeekTextBase;