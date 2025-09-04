import { createTransform } from 'redux-persist';

const clientCodeTransform = createTransform(
    (inboundState, key) => {
        const listToPersist = Array.isArray(inboundState.clientCodeList)
            ? inboundState.clientCodeList
            : [];
        return {
            clientCodeList: listToPersist,
        };
    },
    (outboundState, key) => {
        const rehydratedList = Array.isArray(outboundState.clientCodeList)
            ? outboundState.clientCodeList
            : [];
        return {
            clientCodeList: rehydratedList,
        };
    },
    { whitelist: ['approverDashboard'] }
);

export default clientCodeTransform;