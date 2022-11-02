import ActionWithL2 from "../../ActionWithL2";
import { getAddr } from '../../addresses.js';
import {EthAddress} from '../../types';
/**
 * AaveV3SetEModeAction - Set EMode for the proxy AaveV3 position
 */
export default class AaveV3SetEModeAction extends ActionWithL2 {
  /**
   * @param categoryId {EthAddress} ID of the category emode
   * @param useOnDefaultMarket {boolean} If this is true it defaults to the hardcoded market in contract
   * @param market {EthAddress} Address provider for specific market
   */
  constructor(useOnDefaultMarket:boolean, market:EthAddress,categoryId: EthAddress) {
    super('AaveV3SetEMode', getAddr('AaveV3SetEMode'),
    ['uint8', 'bool', 'address'],
    [categoryId, useOnDefaultMarket, market]
    );

    this.mappableArgs = [
      this.args[2],
    ];
  }
  encodeInputs() {
    // executeActionDirectL2
    let encodedInput = "0x2895f3aa";
    // categoryId
    encodedInput = encodedInput.concat(this.numberToBytes1(this.args[0]));
    // useOnDefaultMarket
    encodedInput = encodedInput.concat(this.boolToBytes1(this.args[1]));
    if (!this.args[1]){
      // market
      encodedInput = encodedInput.concat(this.addressToBytes20(this.args[2]));
    }

    return encodedInput;
  }

}