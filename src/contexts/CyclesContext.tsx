import { createContext, ReactNode, useState } from "react";

interface NewCycleData {
    task: string,
    minutesAmount: number
}

interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedtDate?: Date,
    finishedtDate?: Date
}


interface CyclesContextType {
    cycles: Cycle[],
    activeCycle: Cycle | undefined,
    activeCycleID: string | null,
    marckCycleAsFinished: () => void,
    amountSecondPast: number,
    setSecondPassed: (seconds: number) => void,
    createNewCycle: (data: NewCycleData) => void,
    interruptCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode //tipagem para qualquer elemento HTML válido
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [amountSecondPast, setAmountSecondPast] = useState(0)
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleID, setActiveCycleID] = useState<string | null>(null)

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleID)

    const setSecondPassed = (seconds: number) => {
        setAmountSecondPast(seconds)
    }


    const createNewCycle = (data: NewCycleData) => {
        const id = String(new Date().getTime()) //pega os milissegundos pra transformar em im ID único
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }
        setCycles(state => [...state, newCycle]) //quando vai se adicionar algo ao array existente, é melhor usar o estado prévio
        setActiveCycleID(id)
        setAmountSecondPast(0) //precisa sempre zerar para que não fique com o valor do ciclo anterior
    }

    const marckCycleAsFinished = () => {
        setCycles(state => state.map((cycle) => {
            if (cycle.id === activeCycleID) {
                return { ...cycle, finishedtDate: new Date() }
            } else {
                return cycle
            }
        }))
    }

    const interruptCycle = () => {
        setCycles((state) => state.map((cycle) => {
            if (cycle.id === activeCycleID) {
                return { ...cycle, interruptedtDate: new Date() }
            } else {
                return cycle
            }
        }))
        setActiveCycleID(null)
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleID,
                marckCycleAsFinished,
                amountSecondPast,
                setSecondPassed,
                createNewCycle,
                interruptCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}