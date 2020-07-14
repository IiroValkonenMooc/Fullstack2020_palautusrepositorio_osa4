import React from 'react'

const Message = ({show, message, red}) => {
    if(show){
        return(
            <div>
                <p>{message}</p>
            </div>
        )
    }
    else{
        return null
    }    
}

export default Message