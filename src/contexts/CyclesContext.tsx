import { createContext, ReactNode, useReducer, useState } from "react";

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

interface CyclesContextProviderProps {
    children: ReactNode //tipagem para qualquer elemento HTML válido
}

interface CyclesState { 
    cycles: Cycle[],
    activeCycleId: string | null
}

export const CyclesContext = createContext({} as CyclesContextType)


export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {

        if (action.type === 'ADD_NEW_CYCLE'){
            return (
                [...state, action.payload.newCycle]
            )
        }
        return state
    }, [])


    const [amountSecondPast, setAmountSecondPast] = useState(0)
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

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: { newCycle }
        })
        //setCycles(state => [...state, newCycle]) //quando vai se adicionar algo ao array existente, é melhor usar o estado prévio
        setActiveCycleID(id)
        setAmountSecondPast(0) //precisa sempre zerar para que não fique com o valor do ciclo anterior
    }

    const marckCycleAsFinished = () => {

        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: { activeCycleID }
        })
        // setCycles(state => state.map((cycle) => {
        //     if (cycle.id === activeCycleID) {
        //         return { ...cycle, finishedtDate: new Date() }
        //     } else {
        //         return cycle
        //     }
        // }))
    }

    const interruptCycle = () => {
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload:{ activeCycleID }
        })
        // setCycles((state) => state.map((cycle) => {
        //     if (cycle.id === activeCycleID) {
        //         return { ...cycle, interruptedtDate: new Date() }
        //     } else {
        //         return cycle
        //     }
        // }))
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
                interruptCycle,

            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}

