import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  HomeContainer,
  SotpCountdownButton,
  StartCountdownButton,

} from './styles'

import { CountDown } from '../../components/countDown';
import { NewCycleForm } from '../../components/newCycleForm';
import { useContext } from 'react';
import { CyclesContext } from '../../contexts/CyclesContext';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> //para refenciar uma variável JS em TS, precisa ser tipado

export function Home() {

  const {activeCycle, createNewCycle, interruptCycle} = useContext(CyclesContext)

  const newCyleForm = useForm<NewCycleFormData>({ //usar um contexto proprio do form para pode passar o register para outro comp
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const { handleSubmit, watch, reset } = newCyleForm

  const isSubmitDisabled = watch('task') //observa o input registrado como task, para saber o momento que não está mais vazio


  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(createNewCycle)}>
        <FormProvider {...newCyleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />
        {
          activeCycle ? (
            <SotpCountdownButton onClick={interruptCycle} type="button">
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
