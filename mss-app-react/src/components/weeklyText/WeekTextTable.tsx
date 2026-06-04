import type { TvGame } from '#/graphQl.mjs';
import { formatGame, formatTime } from '#utils/game.mjs';
import { DateTime } from 'luxon';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from './WeekTextTable.module.css';

interface WeekTextTableProps {
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season?: string;
}

// 1. Define the handle interface for your parent component to call
export interface WeekTextTableHandle {
  checkAll: () => void;
  clearAll: () => void;
}

const WeekTextTable = forwardRef<WeekTextTableHandle, WeekTextTableProps>(
  ({ tvGames, isBowlWeek, isMbkPostseason, showPpvColumn }, ref) => {
    const [checkedRows, setCheckedRows] = useState<boolean[]>([]);

    useEffect(() => {
      if (tvGames) {
        setCheckedRows(new Array(tvGames.length).fill(false));
      }
    }, [tvGames]);

    // 2. Expose the clean state-updating methods to the parent ref
    useImperativeHandle(ref, () => ({
      checkAll() {
        setCheckedRows(new Array(tvGames.length).fill(true));
      },
      clearAll() {
        setCheckedRows(new Array(tvGames.length).fill(false));
      },
    }));

    const handleCheckboxChange = (index: number) => {
      setCheckedRows((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        return next;
      });
    };

    const shouldShowPpvHeader = !isBowlWeek && !isMbkPostseason && showPpvColumn;

    return (
      <div id="WeekTextGames">
        <table className={`${styles.tableborder} ${styles.rowStyle} DOPrint`}>
          <thead>
            <tr className="DOPrint">
              <th scope="col" />
              <th scope="col">Game</th>
              <th scope="col">Network</th>
              {shouldShowPpvHeader && <th scope="col">PPV</th>}
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {tvGames.map((tvGame, index) => {
              const isChecked = !!checkedRows[index];
              const printClass = isChecked ? 'DOPrint' : 'DONTPrint';

              const rowStyle: React.CSSProperties = {
                backgroundColor: isChecked ? '#CCC' : '#FFF',
              };

              return (
                <tr key={index} style={rowStyle} className={`gamerow ${styles.rowStyle} ${printClass}`}>
                  <td className={styles.tablecell}>
                    <input
                      id={`checkBox${index}`}
                      className="checkBoxRow"
                      type="checkbox"
                      checked={isChecked}
                      aria-label="Select this game?"
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className={`${styles.tablecell} ${styles.gamecell}`}>
                    {tvGame.gameTitle && (
                      <>
                        <span className={styles.gameTitle}>{tvGame.gameTitle}</span>
                        <br />
                      </>
                    )}
                    {!tvGame.visitingTeam ||
                    tvGame.visitingTeam.length === 0 ||
                    tvGame.visitingTeam[0] === '' ? null : tvGame.visitingTeam.length === 1 &&
                      tvGame.homeTeam?.length === 1 &&
                      tvGame.visitingTeam[0] !== '' ? (
                      <>
                        {tvGame.visitingTeam[0]} {tvGame.location ? 'vs.' : 'at'} {tvGame.homeTeam[0]}
                        <br />
                      </>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: formatGame(tvGame) }} />
                    )}
                    {tvGame.location && <> (at {tvGame.location}) </>}
                  </td>
                  <td
                    className={`${styles.tablecell} ${styles.networkcell}`}
                    dangerouslySetInnerHTML={{ __html: tvGame.network || '' }}
                  />
                  {showPpvColumn && (
                    <td className={`${styles.tablecell} ${styles.ppvcell}`}>{tvGame.ppv === 'X' ? 'PPV' : ''}</td>
                  )}
                  <td className={`${styles.tablecell} ${styles.timecell}`}>
                    {formatTime(tvGame.timeWithOffset!) === 'TBA' ? (
                      <>
                        <span />
                        {DateTime.fromISO(tvGame.timeWithOffset!).setZone('America/New_York').toFormat('MM/dd/yyyy') +
                          ' TBA'}
                      </>
                    ) : (
                      <>{DateTime.fromISO(tvGame.timeWithOffset!).toLocal().toFormat('MM/dd/yyyy t')}</>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

export default WeekTextTable;
