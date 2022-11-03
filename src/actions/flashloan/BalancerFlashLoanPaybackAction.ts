import {SendTokenAction} from "../basic/SendTokenAction";
import { getAddr } from '../../addresses.js';
import {EthAddress,uint256} from '../../types';

/**
 * Pays back a flashloan from Balancer
 * 
 * @category Flashloans
 */
export class BalancerFlashLoanPaybackAction extends SendTokenAction {
   /**
   * @param loanAmount
   * @param tokenAddr
   */
    constructor(loanAmount:uint256, tokenAddr:EthAddress) {
      super(tokenAddr, getAddr('FLBalancer'), loanAmount);
    }
}