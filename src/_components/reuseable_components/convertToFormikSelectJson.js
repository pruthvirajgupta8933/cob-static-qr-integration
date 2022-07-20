export const convertToFormikSelectJson = (key, value, dataObject) =>{
    const tempArr = [];
    dataObject.map(item=>{
    tempArr.push({key:item.id,value:item.name.toUpperCase()})
    })
    return tempArr
}