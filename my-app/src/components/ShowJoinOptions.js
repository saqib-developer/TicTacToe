import React from 'react'
import './ShowJoinOptions.css'

export default function ShowJoinOptions(props) {
    return (
        <div className="join-options-container">
            <form className='join-options' onSubmit={props.saveData}>
                <h3>{props.purpose} Room</h3>
                <div className='id-container'>
                    <span>ID :  </span> <input id='idOfGame' spellCheck={false} minLength={4} maxLength={15} type="text" required />
                </div>
                <div className='button-container'>
                    <button type='submit'>OK</button>
                    <button onClick={() => { props.setShowJoinOptions(false) }}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
