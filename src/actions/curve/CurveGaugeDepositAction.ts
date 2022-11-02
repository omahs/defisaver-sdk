import Action from '../../Action';
import { requireAddress } from '../../utils/general';
import { getAddr } from '../../addresses';
import {EthAddress,uint256} from '../../types';

export default class CurveGaugeDepositAction extends Action {

    /**
     *
     * @param {EthAddress} gaugeAddr
     * @param {EthAddress} lpToken
     * @param {EthAddress} sender
     * @param {EthAddress} onBehalfOf
     * @param {string} amount
     */
    constructor(gaugeAddr:EthAddress, lpToken:EthAddress, sender:EthAddress, onBehalfOf:EthAddress, amount:uint256) {
        requireAddress(sender);
        requireAddress(onBehalfOf);
        super('CurveGaugeDeposit',
            getAddr('CurveGaugeDeposit'),
            ['address', 'address', 'address', 'address', 'uint256'],
            [...arguments],
        );

        this.mappableArgs = [
            this.args[2],
            this.args[3],
            this.args[4],
        ];
    }

    async getAssetsToApprove() {
        return [{ asset: this.args[1], owner: this.args[2] }];
    }
}