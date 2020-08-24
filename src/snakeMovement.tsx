import React, {useState,useEffect} from 'react'
import Board from './board'
import { setUncaughtExceptionCaptureCallback } from 'process'

enum snakeDirection{
    left = -1,
    right = 1,
    up = -1,
    down = 1
}

interface Velocity{
    xv: number;
    yv: number;
}

const SnakeMovement = () => {
    const[direction, setDirection] = useState<snakeDirection>(snakeDirection.right)
    const[tick, setTick] = useState<number>(0)
    const[velocity, setVelocity] = useState<Velocity>({xv: 0, yv: 0})

    useEffect(() => {keyboardListener()}, [])    
    
    const timer = window.setInterval(() => {
        setTick(prevState => prevState + 1)
    }, 1000);

    const keyboardListener = () => {
        document.addEventListener('keydown', onKeyDown); 
        return () => { document.removeEventListener('keydown', onKeyDown); window.clearInterval(timer); }
    }

    const onKeyDown = (event: KeyboardEvent) => {
        switch(event.keyCode){
            case 37:
            case 100:
                setDirection(snakeDirection.left)
                break
            case 38:
            case 104:
                setDirection(snakeDirection.up)
                break
            case 39:
            case 102:
                setDirection(snakeDirection.right)
                break
            case 40:
            case 98:
                setDirection(snakeDirection.down)
                break
        }
    }

    return <div> </div>
}

export default SnakeMovement;