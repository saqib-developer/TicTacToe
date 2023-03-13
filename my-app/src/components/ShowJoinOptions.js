import React from 'react'
import './ShowJoinOptions.css'

export default function ShowJoinOptions(props) {
    return (
        <div className="join-options-container">
            <form className='join-options'>
                <h3>Create Room</h3>
                <div className='name-container'>
                    <span>Name: </span> <input type="text" required />
                </div>
                <div className='password-container'>
                    <span>Password: </span> <input type="password" required />
                </div>
                <div className='button-container'>
                    <button type='submit'>OK</button>
                    <button onClick={() => { props.setShowJoinOptions(false) }}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
