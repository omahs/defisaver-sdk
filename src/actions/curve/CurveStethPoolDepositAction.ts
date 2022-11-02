import Action from '../../Action';
import { requireAddress } from '../../utils/general';
import { getAddr } from '../../addresses.js';
import {EthAddress,uint256} from '../../types';

/**
 * CurveStethPoolDepositAction - Deposits tokens into curve steth pool
 */
export default class CurveStethPoolDepositAction extends Action {
    /**
     * @param from {address}
     * @param to {address}
     * @param amounts {string[]}
     * @param minMintAmount {string}
     */
    constructor(
        from:EthAddress,
        to:EthAddress,
        amounts:uint256[2],
        minMintAmount:uint256,
    ) {
        requireAddress(to);

        super(
            'CurveStethPoolDeposit',
            getAddr('CurveStethPoolDeposit'),
            ['address', 'address', 'uint256[2]', 'uint256'],
            [...arguments],
        );

        this.mappableArgs = [
            this.args[0],
            this.args[1],
            this.args[2][0],
            this.args[2][1],
            this.args[3],
        ];
    }
}