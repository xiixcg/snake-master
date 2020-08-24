import React, {useState, useEffect} from 'react';

interface Coordinates {
  row: number;
  col: number;
}

const Board = () => {
  const [grid, setGrid] = useState<Coordinates[][]>()
  const [snakeHead, setSnakeHead] = useState<Coordinates>({row:5, col:10})
  const [snakeTail, setSnakeTail] = useState<Coordinates[]>([{row:5, col:9},{row:5, col:8},{row:5, col:7}])
  useEffect(() => {initGrid()}, [])
    
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
    //Find Snake head location
    if (snakeHead.row === row && snakeHead.col === col){
      return 'snake-head'
    }    

    //Find snake tail location
    //todo: make if (snakeTail.includes) work
    for(let i = 0; i < snakeTail.length; i++){
      if (snakeTail[i].row === row && snakeTail[i].col === col){
        return 'snake-tail'
      }
    }  

    return 'cell'
  }

  return <div className='board-background'>{grid && drawGrid()}</div>
}

export default Board;

