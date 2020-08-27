import React, {useState, useEffect} from 'react'

interface Coordinates {
  row: number
  col: number
}

interface Velocity{
  rowV: number
  colV: number
}

enum Direction{
  left,
  right,
  up,
  down
}

let gameWidth = 50
let gameHeight = 50

export const Board = () => {
  //set react state
  const [grid, setGrid] = useState<Coordinates[][]>()
  const [snakeHead, setSnakeHead] = useState<Coordinates>({row:5, col: 10})
  const [snakeTail, setSnakeTail] = useState<Coordinates[]>([{row:5, col:9},{row:5, col:8},{row:5, col:7}])
  const [food, setFood] = useState<Coordinates>({row:-1, col:-1})

  const[tick, setTick] = useState<number>(0)
  const[snakeVelocity, setSnakeVelocity] = useState<Velocity>({rowV: 0, colV: 0})
  const[lost, setLost] = useState<boolean>(false)
  const[pause, setPause] = useState<boolean>(false)
  const[reset, setReset] = useState<boolean>(false)
  const[score, setScore] = useState<number>(0)  
  const[snakeDirection, setSnakeDirection] = useState<Direction>(Direction.right)
  const[tickInterval, setTickInterval] = useState<number>(300)  
  const[pauseSnakeVelocity, setPauseSnakeVelocity] = useState<Velocity>({rowV: 0, colV: 0})

  useEffect(() => {
    if(reset){
      resetAll()
    }
    initGrid()
    placeFood()      
  }, [reset])  // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {    
    gameLogic()
    console.log(snakeDirection)
    if (!pause){
      moveSnake()
    }

    document.addEventListener('keydown', onKeyDown)
    const timer = window.setInterval(() => {
      setTick(prevState => prevState + 1)
    }, tickInterval)
    
    return () => { 
      document.removeEventListener('keydown', onKeyDown)
      window.clearInterval(timer) 
    }
  }, [tick])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if(tickInterval >= 100){
      setTickInterval(tickInterval - 50)
    }
  }, [food])  // eslint-disable-line react-hooks/exhaustive-deps

  const resetAll = () =>{
    setSnakeHead({row:5, col: 10}) 
    setSnakeTail([{row: 5, col: 9}, {row: 5, col: 8}, {row: 5, col: 7}]) 
    setTick(0)
    setSnakeVelocity({rowV: 0, colV: 0}) 
    setLost(false) 
    setPause(false)
    setReset(false)
    setScore(0)
    setSnakeDirection(Direction.right)
    setTickInterval(300)
    setPauseSnakeVelocity({rowV:0, colV: 0})
  }
    
//#region Board Setup
  const initGrid = () => {
    const grid = []
    for (let row = 0; row < gameHeight; row++) { 
      const cols = []
      for (let col = 0; col < gameWidth; col++) { 
        cols.push({row, col})
      } 
      grid.push(cols)
    } 
    setGrid(grid)
  }

  const drawGrid = () => { 
    return grid && grid.map(
        (row)=> row.map((coords) => { 
          return (
          <div 
          key={`${coords.row}-${coords.col}`}
            className={getObjectStyleInCell(coords.row, coords.col)}>                 
          </div> 
          )
    })) 
  }

  const getObjectStyleInCell = (row: number, col: number): string => {   
    //Find snake head location
    if (isObjectInCell(snakeHead, row, col)){
      return 'snake-head'
    }    

    //Find food location
    if (isObjectInCell(food, row, col)){
      return 'food'
    }

    //Find snake tail location
    //todo: make if (snakeTail.includes) work   
    if (snakeTail.find((tail) => {return isObjectInCell(tail, row, col)})){
      return 'snake-tail'
    }

    return 'cell'
  }

  const isObjectInCell = (coordinate: Coordinates, row: number, col: number): boolean => {
    return coordinate.row === row && coordinate.col === col
  }

  const placeFood = () => {
    setFood({row: Math.floor(Math.random() * gameWidth), col: Math.floor(Math.random() * gameHeight)}) 
  }  
//#endregion 

