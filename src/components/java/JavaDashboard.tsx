import { Menu, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Fragment, useContext, useEffect, useState } from 'react';

import Modal from '../Modal';
import { UserContext } from '../../AppWrapper';
import {
  classNames,
  fetchJavaDBStreamInfo,
  fetchJavaDBStreams,
} from '../../utils';
import CreateJavaStreamModal from './CreateJavaStreamModal';
import InsertJavaModal from './InsertJavaModal';
import SchemaJavaModal from './SchemaJavaModal';
import QueryJavaModal from './QueryJavaModal';

export default function Dashboard() {

  // The userContext is passed by the parent AppWrapper
  const user = useContext(UserContext);
  const [availableStreams, setAvailableStreams] = useState<any[]>([]);

  // TODO: These four useStates can be merged into an object
  const [createJavaStreamModalOpen, setCreateJavaStreamModalOpen] = useState(false);
  const [insertJavaModalOpen, setInsertJavaModalOpen] = useState(false);
  const [schemaJavaModalOpen, setSchemaJavaModalOpen] = useState(false);
  const [queryJavaModalOpen, setQueryJavaModalOpen] = useState(false);

  // The modal belonging to this component is responsible for showing stream info.
  const [modal, setModal] = useState({
    open: false,
    title: 'Loading...',
    body: '',
  });

  const StreamDropdownItems = [
    {
      name: 'Query',
      onClick: (streamId: number) => {
        setQueryJavaModalOpen(true);
      },
    },
    {
      name: 'Insert',
      onClick: (streamId: number) => {
        setInsertJavaModalOpen(true);
      },
    },
    {
      name: 'Schema',
      onClick: (streamId: number) => {
        setSchemaJavaModalOpen(true);
      },
    },
  ];

  // Every time the user or modalOpen loads/changes, updateStreams is called.
  useEffect(() => {
    updateStreams();
  }, [user, modal, createJavaStreamModalOpen]);

  // Fetch information and populate Dashboard table view.
  const updateStreams = async () => {
    const streams = await fetchJavaDBStreams(user);
    setAvailableStreams(streams);
  };

  const showStreamInfo = async (stream: string) => {
    setModal({
      open: true,
      title: 'Stream Info of : ' + stream,
      body: await fetchJavaDBStreamInfo(stream),
    });
  };

  return (
    <>
      <CreateJavaStreamModal
        open={createJavaStreamModalOpen}
        setOpen={setCreateJavaStreamModalOpen}
      />
      <InsertJavaModal 
        open={insertJavaModalOpen}
        setOpen={setInsertJavaModalOpen} 
        streamID={0}
      />
      <SchemaJavaModal 
        open={schemaJavaModalOpen} 
        setOpen={setSchemaJavaModalOpen} 
      />
      <QueryJavaModal 
        open={queryJavaModalOpen} 
        setOpen={setQueryJavaModalOpen} 
      />
      <Modal
        title={modal.title}
        body={modal.body}
        buttonTitle={'Close'}
        open={modal.open}
        setOpen={(openState) =>
          setModal((current) => ({ ...current, open: openState }))
        }
      />
      <main className='flex-1'>
        <div className='p-6'>
          <div className='px-4 sm:px-6 md:px-0 flex justify-between'>
            <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-200 my-auto'>
                Dashboard
            </h1>
            {(user.roles.includes('admin') || user.roles.includes('write')) && (
              <button
                onClick={() => {
                  setCreateJavaStreamModalOpen(true);
                }}
                className='flex px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-blue-500 dark:text-white dark:border-gray-500 dark:hover:bg-blue-400'
              >
                Create Stream
                <PlusIcon className='ml-2 my-auto h-4' />
              </button>
            )}
          </div>
          {/*<div className="px-4 sm:px-6 md:px-0">*/}
          {/*  {availableStreams.map(stream => {*/}
          {/*        let online = stream[1] === "Online";*/}
          {/*        return (<div className={classNames("p-2 shadow-md bg-white rounded-md my-2 border flex", online ? "border-green-500" : "border-red-500")}>*/}
          {/*          <p className="text-gray-700">Stream {stream[0]}: {stream[1]}</p>*/}
          {/*        </div>)*/}
          {/*  }*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
        {/* Projects table (small breakpoint and up) */}
        <div className='hidden sm:block'>
          <div className='align-middle inline-block min-w-full border-b border-gray-200 dark:border-gray-500'>
            <table className='min-w-full'>
              <thead>
                <tr className='border-t border-gray-200 dark:border-gray-500'>
                  <th className='px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <span className='lg:pl-2'>Streams</span>
                  </th>
                  <th className='hidden md:table-cell px-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Info
                  </th>
                  <th className='pr-6 py-3 bg-gray-50 dark:bg-gray-600 dark:text-gray-200 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    <span className='lg:pl-2'>Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100 dark:divide-gray-600'>
                {availableStreams.map((stream) => (
                  <tr key={stream}>
                    <td className='px-6 py-3 max-w-0 w-full whitespace-nowrap text-sm font-medium dark:bg-gray-500 text-gray-900 dark:text-gray-200'>
                      <div className='flex items-center space-x-3 lg:pl-2'>
                        <div
                          className={classNames(
                            'bg-green-500',
                            'flex-shrink-0 w-2.5 h-2.5 rounded-full'
                          )}
                          aria-hidden='true'
                        />
                        <a href='#' className='truncate hover:text-gray-600'>
                          <span>
                              {stream}
                          </span>
                        </a>
                      </div>
                    </td>
                    <td className='px-6 py-3 whitespace-nowrap text-right text-sm font-normal dark:bg-gray-500 dark:text-gray-200'>
                      <button
                        className={classNames(
                          'text-xs font-normal',
                          stream[1] === 'Offline'
                            ? 'text-gray-500 dark:text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-200'
                        )}
                        onClick={() => showStreamInfo(stream)}
                      >
                        Show Info
                      </button>
                    </td>
                    <td className='px-6 py-3 whitespace-nowrap text-right text-sm font-normal dark:bg-gray-500 dark:text-gray-200'>
                      <span className='relative inline-flex shadow-sm rounded-md'>
                        <Menu as='span' className='-ml-px relative block'>
                          <Menu.Button className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-800 focus:border-indigo-800 dark:bg-gray-600 dark:text-white dark:border-gray-700 dark:hover:bg-gray-500'>
                            <span className='sr-only'>Open options</span>
                            <ChevronDownIcon
                              className='h-5 w-5'
                              aria-hidden='true'
                            />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter='transition ease-out duration-100'
                            enterFrom='transform opacity-0 scale-95'
                            enterTo='transform opacity-100 scale-100'
                            leave='transition ease-in duration-75'
                            leaveFrom='transform opacity-100 scale-100'
                            leaveTo='transform opacity-0 scale-95'
                          >
                            <Menu.Items className='origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-gray-600 dark:text-white'>
                              <div className='py-1 z-50'>
                                {StreamDropdownItems.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <button
                                        onClick={() => item.onClick(stream[0])}
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-500 dark:text-gray-100'
                                            : 'text-gray-700 dark:text-gray-200',
                                          'block px-4 py-2 text-xs font-regular w-full text-left'
                                        )}
                                      >
                                        {item.name}
                                      </button>
                                    )}
                                  </Menu.Item>
                                ))}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

