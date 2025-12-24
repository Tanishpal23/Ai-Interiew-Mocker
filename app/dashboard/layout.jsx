import React from 'react'
import Header from './_components/Header.jsx'

const DashboardLayout = ({children}) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default DashboardLayout