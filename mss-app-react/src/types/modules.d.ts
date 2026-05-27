declare module '#views/HomeView' {
  import React from 'react';
  const HomeView: React.FC;
  export default HomeView;
}

declare module '#views/CopyrightView' {
  import React from 'react';
  const CopyrightView: React.FC;
  export default CopyrightView;
}

declare module '#views/ArchiveView' {
  import React from 'react';
  const ArchiveView: React.FC;
  export default ArchiveView;
}

declare module '#views/SeasonView' {
  import React from 'react';
  const SeasonView: React.FC;
  export default SeasonView;
}

declare module '#views/ConferenceGamesView' {
  import React from 'react';
  const ConferenceGamesView: React.FC;
  export default ConferenceGamesView;
}

declare module '#views/TvWindowsView' {
  import React from 'react';
  const TvWindowsView: React.FC;
  export default TvWindowsView;
}

declare module '#views/WeeklyScheduleView' {
  import React from 'react';
  const WeeklyScheduleView: React.FC;
  export default WeeklyScheduleView;
}

declare module '#views/WeeklyTextScheduleView' {
  import React from 'react';
  const WeeklyTextScheduleView: React.FC;
  export default WeeklyTextScheduleView;
}

declare module '#views/DailyScheduleView' {
  import React from 'react';
  const DailyScheduleView: React.FC;
  export default DailyScheduleView;
}

declare module '#views/DailyTextScheduleView' {
  import React from 'react';
  const DailyTextScheduleView: React.FC;
  export default DailyTextScheduleView;
}

declare module '#shared/CopyrightLink' {
  import React from 'react';
  const CopyrightLink: React.FC;
  export default CopyrightLink;
}

declare module '#shared/AdsByGoogle' {
  import React from 'react';
  const AdsByGoogle: React.FC;
  export default AdsByGoogle;
}

declare module '#utils/metaTags' {
  export function addMetaTags(title: string): void;
}

declare module '#/router' {
  import React from 'react';
  export interface RouteConfig {
    path: string;
    name?: string;
    element: React.ReactNode;
    redirect?: string;
    props?: Record<string, any>;
  }
  export const routes: RouteConfig[];
}

declare module '#/App' {
  import React from 'react';
  const App: React.FC;
  export default App;
}

declare module '#/devtools' {
  export function initializeApolloDevTools(apolloClient: any): Promise<void>;
}
