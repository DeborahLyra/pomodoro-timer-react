import Header from '../../components/header'
import { Outlet } from 'react-router-dom'
import { LayoutContainer } from './style'

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
    </LayoutContainer>
  )
}
// <Outlet /> é o lugar onde vai ser colocado o conteúdo
