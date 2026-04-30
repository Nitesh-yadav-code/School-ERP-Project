import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react'

export const Counters = () => {

    const [count, setCount] = useState(0);


     const handleDecrease= () =>{
      setCount((prev)=>(
        prev -1
      ))
    }

    const handleIncrease = ()=>{
      setCount(count+1)
    }


  return (
    <div>
        <h1>Counter is: {count}</h1>

        <Button onClick={handleIncrease}>Increase</Button>
        <Button onClick={handleDecrease}>Decrease</Button>
    </div>
  )
}