//#region Snake Movement
  const onKeyDown = (event: KeyboardEvent) => {
    if(pause){
      return
    }
    //Handle key press when snake is not paused
    switch(event.keyCode){
      case 37:
      case 100:
        //left: do not invert direction and go right to left
        if(snakeDirection !== Direction.right){
          setSnakeVelocity({rowV:0, colV: -1})
          setSnakeDirection(Direction.left)
        }          
        break
      case 38:
      case 104:
        //up: do not invert direction and go down to up
        if(snakeDirection !== Direction.down){
          setSnakeVelocity({rowV: -1, colV: 0})
          setSnakeDirection(Direction.up)
        }
        break
      case 39:
      case 102:
        //right: do not invert direction and go left to right
        if(snakeDirection !== Direction.left){
          setSnakeVelocity({rowV: 0, colV: 1})
          setSnakeDirection(Direction.right)
        }
        break
      case 40:
      case 98:
        //down: do not invert direction and go up from down
        if(snakeDirection !== Direction.up){
          setSnakeVelocity({rowV: 1, colV: 0})
          setSnakeDirection(Direction.down)
        }
        break
    }
  }

  const isOnFirstTail = (i: number): boolean => {
    return i === 0
  }

  const isOnLastTail = (i: number): boolean => {
    return i === snakeTail.length -1
  }

  const isFoodEaten = (): boolean => {
    return snakeHead.row === food.row && snakeHead.col === food.col
  }  

  const isWallHit = () => {
    return snakeHead.row < 0 || snakeHead.col < 0 || snakeHead.row > gameHeight || snakeHead.col > gameWidth
  }

  const isTailHit = () => {
    return snakeTail.find((tail) => {return isObjectInCell(tail, snakeHead.row, snakeHead.col)})
  }

  const moveSnake = () => {
    if (snakeVelocity.rowV !== 0 || snakeVelocity.colV !== 0){
      //Move the tail following the head
      let newTail: Coordinates[] = []
      for (let i = 0; i < snakeTail.length; i++){
        if (isOnFirstTail(i)){  //First tail need to add snakeHead first
          newTail.push({row:snakeHead.row, col:snakeHead.col})
          newTail.push(snakeTail[i])
        }
        else if (isOnLastTail(i)){  //Last tail only need to be added when food was eaten
          if (isFoodEaten()){
            newTail.push(snakeTail[i])
          }
        }
        else{
          newTail.push(snakeTail[i])
        }
      }
      setSnakeTail(newTail)

      //Move the head according to velocity
      let headCoord: Coordinates = snakeHead
      headCoord.col += snakeVelocity.colV
      headCoord.row += snakeVelocity.rowV
      setSnakeHead(headCoord)
    }
  }

  const gameLogic = () => {
    if (isFoodEaten()){     
      placeFood()
      setScore(score + 100)
    }
    else if (isWallHit()){
      console.log('You hit the wall')
      setLost(true)
    }
    else if (isTailHit()){
      console.log('You hit the tail')
      setLost(true)
    }
    else if (pause){
      setSnakeVelocity({rowV: 0, colV: 0})
    }
  }
//#endregion

//#region  Board Display
  const drawSnakeBoard = () => {
    return (
      <div className='snake-board-background'>
        { lost === false ? grid && drawGrid() : drawLost()}
      </div>
    )  
  }

  const drawLost = () => {
    return <div className='board-lost'>Game Lost</div>
  }

  const drawScoreBoard = () => {
    return (
      <div className='score-board'>{`Score: ${score}`}</div>
    )
  }

  //Pause will retain the snake velocity. Unpause will continue snake's path as before pause
  const pauseClicked = () => {
    if(snakeVelocity.rowV === 0 && snakeVelocity.colV === 0){
      if(!pause){
        return  //This is game start. Shouldn't enable pause here
      } 
      setSnakeVelocity({rowV: pauseSnakeVelocity.rowV, colV: pauseSnakeVelocity.colV})
    }
    else{
      setPauseSnakeVelocity({rowV: snakeVelocity.rowV, colV: snakeVelocity.colV})
    }
    setPause(!pause)
  }

  const drawButtons = () => {
    return (
      <div className='button-board'>
        <button className='button' onClick={() => pauseClicked() }>
          Pause
        </button>
        <button className='button' onClick={() => setReset(true)}>
          Reset
        </button>
      </div>
    )
  }
//#endregion
 
  return (    
    <div className='game-board'>
      {drawScoreBoard()} 
      {drawSnakeBoard()}
      {drawButtons()}
    </div>
  )  
}
export default Board

