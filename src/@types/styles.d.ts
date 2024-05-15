// código apenas de definição de tipos de TS - só para tipagem

import { defaultThemes } from '../styles/default'

type ThemeType = typeof defaultThemes

declare module 'styled-components' {
  export interface DefaultThemes extends ThemeType {}
}
