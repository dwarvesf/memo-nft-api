import { publicActions, } from "viem";
/** Viem actions where the `block` property is optional and implicit. */
const blockDependentActions = [
    "getBalance",
    "call",
    "estimateGas",
    "getFeeHistory",
    "getProof",
    "getCode",
    "getStorageAt",
    "getEnsAddress",
    "getEnsAvatar",
    "getEnsName",
    "getEnsResolver",
    "getEnsText",
];
/** Viem actions where the `block` property is non-existent. */
const nonBlockDependentActions = [
    "getTransaction",
    "getTransactionReceipt",
    "getTransactionConfirmations",
];
export const getPonderActions = (getBlockNumber) => {
    return (client) => {
        const actions = {};
        const _publicActions = publicActions(client);
        const addAction = (action) => {
            // @ts-ignore
            actions[action] = ({ cache, blockNumber: userBlockNumber, ...args }) => 
            // @ts-ignore
            _publicActions[action]({
                ...args,
                ...(cache === "immutable"
                    ? { blockTag: "latest" }
                    : { blockNumber: userBlockNumber ?? getBlockNumber() }),
            });
        };
        for (const action of blockDependentActions) {
            addAction(action);
        }
        addAction("multicall");
        addAction("readContract");
        addAction("simulateContract");
        for (const action of nonBlockDependentActions) {
            // @ts-ignore
            actions[action] = _publicActions[action];
        }
        // required block actions
        for (const action of [
            "getBlock",
            "getBlockTransactionCount",
            "getTransactionCount",
        ]) {
            // @ts-ignore
            actions[action] = _publicActions[action];
        }
        return actions;
    };
};
//# sourceMappingURL=ponderActions.js.map