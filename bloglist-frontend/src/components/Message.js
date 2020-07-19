import React from 'react'

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

export default Message