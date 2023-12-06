import { ethers, upgrades } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { BobbyOrrDrop } from "../../src/types/BobbyOrrDrop";
import type { BobbyOrrDrop__factory } from "../../src/types/factories/BobbyOrrDrop__factory";

import { Signers } from "../types";

import { shouldBehaveLikeBobbyOrrDrop } from "./BobbyOrrDrop.behavior";

describe("BobbyOrrDrop", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.alice = signers[1];
    this.signers.bob = signers[2];

    const dropFactory: BobbyOrrDrop__factory = <BobbyOrrDrop__factory>await ethers.getContractFactory("BobbyOrrDrop");

    this.drop = <BobbyOrrDrop>(
      await upgrades.deployProxy(dropFactory, [
        "BobbyOrrSample",
        "BOBSample",
        "base_uri",
        ethers.utils.parseEther("0.01"),
        "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd",
        "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd",
      ])
    );
    await this.drop.deployed();
  });

  shouldBehaveLikeBobbyOrrDrop();
});
