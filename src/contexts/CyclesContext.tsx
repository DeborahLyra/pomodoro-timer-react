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
    activeCycleId: string | null,
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

    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {

        if (action.type === 'ADD_NEW_CYCLE'){
            return  {
                    ...state,
                   cycles: [...state.cycles, action.payload.newCycle],
                   activeCycleId: action.payload.newCycle.id
                }
            
        }

        if (action.type === 'INTERRUPT_CURRENT_CYCLE'){
            return {
                ...state,
                cycles: state.cycles.map((cycle) => {
                    if (cycle.id === state.activeCycleId) {
                        return { ...cycle, interruptedtDate: new Date() }
                    } else {
                        return cycle
                    }
                    }),
                activeCycleId: null
            }
        }

        if (action.type === 'MARK_CURRENT_CYCLE_AS_FINISHED'){
            return {
                ...state,
                cycles: state.cycles.map((cycle) => {
                    if (cycle.id === state.activeCycleId) {
                        return { ...cycle, finishedtDate: new Date() }
                    } else {
                        return cycle
                    }
                }),
                activeCycleId: null
            }
        }
        return state
    }, {cycles: [], activeCycleId: null})

    const { cycles, activeCycleId } = cyclesState

    const [amountSecondPast, setAmountSecondPast] = useState(0)

    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

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
        setAmountSecondPast(0) //precisa sempre zerar para que não fique com o valor do ciclo anterior
    }

    const marckCycleAsFinished = () => {

        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: { activeCycleId }
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
            payload:{ activeCycleId }
        })
        // setCycles((state) => state.map((cycle) => {
        //     if (cycle.id === activeCycleID) {
        //         return { ...cycle, interruptedtDate: new Date() }
        //     } else {
        //         return cycle
        //     }
        // }))
         //setActiveCycleID(null)
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
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

