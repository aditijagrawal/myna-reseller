import React, { createContext, useContext, useState } from 'react'
import { PROCEDURES, HC_PROCEDURES, type Procedure } from './procedureData'

const INITIAL_PROCEDURES: Procedure[] = [...PROCEDURES, ...HC_PROCEDURES]

interface ProcedureStore {
  procedures: Procedure[]
  addProcedure: (proc: Procedure) => void
  updateProcedure: (proc: Procedure) => void
  deleteProcedure: (id: string) => void
}

const ProcedureStoreContext = createContext<ProcedureStore | null>(null)

export function ProcedureStoreProvider({ children }: { children: React.ReactNode }) {
  const [procedures, setProcedures] = useState<Procedure[]>(INITIAL_PROCEDURES)

  const addProcedure = (proc: Procedure) =>
    setProcedures((prev) => [...prev, proc])

  const updateProcedure = (proc: Procedure) =>
    setProcedures((prev) => prev.map((p) => (p.id === proc.id ? proc : p)))

  const deleteProcedure = (id: string) =>
    setProcedures((prev) => prev.filter((p) => p.id !== id))

  return (
    <ProcedureStoreContext.Provider value={{ procedures, addProcedure, updateProcedure, deleteProcedure }}>
      {children}
    </ProcedureStoreContext.Provider>
  )
}

export function useProcedureStore(): ProcedureStore {
  const ctx = useContext(ProcedureStoreContext)
  if (!ctx) throw new Error('useProcedureStore must be used inside ProcedureStoreProvider')
  return ctx
}
