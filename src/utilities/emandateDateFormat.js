export const ArrayToDate = (data) =>{
    // var data = [2022, 2, 11, 11, 16, 41];
    var dt = '';
    typeof data !== "undefined" ?
    data.filter((d,i)=>{
        
        if(d.toString().length===1){
            d = "0"+d;
        }
        // console.log(d);

        if(i<=2)
        {
            if(i===2){
                dt += d;
            }else{
                dt += d+'-';
            }
        }
        else
        {
            if(i===3){
                dt += 'T';
            }
            if(i===5){
                dt += d+'.226';
            }else{
                dt += d+':';
            }
            
        }
        return dt;
    }):
    dt = null
    return dt;
}