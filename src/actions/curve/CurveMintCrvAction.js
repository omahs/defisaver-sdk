const Action = require('@defisaver/sdk/src/Action');
const { requireAddress } = require('@defisaver/sdk/src/utils/general');
const { getAddr } = require('@defisaver/sdk/src/addresses');

class CurveMintCrvAction extends Action {
    
    constructor(gaugeAddr, receiver) {
        requireAddress(receiver);
        super('CurveMintCrv',
            getAddr('CurveMintCrv'),
            [['address', 'address']],
            [[...arguments]],
        );

        this.mappableArgs = [
            this.args[0][1],
        ];
    }
}

module.exports = CurveMintCrvAction;