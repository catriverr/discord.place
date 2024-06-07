'use client';

import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import ErrorState from '@/app/components/ErrorState';
import config from '@/config';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry, BsQuestionCircleFill } from 'react-icons/bs';
import UnlistedCard from '@/app/(account)/account/components/Content/Tabs/MyServers/UnlistedCard';
import NewServer from '@/app/(account)/account/components/Content/Tabs/MyServers/NewServer';

export default function MyServers() {
  const data = useAccountStore(state => state.data);
  const currentlyAddingServer = useAccountStore(state => state.currentlyAddingServer);

  return (
    currentlyAddingServer !== null ? (
      <div className='flex flex-col px-6 mt-16 lg:px-16 gap-y-6'>
        <NewServer />
      </div>
    ) : (
      <div className='flex flex-col px-6 mt-16 lg:px-16 gap-y-6'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            My Servers
          </h1>

          <p className='text-sm text-secondary'>
            View or manage the servers that you have listed on discord.place.
          </p>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            Listed Servers

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {(data.servers || []).filter(server => server.is_created === true).length}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            Here, you can see the servers that you have listed on discord.place.
          </p>

          {(data.servers || []).length === 0 ? (
            <div className='max-w-[800px] mt-20'>
              <ErrorState 
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    It{'\''}s quiet in here...
                  </div>
                }
                message={'You have not listed any servers on discord.place.'}
              />
            </div>
          ) : (
            <div className='flex gap-4 flex-wrap max-w-[800px] mt-2'>
              {data.servers
                .filter(server => server.is_created === true)
                .map(server => (
                  <Link
                    key={server._id}
                    className='flex items-center gap-4 p-4 transition-opacity bg-secondary rounded-xl hover:opacity-70'
                    href={`/servers/${server.id}`}
                  >
                    <div className='relative w-12 h-12'>
                      <ServerIcon
                        width={48}
                        height={48}
                        icon_url={server.icon_url}
                        name={server.name}
                        className='[&>h2]:text-base'
                      />
                    </div>

                    <div className='flex flex-col'>
                      <h3 className='text-sm font-bold text-primary'>
                        {server.name}
                      </h3>

                      <p className='text-xs text-tertiary'>
                        {server.members} members
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            Unlisted Servers

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {(data.servers || []).filter(server => server.is_created === false).length}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            Here, you can see the servers that you have not listed on discord.place.
          </p>

          <div className='mt-4 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center text-lg font-semibold gap-x-2'>
              <BsQuestionCircleFill /> Can{'\''}t see your server?
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              You can only add servers that you own. If you can{'\''}t see your server, make sure you{'\''}re the owner of the server.<br/>If you still can{'\''}t see your server, make sure <Link className='text-secondary hover:text-primary' href={config.botInviteURL} target='_blank'>discord.place bot</Link> is in your server.
            </p>
          </div>

          {(data.servers || []).length === 0 ? (
            <div className='max-w-[800px]'>
              <ErrorState 
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    It{'\''}s quiet in here...
                  </div>
                }
                message={'There are no servers unlisted on discord.place.'}
              />
            </div>
          ) : (
            <div className='flex gap-4 flex-wrap max-w-[800px] mt-2'>
              {data.servers
                .filter(server => server.is_created === false)
                .map(server => (
                  <UnlistedCard key={server._id} server={server} />
                ))}
            </div>
          )}
        </div>
      </div>
    )
  );
}