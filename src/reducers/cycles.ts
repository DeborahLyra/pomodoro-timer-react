export interface Cycle {
    id: string,
    task: string,
    minutesAmount: number,
    startDate: Date,
    interruptedtDate?: Date,
    finishedtDate?: Date
}

interface CyclesState { 
    cycles: Cycle[],
    activeCycleId: string | null
}

export enum ActionTypes {
    ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
    MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED', 
    INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE'
}

export function cyclesReducer (state: CyclesState, action: any) {

    if (action.type === ActionTypes.ADD_NEW_CYCLE){
        return  {
                ...state,
               cycles: [...state.cycles, action.payload.newCycle],
               activeCycleId: action.payload.newCycle.id
            }
        
    }

    if (action.type === ActionTypes.INTERRUPT_CURRENT_CYCLE){
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

    if (action.type === ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED){
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
}