import React from 'react'
import { Button } from 'semantic-ui-react'

const buttonStyles={
  fontFamily: 'Nunito',
  color: '#FFF',
  fontSize: 'calc(14px + (36 - 14) * ((100vw - 300px) / (1300)))',
  lineHeight: 'calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1300)))',
  backgroundColor: '#a8efae'
}

const DonateButton = () => {
  return (
    <div className='donateButton'>
      <Button size='massive' fluid style={buttonStyles}>
                DONATE NOW
      </Button>
    </div>
  )
}

export default DonateButton