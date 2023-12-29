import React from 'react'
interface LayoutProps{
    children: React.ReactNode
}
const layout: React.FC<LayoutProps>= ({children}) => {
  return (
    <div className='container'>
      <header className='header'>
        <main className='main'>
          <nav className='fixed top-0 z-50 w-full bg-red-800 border-b border-gray-200'>
            <div className='px-3 py-3 lg:px-5 lg:pl-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start rtl:justify-end'>
                </div>
                <div className='flex items-center'>
                  <div className='flex items-center ms-3'>
                    <div>
                      <button className='flex text-sm bg-white rounded-full focus:ring-4 focus:ring-gray-300' aria-expanded="false" data-dropdown-toggle="dropdown-user" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <circle cx="12" cy="12" r="9" fill="white"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      </button>
                      <div className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow  id="dropdown-user'>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div>
          </div>
          <div>{children}</div>
        </main>
      </header>
    </div>
  )
}

export default layout
