import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import {
  SlothNFT__factory,
  SlothNFT,
  MetadataFactory,
  MetadataFactory__factory,
  MetadataStorage,
  MetadataStorage__factory,
  SlothFarming__factory,
  SlothFarming,
  SlothToken,
  SlothToken__factory,
} from 'generated/contract-types';
import hre from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

describe('SlothFarming', function () {
  let slothNFTContract: SlothNFT;
  let metadataFactoryContract: MetadataFactory;
  let metadataStorageContract: MetadataStorage;
  let slothFarmingContract: SlothFarming;
  let resourceTokenContract: SlothToken;

  beforeEach(async () => {
    await hre.network.provider.send('hardhat_reset');
    const { deployer } = await getHardhatSigners(hre);

    const metadataStorageFactory = new MetadataStorage__factory(deployer);
    metadataStorageContract = await metadataStorageFactory.deploy();
    const metadataFactoryFactory = new MetadataFactory__factory(deployer);
    metadataFactoryContract = await metadataFactoryFactory.deploy();
    const factory = new SlothNFT__factory(deployer);
    slothNFTContract = await factory.deploy(metadataFactoryContract.address, metadataStorageContract.address);

    // Deploy the resource token
    const resourceTokenFactory = new SlothToken__factory(deployer);
    resourceTokenContract = await resourceTokenFactory.deploy();

    // Deploy the SlothFarming contract
    const slothFarmingFactory = new SlothFarming__factory(deployer);
    slothFarmingContract = await slothFarmingFactory.deploy(resourceTokenContract.address, slothNFTContract.address, metadataStorageContract.address);
    await resourceTokenContract.addMinter(slothFarmingContract.address);

    // // Set up the resource token so that the farming contract has enough balance
    // await resourceTokenContract.mint(slothFarmingContract.address, ethers.utils.parseEther('10000'));
  });

  describe('farm()', function () {
    it('Should be able to farm resources with an NFT', async function () {
      const { user1 } = await getHardhatSigners(hre);
      console.log('\t', ' 🧑‍🏫 Tester Address: ', user1.address);

      // Mint an NFT for user1
      await slothNFTContract.mintItem(user1.address, 'https://sloth.com/1');
      const tokenId = 1;

      // User1 approves the SlothFarming contract to manage their NFT
      await slothNFTContract.connect(user1).setApprovalForAll(slothFarmingContract.address, true);
      const initialResourceBalance = await resourceTokenContract.balanceOf(user1.address);
      console.log('\t', ' 💰 Initial resource balance: ', initialResourceBalance.toString());

      // User1 starts farming
      const farmTx = await slothFarmingContract.connect(user1).farm(tokenId);

      await farmTx.wait();
      console.log('\t', ' 🌱 Farming started at: ', await time.latest());
      // Wait for some time (e.g., 10 seconds) to simulate farming
      await time.increase(60 * 60);

      // User1 collects farmed resources using the collectFarmedResources function
      const collectTx = await slothFarmingContract.connect(user1).collectFarmedResources(tokenId);
      await collectTx.wait();
      console.log('\t', ' 🌱 Farming ended at: ', await time.latest());

      const finalResourceBalance = await resourceTokenContract.balanceOf(user1.address);

      console.log('\t', ' 💰 Final resource balance: ', finalResourceBalance.toString());

      // Check if the user1's resource balance has increased
      expect(finalResourceBalance).to.be.gt(initialResourceBalance);
    });
    it('Should limit the resources mined to a day', async function () {
      const { user1 } = await getHardhatSigners(hre);

      console.log('\t', ' 🧑‍🏫 Tester Address: ', user1.address);

      // Mint an NFT for user1
      await slothNFTContract.mintItem(user1.address, 'https://sloth.com/1');
      const tokenId = 1;

      const initialResourceBalance = await resourceTokenContract.balanceOf(user1.address);
      console.log('\t', ' 💰 Initial resource balance: ', initialResourceBalance.toString());

      // User1 approves the SlothFarming contract to manage their NFT
      await slothNFTContract.connect(user1).setApprovalForAll(slothFarmingContract.address, true);

      // User1 starts farming
      const farmTx = await slothFarmingContract.connect(user1).farm(tokenId);
      await farmTx.wait();

      console.log('\t', ' 🌱 Farming started at: ', await time.latest());

      // Wait for some time (e.g., 10 seconds) to simulate farming
      await time.increase(60 * 60 * 24);

      // User1 collects farmed resources using the collectFarmedResources function
      let collectTx = await slothFarmingContract.connect(user1).collectFarmedResources(tokenId);
      await collectTx.wait();

      console.log('\t', ' 🌱 Resources collected at: ', await time.latest());

      const resourceBalance24 = await resourceTokenContract.balanceOf(user1.address);
      console.log('\t', ' 💰 24hr resource collection: ', resourceBalance24.sub(initialResourceBalance).toString());

      // Wait for some time (e.g., 10 seconds) to simulate farming
      await time.increase(60 * 60 * 27);

      // User1 collects farmed resources using the collectFarmedResources function
      collectTx = await slothFarmingContract.connect(user1).collectFarmedResources(tokenId);
      await collectTx.wait();

      console.log('\t', ' 🌱 Resources collected at: ', await time.latest());

      const resourceBalance27 = await resourceTokenContract.balanceOf(user1.address);
      console.log('\t', ' 💰 27hr resource balance: ', resourceBalance27.sub(resourceBalance24).toString());

      // Check if the user1's resource balance has increased
      expect(resourceBalance24).to.be.equal(resourceBalance27.sub(resourceBalance24));
    });
  });
});
