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
    "ipfs://Qmdt2pqCLefbM9hdRuvxyf5PtzBxvK2No4w5xVXU89GwKi/",
    ethers.utils.parseEther("0.01"),
    "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd", // primary wallet
    "0xFFf50b1b9154b0631591DAB746c5Fc8f41Dc44Bd", // secondary wallet
  ]);

  await bobbyOrrDrop.deployed();
  console.log("BobbyOrrDrop deployed to: ", bobbyOrrDrop.address);
});

task("test:createBobbyOrrDrop")
  .addParam("address", "Contract address")
  .addParam("name", "Contract name")
  .addParam("symbol", "Contract symbol")
  .addParam("uri", "Token URI")
  .addParam("user", "User id")
  .addParam("wallet", "Primary Wallet")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.createDrop(
      taskArguments.name,
      taskArguments.symbol,
      taskArguments.uri,
      100,
      hre.ethers.utils.parseEther("0.001"),
      taskArguments.royalty,
      taskArguments.wallet,
      {
        gasLimit: 10000000,
      },
    );

    const answer = await response.wait();

    console.log(response, answer);
  });

task("testBobbyOrrDrop:mint")
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
