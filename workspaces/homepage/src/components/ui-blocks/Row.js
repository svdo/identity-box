import styled from '@emotion/styled'

const Row = styled.div({
  width: '80%',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  '@media (max-width: 1100px)': {
    flexFlow: 'column',
    justifyContent: 'center',
    textAlign: 'center'
  },
  alignItems: 'center',
  marginBottom: '30px'
})

export { Row }