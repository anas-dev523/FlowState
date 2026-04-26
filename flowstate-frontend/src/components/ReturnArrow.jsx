
function ReturnArrow({onClick}){
    return(
          <div  onClick={onClick} style={{
            width: 36, height: 36, borderRadius: 12,
            background: "#F0F0EC",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>  
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A18" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </div>);
        }
export default ReturnArrow;

     
        