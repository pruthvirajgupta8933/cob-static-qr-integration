import React from 'react'
import Table from '../../../../../_components/table_components/table/Table';
import CustomLoader from '../../../../../_components/loader';

function TransactionComponent(props) {
    return (
        <div className="card-body">
            <div className="scroll overflow-auto">
                <Table
                    {...props}
                />
                {/* {props?.data?.length === 0 && (
                    <h5 className="text-center font-weight-bold mt-5">No Data Found</h5>
                )} */}
                {/* {props?.data?.length !== 0 && (
                    <Table
                        {...props}
                    />
                )} */}
            </div>
            {/* <CustomLoader loadingState={props?.loadingState} /> */}
        </div>
    )
}

export default TransactionComponent