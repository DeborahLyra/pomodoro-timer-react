import styled from 'styled-components'

export type ButtonVariant = 'primary' | 'secondary' | 'white'

interface ButtonContainerProps {
  variant: ButtonVariant
}

const buttonVariants = {
  primary: 'pink',
  secondary: 'lightblue',
  white: '#ffff',
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;

  ${(props) => `background-color: ${buttonVariants[props.variant]}`};

  color: ${(props) => props.theme.white};
`
