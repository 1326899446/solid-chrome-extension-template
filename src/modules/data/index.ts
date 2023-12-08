import { setGlobal } from './global';
import { initData } from './init';

fetch("constants.json")
  .then((response) => response.text())
  .then((data) => {
    const constants = JSON.parse(data)
    console.log("constants",constants);
    Object.keys(constants.initedGlobal).forEach((key)=>{
        setGlobal(key,constants.initedGlobal[key])
    })
    
    initData(constants);
  })
  .catch((error) => console.error("Error:", error));
