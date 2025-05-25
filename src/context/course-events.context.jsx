"use client";

import React, { createContext, useContext, useState } from 'react';

const CourseEventsContext = createContext();

export function CourseEventsProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <CourseEventsContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </CourseEventsContext.Provider>
  );
}

export function useCourseEvents() {
  const context = useContext(CourseEventsContext);
  if (!context) {
    throw new Error('useCourseEvents must be used within a CourseEventsProvider');
  }
  return context;
}
