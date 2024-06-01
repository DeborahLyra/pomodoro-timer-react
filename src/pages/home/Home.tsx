import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  HomeContainer,
  SotpCountdownButton,
  StartCountdownButton,

} from './styles'
import { createContext, useState } from 'react';
import { CountDown } from '../../components/countDown';
import { NewCycleForm } from '../../components/newCycleForm';

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date,
  interruptedtDate?: Date,
  finishedtDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined,
  activeCycleID: string | null,
  marckCycleAsFinished: () => void,
  amountSecondPast: number,
  setSecondPassed: (seconds: number) => void
}

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60)
})

export const CyclesContext = createContext({} as CyclesContextType)

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> //para refenciar uma variável JS em TS, precisa ser tipado

export function Home() {

  const [amountSecondPast, setAmountSecondPast] = useState(0)

  const [cycles, setCycles] = useState<Cycle[]>([])

  const [activeCycleID, setActiveCycleID] = useState<string | null>(null)

  const newCyleForm = useForm<NewCycleFormData>({ //usar um contexto proprio do form para pode passar o register para outro comp
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const { handleSubmit, watch, reset } = newCyleForm

  const isSubmitDisabled = watch('task') //observa o input registrado como task, para saber o momento que não está mais vazio

  const setSecondPassed =(seconds: number) => {
    setAmountSecondPast(seconds)
  }
  
  const handleCreateNewCycle = (data: NewCycleFormData) => {
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
    reset()
  }

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleID)

  const marckCycleAsFinished = () => {
    setCycles(state => state.map((cycle) => {
      if (cycle.id === activeCycleID) {
        return { ...cycle, finishedtDate: new Date() }
      } else {
        return cycle
      }
    }))
  }

  const handleInterruptCycle = () => {
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
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider value={{ activeCycle, activeCycleID, marckCycleAsFinished, amountSecondPast, setSecondPassed }}>
          <FormProvider {...newCyleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>
        {
          activeCycle ? (
            <SotpCountdownButton onClick={handleInterruptCycle} type="button">
              <HandPalm size={24} />
              Interromper
            </SotpCountdownButton>
          ) : (
            <StartCountdownButton disabled={!isSubmitDisabled} type="submit">
              <Play size={24} />
              Começar
            </StartCountdownButton>
          )
        }
      </form>
    </HomeContainer>
  )
}
