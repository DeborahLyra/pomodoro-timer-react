import { useContext } from 'react';
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { CyclesContext } from '../../pages/home/Home';
import { useFormContext } from 'react-hook-form';

export function NewCycleForm() {
  const {activeCycle} = useContext(CyclesContext)
  const {register} = useFormContext()
   return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        type="text"
        id="task"
        placeholder='Dê um nome para seu projeto'
        list='task-suggestions'
        {...register('task')}
        disabled={!!activeCycle}
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
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
