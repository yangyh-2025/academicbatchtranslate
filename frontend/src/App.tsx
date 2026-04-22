// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import BatchPage from '@/pages/BatchPage'
import GlossaryPage from '@/pages/GlossaryPage'
import SettingsPage from '@/pages/SettingsPage'
import HistoryPage from '@/pages/HistoryPage'
import { useConfigStore } from '@/stores/configStore'
import { getDefaultParams } from '@/services/configService'

// Sidebar 内部组件，使用 React Router 的 navigate
function SidebarWrapper() {
  const location = useLocation()
  return (
    <Sidebar
      currentPath={location.pathname}
      onNavigate={(path) => {
        window.location.hash = path
      }}
    />
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const { updatePayload } = useConfigStore()

  // Load initial config from backend on mount
  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        const defaultParams = await getDefaultParams()
        // Merge backend defaults into config store
        updatePayload(defaultParams as any)
      } catch (error) {
        console.error('Failed to load initial config:', error)
      }
    }
    loadInitialConfig()
  }, [updatePayload])

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <div className="h-screen bg-neutral-50 flex flex-col">
          <Header />

          <div className="flex-1 flex overflow-hidden">
            <SidebarWrapper />

            <main className="flex-1 overflow-auto">
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <BatchPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/glossary"
                  element={
                    <PageTransition>
                      <GlossaryPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PageTransition>
                      <SettingsPage />
                    </PageTransition>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PageTransition>
                      <HistoryPage />
                    </PageTransition>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </QueryClientProvider>
  )
}
