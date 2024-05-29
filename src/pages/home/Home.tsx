import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { differenceInSeconds } from 'date-fns';
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useEffect, useState } from 'react';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> //para refenciar uma variável JS em TS, precisa ser tipado

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date
}

export function Home() {

  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleID, setActiveCycleID] = useState<string | null>(null)
  const [amountSecondPast, setAmountSecondPast] = useState(0)

  const { handleSubmit, register, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const isSubmitDisabled = watch('task') //observa o input registrado como task, para saber o momento que não está mais vazio

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

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 //calcular o total se segundos
  const currentSeconds = activeCycle ? totalSeconds - amountSecondPast : 0 //calcula o que falta dos segundos para passar

  const minutesAmount = Math.floor(currentSeconds /60) //calcula os minutos dos segundos 

  const secondsAmount = currentSeconds % 60 //calcula quantos segundos faltam

  const minutes = String(minutesAmount).padStart(2, '0') //diz que a const tem que ter 2 char, se não tiver, coloca um 0 na frente
  const seconds = String(secondsAmount).padStart(2, '0') 



  useEffect(()=> {
    let interval: number

    if(activeCycle){
     interval = setInterval(()=>{
        setAmountSecondPast(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }

    return () => { //deleta os intervalos que não precisa mais 
      clearInterval(interval)
    }
  },[activeCycle])


  useEffect(()=> {
    if(activeCycle){
     document.title = `${minutes}:${seconds}`
    }

  },[activeCycle,minutes, seconds])


  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            placeholder='Dê um nome para seu projeto'
            list='task-suggestions'
            {...register('task')}
          />
          <datalist id='task-suggestions'>
            <option value="teste"></option>

          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder='00'
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>

        <StartCountdownButton disabled={!isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
