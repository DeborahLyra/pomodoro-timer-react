import { createContext, ReactNode, useReducer, useState } from "react";
import { ActionTypes, Cycle, cyclesReducer } from "../reducers/cycles";

interface NewCycleData {
    task: string,
    minutesAmount: number
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


export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer( cyclesReducer, {cycles: [], activeCycleId: null}) //separou as funções em outro arquivo

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
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: { newCycle }
        })
        //setCycles(state => [...state, newCycle]) //quando vai se adicionar algo ao array existente, é melhor usar o estado prévio
        setAmountSecondPast(0) //precisa sempre zerar para que não fique com o valor do ciclo anterior
    }

    const marckCycleAsFinished = () => {

        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
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
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
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

