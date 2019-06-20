import React from 'react'
import styled from '@emotion/styled'
import { getImage } from 'src/assets'

const SocialIconsRow = styled.div({
  width: '140px',
  display: 'flex',
  flexFlow: 'row nowrap',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px'
})

const SocialIcon = ({ imageUrl, ...props }) => (
  <div css={{
    margin: 0,
    width: '32px',
    height: '32px',
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: 'auto 100%',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat'
  }} {...props} />
)

const SocialIcons = ({ data }) => (
  <SocialIconsRow css={{
    '@media (min-width: 568px)': {
      alignSelf: 'flex-start',
      marginLeft: '55px'
    }
  }}>
    <SocialIcon imageUrl={getImage(data, 'Twitter')} />
    <SocialIcon imageUrl={getImage(data, 'Youtube')} css={{ width: '46px' }} />
    <SocialIcon imageUrl={getImage(data, 'GitHub')} />
  </SocialIconsRow>
)

export { SocialIcons }
