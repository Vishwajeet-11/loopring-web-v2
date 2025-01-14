import { CoinKey, CoinMap, StateBase } from "@loopring-web/common-resources";
import {
  LoopringMap,
  MarketInfo,
  TokenInfo,
  TokenRelatedInfo,
} from "@loopring-web/loopring-sdk";

export type TokenMap<R extends { [key: string]: any }> = LoopringMap<
  TokenInfo & { tradePairs: Array<CoinKey<R>> }
>;
export type GetTokenMapParams<R extends { [key: string]: any }> = {
  tokensMap: TokenMap<R>;
  marketMap: LoopringMap<MarketInfo>;
  pairs: LoopringMap<TokenRelatedInfo>;
  marketArr: string[];
  tokenArr: string[];
  disableWithdrawTokenList: any[];
};

export type AddressMap = {
  [key: string]: string;
};

export type IdMap = {
  [key: number]: string;
};

export type TokenMapStates<R extends { [key: string]: any }> = {
  coinMap: CoinMap<R>;
  totalCoinMap?: CoinMap<R> | undefined;
  marketArray: string[];
  marketCoins: string[];
  disableWithdrawList: string[];
  tokenMap: TokenMap<R>;
  marketMap: LoopringMap<MarketInfo>;
  addressIndex: AddressMap;
  idIndex: IdMap;
} & StateBase;
