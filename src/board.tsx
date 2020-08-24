import React, {useState, useEffect, ClassAttributes, HTMLAttributes} from 'react';


interface Coordinates {
  row: any;
  col: any;
}

const Board = () => {
  const [grid, setGrid] = useState<Coordinates[][]>()
  // const [snakeHead, setSnakeHead] = useState<Coordinates[{row: 5, col: 10}]>()
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
            return <div key={coords.row.toString() + '-' + coords.col.toString()} className='board-cell'> </div> 
            //Todo: Figure out how to use this
            //return <div key={${coords.row}-${coords.col}}> </div>
      })) 
  }

  return <div className='board-background'>{grid && drawGrid()}</div>
}

export default Board;

