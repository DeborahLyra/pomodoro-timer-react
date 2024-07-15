import { useContext, useEffect } from 'react'
import './styles'
import { CountDownContainer } from './styles'
import { Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../contexts/CyclesContext'


export function CountDown() {
    const {activeCycle, marckCycleAsFinished, amountSecondPast, setSecondPassed} = useContext(CyclesContext)
    
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 //calcular o total se segundos

    const currentSeconds = activeCycle ? totalSeconds - amountSecondPast : 0 //calcula o que falta dos segundos para passar

    const minutesAmount = Math.floor(currentSeconds / 60) //calcula os minutos dos segundos 
  
    const secondsAmount = currentSeconds % 60 //calcula quantos segundos faltam
  
    const minutes = String(minutesAmount).padStart(2, '0') //diz que a const tem que ter 2 char, se não tiver, coloca um 0 na frente
    const seconds = String(secondsAmount).padStart(2, '0')
    
    useEffect(() => {
      if (activeCycle) {
        document.title = `${minutes}:${seconds}`
      }
  
    }, [activeCycle, minutes, seconds])
  
    useEffect(() => {
        let interval: number
    
        if (activeCycle) {
          interval = setInterval(() => {
            const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)
    
            if (secondsDifference >= totalSeconds) { 
                marckCycleAsFinished()
                setSecondPassed(totalSeconds)
              clearInterval(interval)
            } else {
              setSecondPassed(secondsDifference)
            }
          }, 1000)
        }
        return () => { //deleta os intervalos que não precisam mais 
          clearInterval(interval)
        }
      }, [activeCycle, totalSeconds, marckCycleAsFinished])
    
    return (
        <CountDownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountDownContainer>
    )
}
