// Smart contracts
const LoansInterface = artifacts.require("./interfaces/LoansInterface.sol");
const LendingPoolInterface = artifacts.require("./interfaces/LendingPoolInterface.sol");
const ERC20 = artifacts.require("openzeppelin-solidity/contracts/token/ERC20/IERC20.sol");

// Util classes
const BigNumber = require('bignumber.js');
const assert = require('assert');
const { hashLoan, signHash } = require('../test/utils/hashes');
const ProcessArgs = require('./utils/ProcessArgs');
const processArgs = new ProcessArgs();

/** Process parameters: */
const interestRate = 200; // 200 -> 2.00%
const collateralRatio = 1000;   // 1000 -> 10.00%
const borrowerIndex = 0;
const signerIndex = 0;
const maxLoanAmount = 5;
const numberDays = 10;
const signerNonce = 0;
const takeOutLoanValue = 1;

module.exports = async (callback) => {
    try {
        const network = processArgs.network();
        console.log(`Script will be executed in network ${network}.`)
        const appConf = require('../config')(network);
        const { zerocollateral, tokens, toTxUrl } = appConf.networkConfig;

        assert(zerocollateral.Loans, "Loans address is undefined.");
        assert(tokens.DAI, "DAI address is undefined.");

        const daiInstance = await ERC20.at(tokens.DAI);
        const loansInstance = await LoansInterface.at(zerocollateral.Loans);
        const lendingPoolInstance = await LendingPoolInterface.at(zerocollateral.LendingPool);

        const lendingPoolDaiBalance = await daiInstance.balanceOf(lendingPoolInstance.address);
        assert(BigNumber(lendingPoolDaiBalance.toString()).gte(maxLoanAmount.toString()), "LendingPool: Not enough DAI balance.");

        const accounts = await web3.eth.getAccounts();
        assert(accounts, "Accounts must be defined.");
        const borrower = accounts[borrowerIndex];
        assert(borrower, "Borrower must be defined.");
        const signer = accounts[signerIndex];
        assert(signer, "Signer must be defined.");

        const hashedLoan = hashLoan({
            interestRate,
            collateralRatio,
            borrower,
            maxLoanAmount,
            numberDays,
            signerNonce,
        });
        
        const signature = await signHash(web3, signer, hashedLoan);

        const result = await loansInstance.takeOutLoan(
            interestRate,
            collateralRatio,
            maxLoanAmount,
            numberDays,
            maxLoanAmount,
            {
              signerNonce,
              v: signature.v,
              r: signature.r,
              s: signature.s
            },
            {
              from: borrower,
              value: takeOutLoanValue,
            }
        );
        console.log(toTxUrl(result));

        console.log('>>>> The script finished successfully. <<<<');
        callback();
    } catch (error) {
        console.log(error);
        callback(error);
    }
};