import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { BobbyOrrDrop } from "../../src/types/BobbyOrrDrop";
import { BobbyOrrDrop__factory } from "../../src/types/factories/BobbyOrrDrop__factory";

import { getContract } from "../helpers";
import { Contract } from "ethers";

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

    const response = await contract.setFanClubSmartmintUsers([
      20463, 20462, 20377, 20376, 20375, 20374, 20373, 20327, 20326, 20316, 20272, 20267, 20263, 20257, 20254, 20248,
      20239, 20224, 20220, 20213, 20207, 25,
    ]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListSmartmint")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setWhiteListSmartmintUsers([
      20463, 20462, 20377, 20376, 20375, 20374, 20373, 20327, 20326, 20316, 20272, 20267, 20263, 20257, 20254, 20248,
      20239, 20224, 20220, 20213, 20207, 25, 20378, 20379, 20380, 20381, 20382, 20383, 20384, 20385, 20386, 20387,
    ]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setFanClubAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setFanClubAddresses([
      "0x185b3F6618A50122C70FD100C7Aac729621B8a25",
      "0xFD2b3c9DF1c8e3493540dfd05EA951d584aB34c4",
      "0xfc6054808531e90B5D7EE7b288BCbe1236737986",
      "0xCE9d85110a662b2bd7bE0A08165Dd60C8A7B93a7",
      "0xd8EEBcC727dEc057c0bF7831086A1615859c1B98",
      "0x30D2CA7476cBbA5D4b6e7f8EB64A5047BE443706",
      "0xde888435d018aAfDb1b47027DC0f766821CC8122",
      "0x4E6e15D3F408985e3F90798CE30a756FeFa82963",
    ]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:setWhiteListAddresses")
  .addParam("address", "Address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.setWhiteListAddresses([
      "0x185b3F6618A50122C70FD100C7Aac729621B8a25",
      "0xFD2b3c9DF1c8e3493540dfd05EA951d584aB34c4",
      "0xfc6054808531e90B5D7EE7b288BCbe1236737986",
      "0x01cFD0Cd80ff978E2a505bF0638b5D28DcA11824",
      "0x5698d48CD64924f350E9dEDCE77C9C01882d0745",
      "0x1b9D5131289Ba57E0c6712afCC3bfef85DD0E443",
      "0x8BF8D3FEe98292402A5456B07b767b9F3E50E090",
      "0x01f92Aa0cea555d2a3d98300cD61DAdb2D800605",
      "0x85F81A34eE9a41a8F6b6984bd4D869d4d5aD23d4",
      "0xCE9d85110a662b2bd7bE0A08165Dd60C8A7B93a7",
      "0xd8EEBcC727dEc057c0bF7831086A1615859c1B98",
      "0xdcAB528b8F4b26514007B942FaF751482593F550",
      "0xD13397896C9506199E978bcceBdf16B166b0CF7E",
      "0xc7e9d4c1794f6fE8d0f3d58f9638f6E608d6Ee53",
      "0xE1D3f63fCA173565534238a4Ac74E2CF1056E17f",
      "0xce4Beb8a8fdA62c14c968AcC8fE3c6929594c58B",
      "0x30D2CA7476cBbA5D4b6e7f8EB64A5047BE443706",
      "0xde888435d018aAfDb1b47027DC0f766821CC8122",
    ]);

    const answer = await response.wait();

    console.log(answer);
  });

task("test:checkFanClubAddress")
  .addParam("address", "Address")
  .addParam("user", "User id")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.isFanClubSmartmint(parseInt(taskArguments.user, 10));

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

task("test:withdraw")
  .addParam("address", "Contract address")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const contract: Contract = await getContract("BobbyOrrDrop", taskArguments.address, hre);

    const response = await contract.withdraw();

    const answer = await response.wait();

    console.log(answer);
  });
