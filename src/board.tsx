import React, {useState, useEffect} from 'react';

interface Coordinates {
  row: number;
  col: number;
}

interface Velocity{
  rowV: number;
  colV: number;
}

enum snakeDirection{
  left = -1,
  right = 1,
  up = -1,
  down = 1,
  stop = 0
}

let gameWidth = 50
let gameHeight = 50

export const Board = () => {
  //set react state
  const [grid, setGrid] = useState<Coordinates[][]>()
  const [snakeHead, setSnakeHead] = useState<Coordinates>({row:5, col:10})
  const [snakeTail, setSnakeTail] = useState<Coordinates[]>([{row:5, col:9},{row:5, col:8},{row:5, col:7}])
  const [food, setFood] = useState<Coordinates>({row:-1, col:-1})

  const[tick, setTick] = useState<number>(0)
  const[snakeVelocity, setSnakeVelocity] = useState<Velocity>({rowV: 0, colV: 0})
  const[direction, setDirection] = useState<snakeDirection>(snakeDirection.right)

  

  useEffect(() => {
    initGrid()
    placeFood()   

    const timer = window.setInterval(() => {
      setTick(prevState => prevState + 1)
    }, 250);

    document.addEventListener('keydown', onKeyDown); 
      
    return () => { 
      document.removeEventListener('keydown', onKeyDown); 
      window.clearInterval(timer); 
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    moveSnake()
    gameLogic()
  }, [tick])  
    
  const initGrid = () => {
    const grid = []; 
    for (let row = 0; row < gameHeight; row++) { 
      const cols = []; 
      for (let col = 0; col < gameWidth; col++) { 
        cols.push({row, col}); 
      } 
      grid.push(cols); 
    } 
    setGrid(grid); 
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

  const onKeyDown = (event: KeyboardEvent) => {
    switch(event.keyCode){
        case 37:
        case 100:
          //left: do not invert direction and go right to left
          if(snakeVelocity.colV !== 1){
            setSnakeVelocity({rowV:0, colV: -1})
          }
          break
        case 38:
        case 104:
          //up: do not invert direction and go down to up
          if(snakeVelocity.rowV !== 1){
            setSnakeVelocity({rowV: -1, colV: 0})
          }
          break
        case 39:
        case 102:
          //right: do not invert direction and go left to right
          if(snakeVelocity.colV !== -1){
            setSnakeVelocity({rowV: 0, colV: 1})
          }
          break
        case 40:
        case 98:
          //down: do not invert direction and go up from down
          if(snakeVelocity.rowV !== -1){
            setSnakeVelocity({rowV: 1, colV: 0})
          }
          break
    }
  }

  const moveSnake = () => {
    if (snakeVelocity.rowV !== 0 || snakeVelocity.colV !== 0){
      //Move the tail following the head
      let newTail: Coordinates[] = []
      for (let i = 0; i < snakeTail.length; i++){
        if (isOnFirstTail(i)){
          newTail.push({row:snakeHead.row, col:snakeHead.col})
          newTail.push(snakeTail[i])
        }
        else if (isOnLastTail(i)){  //Last tail only need to be added when food was eaten
          if (isFoodEaten()){
            newTail.push(snakeTail[i])
            placeFood()
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

  const isOnFirstTail = (i: number): boolean => {
    return i === 0
  }

  const isOnLastTail = (i: number): boolean => {
    return i === snakeTail.length -1
  }

  const isFoodEaten = (): boolean => {
    return snakeHead.row === food.row && snakeHead.col === food.col
  }  

  const gameLogic = () => {
    if (isFoodEaten()){
      // placeFood()
    }
    else if (isWallHit()){
      console.log('You hit the wall')
    }
    else if (isTailHit()){
      console.log('You hit the tail')
    }
  }

  const isWallHit = () => {
    return snakeHead.row < 0 || snakeHead.col < 0 || snakeHead.row > gameHeight || snakeHead.col > gameWidth
  }

  const isTailHit = () => {
    return snakeTail.find((tail) => {return isObjectInCell(tail, snakeHead.row, snakeHead.col)})
  }
 
  return <div className='board-background'>{grid && drawGrid()}</div>
}

export default Board;

