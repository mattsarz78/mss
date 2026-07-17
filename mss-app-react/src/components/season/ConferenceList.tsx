import conferenceCasingData from '#data/conferenceCasing.json' with { type: 'json' }; // Type attributes usually aren't needed in React build systems
import type { ConferenceCasing } from '#data/exportTypes.mjs';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface ConferenceListProps {
  conferenceList: string;
  year: string;
}

// Explicit type for our computed structural array
interface ConferenceLinkItem {
  key: string;
  link: ConferenceCasing | undefined;
}

const conferenceLinkBase = [
  { key: 'acc', conference: 'acc' },
  { key: 'b12', conference: 'b12' },
  { key: 'b1g', conference: 'b1g' },
  { key: 'cusa', conference: 'cusa' },
  { key: 'ind', conference: 'ind' },
  { key: 'mac', conference: 'mac' },
  { key: 'mw', conference: 'mw' },
  { key: 'pac', conference: 'pac' },
  { key: 'sec', conference: 'sec' },
  { key: 'sbc', conference: 'sbc' }
] as const satisfies ReadonlyArray<{ key: string; conference: string }>;

const ConferenceList: React.FC<ConferenceListProps> = ({ conferenceList, year }) => {
  // Helper to locate individual configurations
  const getConferenceCasing = (conference: string) =>
    (conferenceCasingData as ConferenceCasing[]).find((x) => x.id === conference);

  // Parity logic: Replacing Vue's computed() with useMemo
  const conferenceLinks = useMemo<ConferenceLinkItem[]>(() => {
    const links: ConferenceLinkItem[] = conferenceLinkBase.map((entry) => ({
      key: entry.key,
      link: getConferenceCasing(entry.conference)
    }));

    const pacEntry = links.find((entry) => entry.key === 'pac');
    if (pacEntry) {
      pacEntry.link = conferenceList === 'ListBase1' ? getConferenceCasing('p10') : getConferenceCasing('p12');
    }

    // Splice conditional insertions matching Vue's mutation strategy
    if (conferenceList === 'ListBase3') {
      links.splice(1, 0, { key: 'aac', link: getConferenceCasing('aac') });
    } else {
      links.splice(1, 0, { key: 'beast', link: getConferenceCasing('beast') });
    }

    if (conferenceList === 'ListBase1' || conferenceList === 'ListBase2') {
      links.push({ key: 'wac', link: getConferenceCasing('wac') });
    }

    return links;
  }, [conferenceList]); // Re-compute only if the structural base changes

  return (
    <div id="Conference" className="DONTPrint">
      <p>
        <span>By Conference</span>
      </p>
      {conferenceLinks.map((conference) => {
        // Safe guard check just in case lookup returns undefined
        if (!conference.link) return null;

        return (
          <div key={conference.key}>
            <Link to={`/contract/${conference.link.slug}/${year}`}>{conference.link.cased}</Link>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default ConferenceList;
