const { expect } = require("chai");
const { ethers } = require("hardhat");


const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("TrustableFund Contract", function () {
  async function deployTokenFixture() {
    // Get the Signers here.
    const [addr0, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const TrustableFundTestCase = await ethers.deployContract("TrustableFund");

    await TrustableFundTestCase.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { TrustableFundTestCase, addr0, addr1, addr2 };
  }


  describe("Create a fundraise", function () {
    it("Should successfully publish a fundraise", async function () {
      const {TrustableFundTestCase, addr0} = await loadFixture(
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
        Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                              // set ddl 1 day after the creating time for testing
      );
      const newFundCount = (await TrustableFundTestCase.getFundList())[0].length;
      const latestFundID = (await TrustableFundTestCase.getFundList())[0].length - 1;
      const newFundHistory = (await TrustableFundTestCase.getFundraiseByUser())[0];

      // newFundHistory[0][0] - fundraiser's wallet address
      // newFundHistory[0][1] - fundraise's fundID
      expect(newFundHistory[0][0]).to.equal(addr0.address);
      expect(newFundHistory[0][1]).to.equal(latestFundID);
      const newFundHistoryLength = newFundHistory.length;

      //check if FundList and FundHistory's length +1 after publishing a new fundraise
      expect(newFundCount).to.equal(initialFundCount + 1);
      expect(newFundHistoryLength).to.equal(initialFundHistroyLength + 1);

    });

    it("Shouldn't create a new fundraise for the user who has one in the progress", async function () {
        const {TrustableFundTestCase, addr0} = await loadFixture(
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
            Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                                     // set ddl 1 day after the creating time for testing
          );
          
          // Try to create the second fundraise with the same user
          await expect(
            TrustableFundTestCase.publishFundraise(
              ethers.parseEther('100'), 
              "Second Fundraise", 
              "Second Test Fundraise Story Text", 
              "Image String",
              Math.floor(Date.now() / 1000) + 86400 * 2 // timestamp is in seconds
                                                        // set ddl 2 day after the creating time for testing
            )
          ).to.be.revertedWith("You already have one openning Fundraise");
        
          const newFundCount = (await TrustableFundTestCase.getFundList())[0].length;
          const newFundHistoryLength = (await TrustableFundTestCase.getFundraiseByUser())[0].length;
          //check if FundList and FundHistory's length only + 1 after trying publishing these two fundraises
         expect(newFundCount).to.equal(initialFundCount + 1);
         expect(newFundHistoryLength).to.equal(initialFundHistroyLength + 1);

    });


  });

  describe("Donate to a fundraise", function () {
    it("Should successfully donate to a fundraise", async function () {
      const { TrustableFundTestCase, addr0, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Addr1 create a new fundraise
      await TrustableFundTestCase.connect(addr1).publishFundraise(
        ethers.parseEther('100'),
        "Test Fundraise Title",
        "Test Fundraise Story Text",
        "The image should be in the format of base64",
        Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                                // set ddl 1 day after the creating time for testing
      );

      const fundId = (await TrustableFundTestCase.getFundList())[0].length - 1;
      const fundraiseBefore = (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
      const donationTotalBefore = fundraiseBefore.donation;
    
      // Addr2 donate
      const donationAmount = ethers.parseEther('1');
      await expect(
        TrustableFundTestCase.connect(addr2).donation(
          fundId,
          "2024-01-01T12:00:00Z",
          { value: donationAmount 
          }))
      .to.emit(TrustableFundTestCase, "DonateSuccess")
      .withArgs(fundId, 0, donationAmount);

      // Check Addr2's donation history is correctly updated
      const donationList = (await TrustableFundTestCase.connect(addr2).getDonationHistoryByUser())[0];
      const donation = donationList.find(d => d.fundID === BigInt(fundId) && d.time === "2024-01-01T12:00:00Z");
      expect(donation.transAmount).to.equal(donationAmount);

      // Check if the donation amount is correctly added to the fundraise
      const fundraiseAfter= (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
      const donationTotalAfter = fundraiseAfter.donation;
      expect(donationTotalAfter - donationTotalBefore).to.equal(donationAmount);
      // Check if the donation id is correctly kept in the fundraise
      expect(fundraiseAfter.donationList[0]).to.equal(0);
  });
});

describe("Withdraw from a fundraise", function () {
  it("Should allow the fundraiser to withdraw once goal has reached", async function () {
    const { TrustableFundTestCase, addr0, addr1, addr2 } = await loadFixture(deployTokenFixture);

    // Addr1 create a new fundraise
    await TrustableFundTestCase.connect(addr1).publishFundraise(
      ethers.parseEther('100'),
      "Test Fundraise Title",
      "Test Fundraise Story Text",
      "The image should be in the format of base64",
      Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                              // set ddl 1 day after the creating time for testing
    );

    const fundId = (await TrustableFundTestCase.getFundList())[0].length - 1;

    // Addr2 donates to the fundraise created by addr1, meeting the goal
    const donationAmount = ethers.parseEther('100');
    await TrustableFundTestCase.connect(addr2).donation(
      fundId,
      "2024-01-01T12:00:00Z",
      { value: donationAmount}
    );

    // Check balances before withdrawal
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
    const contractBalanceBefore = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Addr1 withdraws the funds    
    const tx = await TrustableFundTestCase.connect(addr1).withdrawFundraise();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    // Check balances after withdrawal
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
    const contractBalanceAfter = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Check if the contract balance is reduced by the donation amount
    expect(contractBalanceBefore - contractBalanceAfter).to.equal(donationAmount);
    // Check if addr1's balance has increased by the donation amount - gas costs
    expect(addr1BalanceAfter - addr1BalanceBefore).to.equal(donationAmount - gasUsed);
    // Check if addr2's balance reamins unchanged before and after addr1's withdrawal
    expect(addr2BalanceAfter).to.equal(addr2BalanceBefore);

    // Check if the fundraise is inactive after withdrawal
    const fundraise = (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
    expect(fundraise.active).to.equal(false);
  });

  it("Should allow the fundraiser to widthdraw once deadline passed", async function () {
    const { TrustableFundTestCase, addr0, addr1, addr2 } = await loadFixture(deployTokenFixture);

    // Addr1 create a new fundraise
    await TrustableFundTestCase.connect(addr1).publishFundraise(
      ethers.parseEther('100'),
      "Test Fundraise Title",
      "Test Fundraise Story Text",
      "The image should be in the format of base64",
      Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                              // set ddl 1 day after the creating time for testing
    );

    const fundId = (await TrustableFundTestCase.getFundList())[0].length - 1;

    // Addr2 donates to the fundraise created by addr1, but not enough to meet the goal
    const donationAmount = ethers.parseEther('10');
    await TrustableFundTestCase.connect(addr2).donation(
      fundId,
      "2024-01-01T12:00:00Z",
      { value: donationAmount}
    );

    // Advance time to just past the deadline
    await ethers.provider.send("evm_increaseTime", [86400 + 1]);
    await ethers.provider.send("evm_mine", []);

    // Check balances before withdrawal
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
    const contractBalanceBefore = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Addr1 withdraws the funds    
    const tx = await TrustableFundTestCase.connect(addr1).withdrawFundraise();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    // Check balances after withdrawal
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
    const contractBalanceAfter = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Check if the contract balance is reduced by the donation amount
    expect(contractBalanceBefore - contractBalanceAfter).to.equal(donationAmount);
    // Check if addr1's balance has increased by the donation amount - gas costs
    expect(addr1BalanceAfter - addr1BalanceBefore).to.equal(donationAmount - gasUsed);
    // Check if addr2's balance reamins unchanged before and after addr1's withdrawal
    expect(addr2BalanceAfter).to.equal(addr2BalanceBefore);

    // Check if the fundraise is inactive after withdrawal
    const fundraise = (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
    expect(fundraise.active).to.equal(false);
  });

  it("Shouldn't allow the fundraiser to withdraw when goal hasn't reached and deadline hasn't passed", async function () {
    const { TrustableFundTestCase, addr0, addr1, addr2 } = await loadFixture(deployTokenFixture);

    // Addr1 create a new fundraise
    await TrustableFundTestCase.connect(addr1).publishFundraise(
      ethers.parseEther('100'),
      "Test Fundraise Title",
      "Test Fundraise Story Text",
      "The image should be in the format of base64",
      Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                              // set ddl 1 day after the creating time for testing
    );

    const fundId = (await TrustableFundTestCase.getFundList())[0].length - 1;

    // Addr2 donates to the fundraise created by addr1, but not enough to meet the goal
    const donationAmount = ethers.parseEther('10');
    await TrustableFundTestCase.connect(addr2).donation(
      fundId,
      "2024-01-01T12:00:00Z",
      { value: donationAmount}
    );

    // Check balances before withdrawal
    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
    const contractBalanceBefore = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Addr1 try to withdraws the funds, should fail
    await expect(
      TrustableFundTestCase.connect(addr1).withdrawFundraise()
    ).to.be.revertedWith("The deadline haven't passed and the goal hasn't been reached");

    // Check balances after withdrawal
    const addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
    const contractBalanceAfter = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Check if the contract balance reamins unchanged before and after the failed withdrawal
    expect(contractBalanceAfter).to.equal(contractBalanceBefore);
    // We don't know the exact gas cost for a failed transaction. But Addr1's balance should decrease because of the gas cost.
    expect(addr1BalanceAfter).to.be.lessThan(addr1BalanceBefore);
    // Check if addr2's balance reamins unchanged before and after Addr1's failed withdrawal
    expect(addr2BalanceAfter).to.equal(addr2BalanceBefore);

    // Check if the fundraise is still active after the failed withdrawal
    const fundraise = (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
    expect(fundraise.active).to.equal(true);
  });

  it("Shouldn't allow non-fundraisers to withdraw funds", async function () {
    const { TrustableFundTestCase, addr0, addr1, addr2 } = await loadFixture(deployTokenFixture);

    // Addr1 create a new fundraise
    await TrustableFundTestCase.connect(addr1).publishFundraise(
      ethers.parseEther('100'),
      "Test Fundraise Title",
      "Test Fundraise Story Text",
      "The image should be in the format of base64",
      Math.floor(Date.now() / 1000) + 86400    // timestamp is in seconds
                                              // set ddl 1 day after the creating time for testing
    );

    const fundId = (await TrustableFundTestCase.getFundList())[0].length - 1;

    // Addr2 donates to the fundraise created by addr1, meeting the goal
    const donationAmount = ethers.parseEther('100');
    await TrustableFundTestCase.connect(addr2).donation(
      fundId,
      "2024-01-01T12:00:00Z",
      { value: donationAmount}
    );

    // Step 1: Addr2 try to withdraw the funds, should fail since addr2 is not the fundraiser
    // Check balances before withdrawal
    let addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
    let addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
    let contractBalanceBefore = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Addr2 try to withdraws the funds, should fail because addr2 is not the fundraiser
    await expect(
      TrustableFundTestCase.connect(addr2).withdrawFundraise()
    ).to.be.reverted;

    // Check balances after withdrawal
    let addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    let addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
    let contractBalanceAfter = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Check if the contract balance reamins unchanged before and after the failed withdrawal
    expect(contractBalanceAfter).to.equal(contractBalanceBefore);
    // Check if the contract balance reamins unchanged before and after the failed withdrawal
    expect(addr1BalanceAfter).to.equal(addr1BalanceBefore);
    // We don't know the exact gas cost for a failed transaction. But Addr2's balance should decrease because of the gas cost.
    expect(addr2BalanceAfter).to.be.lessThan(addr2BalanceBefore);
    
    // Check if the fundraise is still active after the failed withdrawal
    let fundraise = (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
    expect(fundraise.active).to.equal(true);

    // Step 2: Addr1 try to withdraw the funds, should succeed since addr1 is the fundraiser
    // Check balances before withdrawal
    addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);
    addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
    contractBalanceBefore = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Addr1 withdraws the funds    
    tx = await TrustableFundTestCase.connect(addr1).withdrawFundraise();
    receipt = await tx.wait();
    gasUsed = receipt.gasUsed * receipt.gasPrice;

    // Check balances after withdrawal
    addr1BalanceAfter = await ethers.provider.getBalance(addr1.address);
    addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
    contractBalanceAfter = await ethers.provider.getBalance(TrustableFundTestCase.getAddress());

    // Check if the contract balance is reduced by the donation amount
    expect(contractBalanceBefore - contractBalanceAfter).to.equal(donationAmount);
    // Check if addr1's balance has increased by the donation amount - gas costs
    expect(addr1BalanceAfter - addr1BalanceBefore).to.equal(donationAmount - gasUsed);
    // Check if addr2's balance reamins unchanged before and after addr1's withdrawal
    expect(addr2BalanceAfter).to.equal(addr2BalanceBefore);

    // Check if the fundraise is inactive after withdrawal
    fundraise = (await TrustableFundTestCase.getFundList())[0].find(f => f.fundID === BigInt(fundId));
    expect(fundraise.active).to.equal(false);
  });
});

// TODO: X: Donate to inactive fundraise

});