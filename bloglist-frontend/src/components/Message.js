import React from 'react'
import PropTypes from 'prop-types'

const Message = ({ show, message, red }) => {
  if(show){
    if(red){
      return(
        <div>
          <p className="Message-red" >{message}</p>
        </div>
      )
    } else {
      return(
        <div>
          <p className="Message-green" >{message}</p>
        </div>
      )
    }
  }
  else{
    return null
  }
}

Message.propTypes = {
  show: PropTypes.bool.isRequired
}

export default Message