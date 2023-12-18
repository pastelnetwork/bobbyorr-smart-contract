import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { BobbyOrrDrop } from "../../src/types/BobbyOrrDrop";
import { BobbyOrrDrop__factory } from "../../src/types/factories/BobbyOrrDrop__factory";

import { getContract } from "../helpers";
import { Contract } from "ethers";
import fs from "fs";

task("deploy:BobbyOrrDrop")
  .addParam("name", "Name of the contract")
  .addParam("symbol", "Symbol of the contract")
  .addParam("maxSupply", "Max supply of the contract")
  .addParam("maxMintPerTx", "Max mint per transaction")
  .addParam("royalty", "Royalty percentage")
  .addParam("baseUri", "Base URI of the contract")
  .addParam("primaryWallet", "Primary wallet address")
  .setAction(async function (taskArguments: TaskArguments, { ethers, upgrades }) {
    const dropFactory: BobbyOrrDrop__factory = <BobbyOrrDrop__factory>await ethers.getContractFactory("BobbyOrrDrop");

    const bobbyOrrDrop: BobbyOrrDrop = <BobbyOrrDrop>(
      await upgrades.deployProxy(dropFactory, [
        taskArguments.name,
        taskArguments.symbol,
        parseInt(taskArguments.maxSupply, 10),
        parseInt(taskArguments.maxMintPerTx, 10),
        parseInt(taskArguments.royalty, 10),
        taskArguments.baseUri,
        taskArguments.primaryWallet,
      ])
    );

    await bobbyOrrDrop.deployed();
    console.log("BobbyOrrDrop deployed to: ", bobbyOrrDrop.address);
  });

task("test:setFanClubSmartmint")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const FCSM = await fs.readFileSync(__dirname + "/FCSM.txt", "utf-8");

    const array = FCSM.split("\r");

    const response = await contract.setFanClubSmartmintUsers(array.map(iter => Number(iter)));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListSmartmint")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const FCFSSM = await fs.readFileSync(__dirname + "/FCFSSM.txt", "utf-8");

    const array = FCFSSM.split("\r");

    const response = await contract.setWhiteListSmartmintUsers(array.map(iter => Number(iter)));

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setFanClubAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const FCAddr = await fs.readFileSync(__dirname + "/FCAddr.txt", "utf-8");

    const array = FCAddr.split("\r");
    const response = await contract.setFanClubAddresses(array);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const FCFSAddresses = await fs.readFileSync(__dirname + "/FCFSAddr.txt", "utf-8");

    const array = FCFSAddresses.split("\r");

    const response = await contract.setWhiteListAddresses(array);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:checkFanClubAddress")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.isFanClubSmartmint(20373);

    console.log(response);
  });

task("test:checkMaxQuantity")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    // const response = await contract.hasUserMintedSmartmint[20373];
    const response = await contract.hasUserMintedSmartmint(20373);
    // const response = await contract.getMaxQuantity(20373, "0x185b3F6618A50122C70FD100C7Aac729621B8a25");

    console.log(response);
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
