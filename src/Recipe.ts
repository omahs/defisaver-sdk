import AbiCoder from 'web3-eth-abi';
const { BN } = require('web3-utils');
const {getAssetInfo, utils: {compare}} = require("@defisaver/tokens");
import Action from './Action';
import { getAddr } from './addresses';
import RecipeAbi from './abis/Recipe.json';
import { AccessLists,AccessListItem  } from './types';
import { CONFIG } from './config';

/**
 * Set of Actions to be performed sequentially in a single transaction
 */
export default class Recipe {
  
  name: string;
  actions: Array<Action>;
  recipeExecutorAddress: string;

  /**
   * @param name {string}
   * @param actions {Array<Action>}
   */
  constructor(name: string, actions: Array<Action> = []) {
    actions.forEach((action: Action) => {
      if (!(action instanceof Action)) throw new TypeError('Supplied action does not inherit Action');
    });

    this.name = name;
    this.actions = actions;

    this.recipeExecutorAddress = getAddr('RecipeExecutor',CONFIG.chainId);
  }

  /**
   * @param action {Action}
   * @returns {Recipe}
   */
  addAction(action: Action) : Recipe {
    if (!(action instanceof Action)) throw new TypeError('Supplied action does not inherit Action');
    this.actions.push(action);
    return this;
  }

  /**
   * Encode arguments for calling the action set directly
   * @returns {Array<string|Array<*>>}
   * @private
   */
  _encodeForCall(): Array<string|Array<any>> {
    const encoded = this.actions.map(action => action.encodeForRecipe());
    const transposed = encoded[0].map((_, colIndex) => encoded.map(row => row[colIndex]));
    const taskStruct = [
      this.name,
      ...transposed,
    ];
    return [taskStruct];
  }

  /**
   * Encode arguments for calling the action set via DsProxy
   * @returns {Array<string>} `address` & `data` to be passed on to DSProxy's `execute(address _target, bytes memory _data)`
   */
  encodeForDsProxyCall() : Array<string> {
    const executeTaskAbi : any = RecipeAbi.find(({name}:{name: string}) => name === 'executeRecipe');
    const encoded = this._encodeForCall();
    if ((typeof(encoded) !== 'string')) throw new TypeError('Encoded not string');
    return [
      this.recipeExecutorAddress,
      AbiCoder.encodeFunctionCall(executeTaskAbi, encoded),
    ];
  }

  /**
   * Logs parameter mapping in verbose format for validation. Used for testing in development.
   */
  _validateParamMappings() {
    this.actions.forEach((action : Action, i : number) => {
      action._getArgumentMapping().forEach((source, j) => {
        if (source) console.log(`${this.actions[i].name} takes argument #${j + 1} from ${this.actions[source - 1].name} (action #${source})`);
      })
    });
  }

  /**
   * Assets requiring approval to be used by DsProxy
   * Approval is done from owner to DsProxy
   * @returns {Promise<Array<{owner: string, asset: string}>>}
   */
  async getAssetsToApprove() : Promise<Array<{owner: string, asset: string}>> {
    const uniqueAssetOwnerPairs : Array<{owner: string, asset: string,[key: string]:any}> = [];
    const assetOwnerPairs = await Promise.all(this.actions.map(a => a.getAssetsToApprove()));
    for (const pairsPerAction of assetOwnerPairs) {
      for (const pair of pairsPerAction) {
        const isNft = !pair.asset;
        if (!uniqueAssetOwnerPairs.find(_pair => _pair.owner === pair.owner && (isNft ? _pair.tokenId === pair.tokenId : _pair.asset === pair.asset))) {
          uniqueAssetOwnerPairs.push({owner:pair.owner!,asset:pair.asset!});
        }
      }
    }
    return uniqueAssetOwnerPairs.filter(({ address }) => !compare(address, getAssetInfo('ETH').address));
  }

  /**
   * ETH value to be sent with transaction
   * @returns {Promise<string>} ETH value in wei
   */
  async getEthValue():Promise<string> {
    return (await Promise.all(this.actions.map(a => a.getEthValue())))
      .reduce((acc, val) => acc.add(new BN(val)), new BN(0))
      .toString();
  }

  /**
   * Generates an access list for the recipe
   * @returns {AccessList}
   */
  getAccessList(): Array<AccessListItem> {
    const addressMapping : any = {
      [getAddr('RecipeExecutor',CONFIG.chainId)]: [],
      [getAddr('DFSRegistry',CONFIG.chainId)]: [],
    };
    this.actions.forEach((action) => {
      const accessList = action.getAccessList();
      accessList.forEach(({ address, storageKeys }:{address: string,storageKeys: Array<string>}) => {
        addressMapping[address] = new Set([...storageKeys, ...(addressMapping[address] || [])]);
      })
    });
    return Object.keys(addressMapping).map((address) => ({
      address,
      storageKeys: [...addressMapping[address]],
    }));
  }
}