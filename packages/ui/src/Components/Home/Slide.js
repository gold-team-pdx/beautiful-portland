import React from 'react'

const Slide = ({ slideNum, image, isLessthan3 }) => {
  const mainImageStyles = {
    opacity: 1
  }
  const otherImageStyles = {}
  if(!isLessthan3) {
    otherImageStyles = {
      opacity: .4
    }
  }
  else {
    otherImageStyles = {
      opacity: 0
    }
  }

  return (
    slideNum === 1 ? 
      <img className="slide" 
        src={image} 
        alt='beautiful portland homepage' 
        style={mainImageStyles}></img> : 
      <img className='slide' 
        src={image}
        alt='beautiful portland homepage' 
        style={otherImageStyles}></img>
    
  )
}

export default Slide