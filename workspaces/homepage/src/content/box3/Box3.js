import React from 'react'
import { Box, Row } from 'src/components/ui-blocks'

import { Box3Content1 } from './Box3Content1'
import { Box3Content2 } from './Box3Content2'

const Box3 = ({ data }) => (
  <Box backgroundStyles={{
    position: 'relative',
    backgroundImage: 'none',
    backgroundColor: '#092C3E'
  }}>
    <Row css={{
      justifyContent: 'flex-start'
    }}>
      <Box3Content1 data={data} />
    </Row>
    <Row css={{
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      width: 'auto',
      '@media (min-width: 1100px)': {
        marginLeft: '80px'
      }
    }}>
      <Box3Content2 data={data} />
    </Row>
  </Box>
)

export { Box3 }