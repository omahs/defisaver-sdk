import Action from "../../Action";
import { getAddr } from "../../addresses.js";
import {EthAddress,uint256,bytes,bytes32,uint64} from '../../types';

/**
 * Action for updating sub data
 */
export default class UpdateSubAction extends Action {
  /**
   * @param subId id of the subscription in the SubStorage contract
   * @param sub object that contains new sub information
   */
  constructor(subId:uint256, sub:[uint64,boolean,bytes[],bytes32[]]) {
    super("UpdateSub", getAddr("UpdateSub"), ["uint256", "(uint64,bool,bytes[],bytes32[])"], [...arguments]);

  }

}