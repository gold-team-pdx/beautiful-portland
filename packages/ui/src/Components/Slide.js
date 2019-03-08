import React from 'react'

const Slide = ({ image }) => {
    const styles = {
      backgroundImage: `url(${image})`,
      backgroundPosition: 'center top',
      backgroundSize: 'auto 100%',
      backgroundRepeat: 'no-repeat',
      float: 'left',
    }
    return <div className="slide" style={styles}></div>
  }

  export default Slide