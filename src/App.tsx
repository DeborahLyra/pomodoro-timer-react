import { ThemeProvider } from 'styled-components'
import { defaultThemes } from './styles/default'
import { GlobalStyle } from './styles/global'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './Router'
import { CyclesContextProvider } from './contexts/CyclesContext'

function App() {
  return (
    <ThemeProvider theme={defaultThemes}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
