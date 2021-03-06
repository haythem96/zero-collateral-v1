// JS Libraries
const withData = require('leche').withData;
const { t, NULL_ADDRESS } = require('../utils/consts');

// Mock contracts
const Mock = artifacts.require("./mock/util/Mock.sol");

// Smart contracts
const LendingPool = artifacts.require("./base/LendingPool.sol");

contract('LendingPoolInitializeTest', function (accounts) {
    let zTokenInstance;
    let daiInstance;
    let lendersInstance;
    let loansInstance;
    
    beforeEach('Setup for each test', async () => {
        zTokenInstance = await Mock.new();
        daiInstance = await Mock.new();
        lendersInstance = await Mock.new();
        loansInstance = await Mock.new();
    });

    withData({
        _1_basic: [true, true, true, true, undefined, false],
        _2_notZdai: [false, true, true, true, 'zToken address is required.', true],
        _3_notDai: [true, false, true, true, 'Token address is required.', true],
        _4_notLenderInfo: [true, true, false, true, 'Lenders address is required.', true],
        _5_notLoanInfo: [true, true, true, false, 'Loans address is required.', true],
        _5_notZdai_notLoanInfo: [false, true, true, false, 'zToken address is required.', true],
        _6_notDai_notLenderInfo: [true, false, false, true, 'Token address is required.', true],
    }, function(
        createZdai,
        createDai,
        createLenderInfo,
        createLoanInfo,
        expectedErrorMessage,
        mustFail
    ) {    
        it(t('user', 'initialize', 'Should (or not) be able to create a new instance.', mustFail), async function() {
            // Setup
            const lendingPoolInstance = await LendingPool.new();
            const zTokenAddress = createZdai ? zTokenInstance.address : NULL_ADDRESS;
            const daiAddress = createDai ? daiInstance.address : NULL_ADDRESS;
            const lendersAddress = createLenderInfo ? lendersInstance.address : NULL_ADDRESS;
            const loanInfoAddress = createLoanInfo ? loansInstance.address : NULL_ADDRESS;

            try {
                // Invocation
                const result = await lendingPoolInstance.initialize(
                    zTokenAddress,
                    daiAddress,
                    lendersAddress,
                    loanInfoAddress,
                );;
                
                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedErrorMessage);
            }
        });
    });
});