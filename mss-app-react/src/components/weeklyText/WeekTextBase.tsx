import type { TvGame } from '#/graphQl.mjs';
import { useResetAdsenseHeight } from '#hooks/index.mjs';
import { WeekTextTable, type WeekTextTableHandle } from '#text/index.tsx';
import { forwardRef } from 'react';
import styles from './WeekTextBase.module.css';

interface WeekTextBaseProps {
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season: string;
}

const WeekTextBase = forwardRef<WeekTextTableHandle, WeekTextBaseProps>(
  ({ tvGames, isBowlWeek, isMbkPostseason, showPpvColumn, season }, ref) => {
    const mainRef = useResetAdsenseHeight();

    return (
      <main ref={mainRef} className={styles.mainContainer}>
        <p id="Directions" className={`${styles.directions} DONTPrint`}>
          All start times displayed are based on your device&apos;s location. If you have trouble selecting &amp;
          printing games, please try selecting games, changing your print settings to &quot;Print to PDF&quot;, print,
          then open the PDF file and print that.
        </p>

        <WeekTextTable
          ref={ref}
          season={season}
          isBowlWeek={isBowlWeek}
          isMbkPostseason={isMbkPostseason}
          showPpvColumn={showPpvColumn}
          tvGames={tvGames}
        />
      </main>
    );
  }
);

// 👈 ADD THIS LINE: Explicitly names the component for React DevTools and satisfies ESLint
WeekTextBase.displayName = 'WeekTextBase';

export default WeekTextBase;
