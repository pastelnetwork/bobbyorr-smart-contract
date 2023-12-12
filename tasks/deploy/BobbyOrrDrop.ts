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

task("test:setFanClubSmartmint")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setFanClubSmartmintUsers(new Array(10).fill(0).map((_, index) => index + 1));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListSmartmint")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setWhiteListSmartmintUsers(new Array(20).fill(0).map((_, index) => index + 1));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setFanClubAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setFanClubAddresses(
      new Array(10).fill(0).map((_, index) => "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd"),
    );

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setWhiteListAddresses(
      new Array(20).fill(0).map((_, index) => "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd"),
    );

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
  .addParam("count", "Mint Quantity")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.mint(
      taskArguments.user,
      "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd",
      parseInt(taskArguments.count),
      {
        value: hre.ethers.utils.parseEther("0.002"),
      },
    );

    const answer = await response.wait();

    console.log(answer);
  });
