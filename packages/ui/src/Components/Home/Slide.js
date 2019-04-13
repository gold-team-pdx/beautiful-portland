import React from 'react'
import PropTypes from 'prop-types'

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

  Slide.propTypes = {
    image: PropTypes.string
}
  export default Slide