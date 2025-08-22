import React, { useState } from "react";

const Test=()=>{
    const [selectValue,setSelectValue]=useState('');
    console.log("selectValue",selectValue,selectValue?.length);
    return <div style={{display:'flex',justifyContent:'center',padding:'10px',backgroundColor:'green'}}>
        <select
        value={selectValue}
        onChange={(e)=>   setSelectValue(e.target.value)}
        >
            <option value={'one'}>1</option>
            <option value={'two'}>2</option>
            <option value={'three'}>3</option>
            <option value={'four'}>4</option>
        </select>
    </div>
}
export default Test;