import type { Prettify } from '../types/utils.js';
import { type Abi, type Account, type Address, type Chain, type Client, type ContractFunctionArgs, type ContractFunctionName, type GetBlockReturnType, type GetBlockTransactionCountReturnType, type GetTransactionCountReturnType, type Hash, type MulticallParameters, type MulticallReturnType, type PublicActions, type PublicRpcSchema, type ReadContractParameters, type ReadContractReturnType, type SimulateContractParameters, type SimulateContractReturnType, type Transport, publicActions } from "viem";
/** Viem actions where the `block` property is optional and implicit. */
declare const blockDependentActions: readonly ["getBalance", "call", "estimateGas", "getFeeHistory", "getProof", "getCode", "getStorageAt", "getEnsAddress", "getEnsAvatar", "getEnsName", "getEnsResolver", "getEnsText"];
/** Viem actions where the `block` property is non-existent. */
declare const nonBlockDependentActions: readonly ["getTransaction", "getTransactionReceipt", "getTransactionConfirmations"];
type BlockOptions = {
    cache?: undefined;
    blockNumber?: undefined;
} | {
    cache: "immutable";
    blockNumber?: undefined;
} | {
    cache?: undefined;
    blockNumber: bigint;
};
type RequiredBlockOptions = {
    /** Hash of the block. */
    blockHash: Hash;
    blockNumber?: undefined;
} | {
    blockHash?: undefined;
    /** The block number. */
    blockNumber: bigint;
};
type BlockDependentAction<fn extends (client: any, args: any) => unknown, params = Parameters<fn>[0], returnType = ReturnType<fn>> = (args: Omit<params, "blockTag" | "blockNumber"> & BlockOptions) => returnType;
export type PonderActions = {
    [action in (typeof blockDependentActions)[number]]: BlockDependentAction<ReturnType<typeof publicActions>[action]>;
} & {
    multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: Omit<MulticallParameters<contracts, allowFailure>, "blockTag" | "blockNumber"> & BlockOptions) => Promise<MulticallReturnType<contracts, allowFailure>>;
    readContract: <const abi extends Abi | readonly unknown[], functionName extends ContractFunctionName<abi, "pure" | "view">, const args extends ContractFunctionArgs<abi, "pure" | "view", functionName>>(args: Omit<ReadContractParameters<abi, functionName, args>, "blockTag" | "blockNumber"> & BlockOptions) => Promise<ReadContractReturnType<abi, functionName, args>>;
    simulateContract: <const abi extends Abi | readonly unknown[], functionName extends ContractFunctionName<abi, "nonpayable" | "payable">, const args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>>(args: Omit<SimulateContractParameters<abi, functionName, args>, "blockTag" | "blockNumber"> & BlockOptions) => Promise<SimulateContractReturnType<abi, functionName, args>>;
    getBlock: <includeTransactions extends boolean = false>(args: {
        /** Whether or not to include transaction data in the response. */
        includeTransactions?: includeTransactions | undefined;
    } & RequiredBlockOptions) => Promise<GetBlockReturnType<Chain | undefined, includeTransactions>>;
    getTransactionCount: (args: {
        /** The account address. */
        address: Address;
    } & RequiredBlockOptions) => Promise<GetTransactionCountReturnType>;
    getBlockTransactionCount: (args: RequiredBlockOptions) => Promise<GetBlockTransactionCountReturnType>;
} & Pick<PublicActions, (typeof nonBlockDependentActions)[number]>;
export type ReadOnlyClient<transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined> = Prettify<Omit<Client<transport, chain, undefined, PublicRpcSchema, PonderActions>, "extend" | "key" | "batch" | "cacheTime" | "account" | "type" | "uid" | "chain" | "name" | "pollingInterval" | "transport" | "ccipRead">>;
export declare const getPonderActions: (getBlockNumber: () => bigint) => <TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>(client: Client<TTransport, TChain, TAccount>) => PonderActions;
export {};
//# sourceMappingURL=ponderActions.d.ts.map