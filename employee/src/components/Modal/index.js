import React from "react";
import { MdClose } from "react-icons/md";
function Modal({children, visible , setModal}) {
    const handleClose = (e)=>{
        if(e.target.id === 'wrapper') setModal(false)
    }
    if(visible)
        return ( 
            <div id="wrapper" onClick={handleClose} style={{width:'100%', height:'100%', zIndex:100, position:'fixed', top:0, left:0,backgroundColor:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center'}}>
                <div style={{position:'relative'}}>
                    <MdClose color="black" onClick={()=>setModal(false)}  fontSize={24}  style={{position:'absolute', top:13, right:13, cursor:'pointer', }}/>
                    {children}
                </div>
            </div>
        );
    else return (<></>);
}

export default Modal;