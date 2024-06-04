import { useContext } from "react";
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";

export function History() {
  //const { cyles } = useContext(CyclesContext)

  return (
    <HistoryContainer>
      <h1>Meu Histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>tarefa</td>
              <td>20min</td>
              <td>há dois meses</td>
              <td>
                <Status statusColor="green">Concluido</Status>
              </td>

            </tr>
            <tr>
              <td>tarefa</td>
              <td>20min</td>
              <td>há dois meses</td>
              <td>
                <Status statusColor="yellow">Pausado</Status>
              </td>
            </tr>
            <tr>
              <td>tarefa</td>
              <td>20min</td>
              <td>há dois meses</td>
              <td>
                <Status statusColor="red">Cancelado</Status>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
