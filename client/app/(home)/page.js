import Square from '@/app/components/Background/Square';
import getTopServers from '@/lib/request/getTopServers';
import ServerCard from '@/app/(home)/components/ServerCard';
import InfoCards from '@/app/(home)/components/InfoCards';
import { Suspense } from 'react';
import Heading from '@/app/(home)/components/Heading';
import TrustedByHeading from '@/app/(home)/components/TrustedByHeading';

export default async function Page() {
  const result = await getTopServers().catch(() => null);

  const { data, totalServers } = result || { data: [], totalServers: 0 };

  return (
    <div className="relative z-10 flex flex-col items-center w-full px-4 mb-24 lg:px-0">
      <Square
        column='10'
        row='10'
        transparentEffectDirection='bottomToTop'
        blockColor='rgba(var(--bg-secondary))'
      />

      <Heading />

      <div className='flex flex-col items-center justify-center w-full max-w-5xl mt-24 gap-y-4'>
        <TrustedByHeading totalServers={totalServers} />

        <div className='flex flex-col flex-wrap justify-center gap-4 sm:flex-row'>
          {data.map(server => (
            <ServerCard data={server} key={server.id} />
          ))}
        </div>
      </div>

      <Suspense fallback={<></>}>
        <InfoCards />
      </Suspense>
    </div>
  );
}