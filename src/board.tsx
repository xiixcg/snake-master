import React, {useState, useEffect} from 'react';

interface Coordinates {
  row: number;
  col: number;
}

const Board = () => {
  //set react state
  const [grid, setGrid] = useState<Coordinates[][]>()
  const [snakeHead, setSnakeHead] = useState<Coordinates>({row:5, col:10})
  const [snakeTail, setSnakeTail] = useState<Coordinates[]>([{row:5, col:9},{row:5, col:8},{row:5, col:7}])
  const [food, setFood] = useState<Coordinates>({row:-1, col:-1})
  
  useEffect(() => {initGrid()}, [])
  useEffect(() => {placeFood()}, [])
    
  const initGrid = () => {
    const grid = []; 
    for (let row = 0; row < 50; row++) { 
      const cols = []; 
      for (let col = 0; col < 50; col++) { 
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
      console.log("Food")
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
    setFood({row: Math.floor(Math.random() * 50), col: Math.floor(Math.random() * 50)}) 
  }

  return <div className='board-background'>{grid && drawGrid()}</div>
}

export default Board;

