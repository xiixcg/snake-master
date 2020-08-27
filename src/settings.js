import React, { useState } from 'react'
import Popup from 'reactjs-popup'

export const PopupWindow = (gameSize) => {
    const [gameBoardSize, setGameBoardSize] = useState(gameSize)

    const SizelistItem = (size) => {
        return (
            <label>
                <input
                type='radio'
                value={size}
                checked={gameBoardSize === parseInt(size)}
                onChange={onRadioChange}
                />
                <span>{SizelistText(size)} {size}x{size}</span>
            </label>
        )
    }
    
    const SizelistText = (size) => {
        switch(size){
            case '10':
                return 'Small'
            case '15':
            default:
                return 'Medium'
            case '25':
                return 'Large'
            case '50':
                return 'XLarge'
        }
    }
    
    const onRadioChange = (e) => {
        console.log(e.target.value)
        setGameBoardSize(parseInt(e.target.value))
    }

    return ([
        <Popup  trigger={<button className="button"> Settings </button>}
        position="top center"
        closeOnDocumentClick>
            <strong>Game Size:</strong>
            <ul className='setting-lists'>
                <li>
                    {SizelistItem('10')}
                </li>

                <li>
                    {SizelistItem('15')}
                </li>      

                <li>
                    {SizelistItem('25')}
                </li>  

                <li>
                    {SizelistItem('50')}
                </li>                          
            </ul>
        </Popup>
        , gameBoardSize]
    )
}

export default PopupWindow