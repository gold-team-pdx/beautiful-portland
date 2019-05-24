import React from 'react'

const Slide = ({ slideNum, image }) => {
  const mainImageStyles = {
    opacity: 1,
  }
  const otherImageStyles = {
    opacity: .5,
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