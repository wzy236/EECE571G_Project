const { expect } = require("chai");
const { ethers } = require("hardhat");


const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("TrustableFund Contract", function () {
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const TrustableFundTestCase = await ethers.deployContract("TrustableFund");

    await TrustableFundTestCase.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { TrustableFundTestCase, owner, addr1, addr2 };
  }


  describe("Create a fundraise", function () {
    it("Should successfully publish a fundraise", async function () {
      const {TrustableFundTestCase, owner} = await loadFixture(
        deployTokenFixture
      );
      
      const initialFundCount = (await TrustableFundTestCase.getFundList())[0].length;
      const initialFundHistroyLength = (await TrustableFundTestCase.getFundraiseByUser())[0].length;
      //create a new fundraise
      await TrustableFundTestCase.publishFundraise(
        ethers.parseEther('100'), 
        "Test Fundraise Title", 
        "Test Fundraise Story Text", 
        "The image should be in the format of base64",
        Math.floor(Date.now()) + 86400 * 1000   // assume timestamp is in the milliseconds 
                                              // set ddl 1 day after the creating time for testing
      );
      const newFundCount = (await TrustableFundTestCase.getFundList())[0].length;
      const latestFundID = (await TrustableFundTestCase.getFundList())[0].length - 1;
      const newFundHistory = (await TrustableFundTestCase.getFundraiseByUser())[0];

      // newFundHistory[0][0] - fundraiser's wallet address
      // newFundHistory[0][1] - fundraise's fundID
      expect(newFundHistory[0][0]).to.equal(owner.address);
      expect(newFundHistory[0][1]).to.equal(latestFundID);
      const newFundHistoryLength = newFundHistory.length;

      //check if FundList and FundHistory's length +1 after publishing a new fundraise
      expect(newFundCount).to.equal(initialFundCount + 1);
      expect(newFundHistoryLength).to.equal(initialFundHistroyLength + 1);

    });

    it("Shouldn't create a new fundraise for the user who has one in the progress", async function () {
        const {TrustableFundTestCase, owner} = await loadFixture(
            deployTokenFixture
          );
          const initialFundCount = (await TrustableFundTestCase.getFundList())[0].length;
          const initialFundHistroyLength = (await TrustableFundTestCase.getFundraiseByUser())[0].length;
          //create the first fundraise
          await TrustableFundTestCase.publishFundraise(
            ethers.parseEther('100'), 
            "First Test Fundraise Title", 
            "First Test Fundraise Story Text", 
            "Image String",
            Math.floor(Date.now()) + 86400 * 1000   // set ddl 1 day after the creating time for testing
                                                  
          );
          
          // Try to create the second fundraise with the same user
          await expect(
            TrustableFundTestCase.publishFundraise(
              ethers.parseEther('100'), 
              "Second Fundraise", 
              "Second Test Fundraise Story Text", 
              "Image String",
              Math.floor(Date.now() / 1000) + 86400 * 2 * 1000// set ddl 2 day after the creating time for testing
            )
          ).to.be.revertedWith("You already have one openning Fundraise");
        
          const newFundCount = (await TrustableFundTestCase.getFundList())[0].length;
          const newFundHistoryLength = (await TrustableFundTestCase.getFundraiseByUser())[0].length;
          //check if FundList and FundHistory's length only + 1 after trying publishing these two fundraises
         expect(newFundCount).to.equal(initialFundCount + 1);
         expect(newFundHistoryLength).to.equal(initialFundHistroyLength + 1);

    });


  });
});