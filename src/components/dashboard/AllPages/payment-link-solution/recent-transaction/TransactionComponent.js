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

            </div>

        </div>
    )
}

export default TransactionComponent