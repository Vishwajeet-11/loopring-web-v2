import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { walletServices } from '../walletServices';
import { IpcProvider } from 'web3-core';
import { ErrorType } from '../command';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ConnectProviders } from '@loopring-web/common-resources';

export const MetaMaskProvide = async (): Promise<{ provider: IpcProvider, web3: Web3 } | undefined> => {
    try {
        const provider: any = await detectEthereumProvider();
        const ethereum: any = window.ethereum;
        if (provider && ethereum) {
            const web3 = new Web3(provider as any);
            await ethereum.request({method: 'eth_requestAccounts'});
            walletServices.sendConnect(web3, provider);
            return {provider, web3}
        } else {
            return undefined
        }

    } catch (error) {
        console.log('Error happen at connect wallet with MetaMask:', error)
        walletServices.sendError(ErrorType.FailedConnect, {connectName: ConnectProviders.MetaMask, error})
    }
}
export const MetaMaskSubscribe = (provider: any, web3: Web3) => {
    if (provider) {
        provider.on("accountsChanged", (accounts: Array<string>) => {
            // const _accounts = await web3.eth.getAccounts();
            console.log('accounts:', accounts)
            walletServices.sendConnect(web3, provider)
        });
        // @ts-ignore
        provider.on("chainChanged", (chainId: number) => {
            walletServices.sendChainChanged(chainId);
        });
        // @ts-ignore
        provider.on("disconnect", (code: number, reason: string) => {
            if (provider instanceof WalletConnectProvider) {
                const {connector} = provider as WalletConnectProvider;
                connector.killSession();
            }
            walletServices.sendDisconnect(code, reason);
            MetaMaskUnsubscribe(provider)
        });
    }
}

export const MetaMaskUnsubscribe = (provider: any) => {
    if (provider && typeof provider.removeAllListeners === 'function') {
        provider.removeAllListeners('accountsChanged');
        provider.removeAllListeners('chainChanged');
        provider.removeAllListeners('disconnect');
    }
}