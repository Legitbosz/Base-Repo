const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TipJar", function () {
  let tipJar, owner, tipper;

  beforeEach(async () => {
    [owner, tipper] = await ethers.getSigners();
    const TipJar = await ethers.getContractFactory("TipJar");
    tipJar = await TipJar.deploy("My Jar", "A test jar");
    await tipJar.waitForDeployment();
  });

  it("should set the correct owner", async () => {
    expect(await tipJar.owner()).to.equal(owner.address);
  });

  it("should accept a tip", async () => {
    await tipJar.connect(tipper).tip("Hello!", "🔥", { value: ethers.parseEther("0.001") });
    expect(await tipJar.totalTipCount()).to.equal(1);
  });

  it("should reject tips below minimum", async () => {
    await expect(
      tipJar.connect(tipper).tip("Hi", "💜", { value: ethers.parseEther("0.00001") })
    ).to.be.reverted;
  });

  it("should allow owner to withdraw", async () => {
    await tipJar.connect(tipper).tip("Nice!", "🚀", { value: ethers.parseEther("0.001") });
    const before = await ethers.provider.getBalance(owner.address);
    await tipJar.connect(owner).withdraw();
    const after = await ethers.provider.getBalance(owner.address);
    expect(after).to.be.gt(before);
  });

  it("should not allow non-owner to withdraw", async () => {
    await tipJar.connect(tipper).tip("Hey", "⚡", { value: ethers.parseEther("0.001") });
    await expect(tipJar.connect(tipper).withdraw()).to.be.reverted;
  });
});
