import React from 'react'
import WorkSpaceProvider from './provider'

const WorkSpaceLayout = ({children}) => {
  return (
    <div>
      <WorkSpaceProvider>
        {children}
      </WorkSpaceProvider>
    </div>
  )
}

export default WorkSpaceLayout