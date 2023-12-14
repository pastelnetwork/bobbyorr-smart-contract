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
    3,
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

    const response = await contract.setFanClubSmartmintUsers([20376, 20377]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListSmartmint")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setWhiteListSmartmintUsers([20376, 20377, 20380, 20381, 20382]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setFanClubAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setFanClubAddresses([
      "0xCE9d85110a662b2bd7bE0A08165Dd60C8A7B93a7",
      "0xd8EEBcC727dEc057c0bF7831086A1615859c1B98",
    ]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setWhiteListAddresses([
      "0xCE9d85110a662b2bd7bE0A08165Dd60C8A7B93a7",
      "0xd8EEBcC727dEc057c0bF7831086A1615859c1B98",
      "0x8BF8D3FEe98292402A5456B07b767b9F3E50E090",
      "0xdcAB528b8F4b26514007B942FaF751482593F550",
    ]);

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
