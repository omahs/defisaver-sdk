import Action from "../../Action";
import { getAssetInfo } from "@defisaver/tokens";
import {EthAddress,uint256} from '../../types';
import { getAddr } from '../../addresses.js';

/**
 * MakerPaybackAction - Payback dai to a Vault
 */
export default class MakerPaybackAction extends Action {
  /**
   * @param vaultId {VaultId}
   * @param amount {string}
   * @param from {EthAddress} DAI will be sent from this address
   * @param mcdManager {EthAddress}
   */
  constructor(vaultId:uint256, amount:uint256, from:EthAddress, mcdManager:EthAddress = getAddr('McdCdpManager')) {
    super('McdPayback', getAddr('McdPayback'), ['uint256','uint256','address','address'], [vaultId, amount, from, mcdManager]);
  }

  async getAssetsToApprove() {
    return [{asset: getAssetInfo('DAI').address, owner: this.args[2]}];
  }
}