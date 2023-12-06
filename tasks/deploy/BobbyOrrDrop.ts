import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { BobbyOrrDrop } from "../../src/types/BobbyOrrDrop";
import { BobbyOrrDrop__factory } from "../../src/types/factories/BobbyOrrDrop__factory";

import { getContract } from "../helpers";
import { Contract } from "ethers";

task("deploy:BobbyOrrDrop").setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
  const dropFactory: BobbyOrrDrop__factory = <BobbyOrrDrop__factory>await ethers.getContractFactory("BobbyOrrDrop");

  const bobbyOrrDrop: BobbyOrrDrop = <BobbyOrrDrop>await upgrades.deployProxy(dropFactory, [
    "BobbyOrr",
    "BOB",
    1444,
    "ipfs://Qmdt2pqCLefbM9hdRuvxyf5PtzBxvK2No4w5xVXU89GwKi/",
    "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd", // primary wallet
  ]);

  await bobbyOrrDrop.deployed();
  console.log("BobbyOrrDrop deployed to: ", bobbyOrrDrop.address);
});

task("test:setAllowListFanClubUsers")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setAllowListFanClubUsers(new Array(1000).fill(0).map((_, index) => index + 1));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setAllowListWhiteListUsers")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setAllowListFanClubUsers(new Array(1200).fill(0).map((_, index) => index + 1));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setStage")
  .addParam("address", "Address")
  .addParam("stage", "Stage")
  .addParam("price", "Price")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setStage(taskArguments.stage, hre.ethers.utils.parseEther(taskArguments.price));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:mint")
  .addParam("address", "Contract address")
  .addParam("user", "User id")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.mint(taskArguments.user, {
      value: hre.ethers.utils.parseEther("0.001"),
    });

    const answer = await response.wait();

    console.log(answer);
  });
