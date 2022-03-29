import React from 'react';

function DisplayErrorMessage(props) {
    var {data} = props;
    // console.log(data);
    

  return (<div style={{display:data && data?.length>=0?"flex":"none"}} className="displayErrorMessage"><p>{data }</p></div>);
}

export default DisplayErrorMessage;
