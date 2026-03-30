const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipLeaderboard", function () {
  let leaderboard, owner, tipper1, tipper2;

  beforeEach(async () => {
    [owner, tipper1, tipper2] = await ethers.getSigners();
    const TipLeaderboard = await ethers.getContractFactory("TipLeaderboard");
    leaderboard = await TipLeaderboard.deploy();
    await leaderboard.waitForDeployment();
  });

  it("should track tipper totals", async () => {
    await leaderboard.connect(tipper1).tip({ value: ethers.parseEther("0.001") });
    expect(await leaderboard.totalTipped(tipper1.address)).to.equal(ethers.parseEther("0.001"));
  });

  it("should return correct tipper count", async () => {
    await leaderboard.connect(tipper1).tip({ value: ethers.parseEther("0.001") });
    await leaderboard.connect(tipper2).tip({ value: ethers.parseEther("0.002") });
    expect(await leaderboard.getTipperCount()).to.equal(2);
  });

  it("should return top tippers sorted by amount", async () => {
    await leaderboard.connect(tipper1).tip({ value: ethers.parseEther("0.001") });
    await leaderboard.connect(tipper2).tip({ value: ethers.parseEther("0.005") });
    const [addrs, amounts] = await leaderboard.getTopTippers(2);
    expect(addrs[0]).to.equal(tipper2.address);
    expect(amounts[0]).to.equal(ethers.parseEther("0.005"));
  });

  it("should allow owner to withdraw", async () => {
    await leaderboard.connect(tipper1).tip({ value: ethers.parseEther("0.001") });
    await expect(leaderboard.connect(owner).withdraw()).to.not.be.reverted;
  });
});
