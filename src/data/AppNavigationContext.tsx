import React, { createContext, useContext } from 'react'

interface AppNavigation {
  openSettings: () => void
}

const AppNavigationContext = createContext<AppNavigation | null>(null)

export function AppNavigationProvider({
  openSettings,
  children,
}: {
  openSettings: () => void
  children: React.ReactNode
}) {
  return (
    <AppNavigationContext.Provider value={{ openSettings }}>
      {children}
    </AppNavigationContext.Provider>
  )
}

/** Returns null when rendered outside the provider (e.g. in isolation/tests). */
export function useAppNavigation(): AppNavigation | null {
  return useContext(AppNavigationContext)
}
