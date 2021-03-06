// @dev see details on https://www.npmjs.com/package/truffle-assertions
const truffleAssert = require('truffle-assertions');

const emitted = (tx, eventName, assertFunction) => {
    truffleAssert.eventEmitted(tx, eventName, event => {
        assertFunction(event);
        return true;
    });
};

const notEmitted = (tx, eventName, assertFunction) => {
    truffleAssert.eventNotEmitted(tx, eventName, event => {
        assertFunction(event);
        return true;
    });
}

module.exports = {
    erc20: {
        transfer: tx => {
            const name = 'Transfer';
            return {
                name: name,
                emitted: (from, to, value) => emitted(tx, name, ev => {
                    assert.equal(ev.from, from);
                    assert.equal(ev.to, to);
                    assert.equal(ev.value.toString(), value.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
    },
    lenders: {
        interestUpdateRequested: tx => {
            const name = 'InterestUpdateRequested';
            return {
                name: name,
                emitted: (lender, blockNumber) => emitted(tx, name, ev => {
                    assert.equal(ev.lender, lender);
                    assert.equal(ev.blockNumber.toString(), blockNumber.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            }
        },
        cancelInterestUpdate: tx => {
            const name = 'CancelInterestUpdate';
            return {
                name: name,
                emitted: (lender, blockNumber) => emitted(tx, name, ev => {
                    assert.equal(ev.lender, lender);
                    assert.equal(ev.blockNumber.toString(), blockNumber.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            }
        },
        accruedInterestUpdated: tx => {
            const name = 'AccruedInterestUpdated';
            return {
                name: name,
                emitted: (lender, lastBlockAccrued, totalAccruedInterest) => emitted(tx, name, ev => {
                    assert.equal(ev.lender, lender);
                    assert.equal(ev.lastBlockAccrued.toString(), lastBlockAccrued.toString());
                    assert.equal(ev.totalAccruedInterest.toString(), totalAccruedInterest.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
        accruedInterestWithdrawn: tx => {
            const name = 'AccruedInterestWithdrawn';
            return {
                name: name,
                emitted: (recipient, amount) => emitted(tx, name, ev => {
                    assert.equal(ev.recipient, recipient);
                    assert.equal(ev.amount.toString(), amount.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
    },
    lendingPool: {
        tokenDeposited: tx => {
            const name = 'TokenDeposited';
            return {
                name: name,
                emitted: (sender, amount) => emitted(tx, name, ev => {
                    assert.equal(ev.sender, sender);
                    assert.equal(ev.amount.toString(), amount.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
        tokenWithdrawn: tx => {
            const name = 'TokenWithdrawn';
            return {
                name: name,
                emitted: (sender, amount) => emitted(tx, name, ev => {
                    assert.equal(ev.sender, sender);
                    assert.equal(ev.amount.toString(), amount.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
        paymentLiquidated: tx => {
            const name = 'PaymentLiquidated';
            return {
                name: name,
                emitted: (liquidator, amount) => emitted(tx, name, ev => {
                    assert.equal(ev.liquidator, liquidator);
                    assert.equal(ev.amount.toString(), amount.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
        tokenRepaid: tx => {
            const name = 'TokenRepaid';
            return {
                name: name,
                emitted: (borrower, amount) => emitted(tx, name, ev => {
                    assert.equal(ev.borrower, borrower);
                    assert.equal(ev.amount.toString(), amount.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
    },
    loans: {
        loanCreated: tx => {
            const name = 'LoanCreated';
            return {
                name: name,
                emitted: (borrower, interestRate, collateralRatio, maxLoanAmount, numberDays, loanID) => emitted(tx, name, ev => {
                    assert.equal(ev.borrower, borrower);
                    assert.equal(ev.interestRate.toString(), interestRate.toString());
                    assert.equal(ev.collateralRatio.toString(), collateralRatio.toString());
                    assert.equal(ev.maxLoanAmount.toString(), maxLoanAmount.toString());
                    assert.equal(ev.numberDays.toString(), numberDays.toString());
                    assert.equal(ev.loanID.toString(), loanID.toString());
                }),
                notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
            };
        },
    },
    interestConsensus: {
      interestSubmitted: tx => {
          const name = 'InterestSubmitted';
          return {
              name: name,
              emitted: (signer, lender, blockNumber, interest) => emitted(tx, name, ev => {
                  assert.equal(ev.signer, signer);
                  assert.equal(ev.lender, lender);
                  assert.equal(ev.blockNumber.toString(), blockNumber.toString());
                  assert.equal(ev.interest.toString(), interest.toString());
              }),
              notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
          };
      },
      interestAccepted: tx => {
        const name = 'InterestAccepted';
        return {
            name: name,
            emitted: (lender, blockNumber, interest) => emitted(tx, name, ev => {
                assert.equal(ev.lender, lender);
                assert.equal(ev.blockNumber.toString(), blockNumber.toString());
                assert.equal(ev.interest.toString(), interest.toString());
            }),
            notEmitted: (assertFunction = () => {} ) => notEmitted(tx, name, assertFunction)
        };
    },
  },
};
