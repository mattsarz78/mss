import type { WeekInfo } from '#/graphQl.mjs';
import WeekLink from '#season/WeekLink.tsx';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';

interface SeasonDatesProps {
  contents: WeekInfo[];
  sport: string;
  paramYear: string;
  hasBasketballPostseason: boolean;
}

const SeasonDates: React.FC<SeasonDatesProps> = ({ contents, sport, paramYear, hasBasketballPostseason }) => {
  // 1. HOOKS FIRST: Initialize memos right away so they always run in the same order
  const filteredContents = useMemo(() => {
    if (!contents) return [];
    return contents.filter((x) => !x.postseasonInd);
  }, [contents]);

  const postseasonContents = useMemo(() => {
    if (!contents) return [];
    return contents.filter((x) => x.postseasonInd);
  }, [contents]);

  // 2. GUARD CLAUSE: Safe to return early now that all hooks have registered
  if (!contents || contents.length === 0) return null;

  // 3. DATA DERIVATION: Safe to read properties now that contents is guaranteed to exist
  const lastContent = contents[contents.length - 1];

  // Reusable helper to format date ranges cleanly across templates
  const formatDateRangeText = (content: WeekInfo) => {
    const start = DateTime.fromISO(content.startDate, { zone: 'utc' }).toFormat('MMMM dd');
    const end = DateTime.fromISO(content.endDate, { zone: 'utc' }).toFormat('MMMM dd');
    return `Week ${content.week.toString()} - ${start} to ${end}`;
  };

  const getLinkText = (content: WeekInfo) => {
    if (lastContent.week !== content.week) {
      return formatDateRangeText(content);
    }
    return 'Bowl Games';
  };

  const getPostseasonLinkText = (content: WeekInfo) => {
    if (content.postseasonInd === 'N') {
      return 'NCAA Tournament';
    } else if (content.postseasonInd === 'I') {
      return 'NIT';
    }
    return 'Other Postseason Tournaments';
  };

  if (sport === 'football') {
    return (
      <div>
        {contents.map((content) => (
          <WeekLink
            key={`${content.week}-${content.startDate}`}
            year={paramYear}
            sport={sport}
            content={content}
            linkText={getLinkText(content)}
          />
        ))}
      </div>
    );
  }

  if (sport === 'basketball' && hasBasketballPostseason) {
    return (
      <div>
        {filteredContents.map((content) => (
          <WeekLink
            key={`${content.week}-${content.startDate}`}
            sport={sport}
            content={content}
            year={paramYear}
            linkText={formatDateRangeText(content)}
          />
        ))}

        {postseasonContents.length > 0 && (
          <p>
            {postseasonContents.map((content) => (
              <WeekLink
                key={`${content.week}-${content.startDate}`}
                sport={sport}
                year={paramYear}
                content={content}
                linkText={getPostseasonLinkText(content)}
              />
            ))}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {contents.map((content) => (
        <WeekLink
          key={`${content.week}-${content.startDate}`}
          sport={sport}
          year={paramYear}
          content={content}
          linkText={formatDateRangeText(content)}
        />
      ))}
    </div>
  );
};

export default SeasonDates;
