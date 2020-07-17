import React, {useState, useImperativeHandle} from 'react';

const Toggleable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const showWhenVisible = { display: visible ? '' : 'none' }
    const hideWhenVisible = { display: visible ? 'none' : '' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, ()=> {
        return {
           toggleVisibility
        }
    })

    return(
        <div>
            <div style={hideWhenVisible} >
                <button  onClick={toggleVisibility} className='Margined-element'>
                    {props.buttonLabel}
                </button>
            </div>
            <div style={showWhenVisible} >
                {props.children}
                <button onClick={toggleVisibility} className='Margined-element' >
                    hide {props.buttonLabel}
                </button>
            </div>
        </div>
    )
})

export default Toggleable