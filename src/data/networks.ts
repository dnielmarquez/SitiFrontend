import { NetworkData } from "../interfaces/NetworkData.interface";

export const networksData: Record<string, NetworkData> = {

    Goerli: {
        name: "Goerli",
        token: "ETH",
        chain_id: "0x5",
        rpc: "https://ethereum-goerli.publicnode.com"
    },
    Mumbai: {
        name: "Mumbai",
        token: "MATIC",
        chain_id: "0x13881",
        rpc: "https://polygon-mumbai-bor.publicnode.com"
    }
};