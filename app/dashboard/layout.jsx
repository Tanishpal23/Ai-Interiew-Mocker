import React from 'react'
import Header from './_components/Header.jsx'

const DashboardLayout = ({children}) => {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className='mx-5 md:mx-20 lg:mx-36 flex-1 pb-12'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout