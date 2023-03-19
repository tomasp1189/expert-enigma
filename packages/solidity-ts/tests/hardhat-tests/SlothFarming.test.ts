import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

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
import hre, { ethers } from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

describe('SlothFarming', function () {
  let slothNFTContract: SlothNFT;
  let metadataFactoryContract: MetadataFactory;
  let metadataStorageContract: MetadataStorage;
  let slothFarmingContract: SlothFarming;
  let resourceTokenContract: SlothToken;

  before(async () => {
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

    // Set up the resource token so that the farming contract has enough balance
    await resourceTokenContract.mint(slothFarmingContract.address, ethers.utils.parseEther('10000'));
  });

  describe('farm()', function () {
    it('Should be able to farm resources with an NFT', async function () {
      const { user1 } = await getHardhatSigners(hre);

      // Mint an NFT for user1
      await slothNFTContract.mintRandomSloth(user1.address);
      const tokenId = 1;

      // User1 approves the SlothFarming contract to manage their NFT
      await slothNFTContract.connect(user1).setApprovalForAll(slothFarmingContract.address, true);

      // User1 starts farming
      await slothFarmingContract.connect(user1).farm(tokenId);

      // Wait for some time (e.g., 10 seconds) to simulate farming
      await hre.network.provider.send('evm_increaseTime', [10]);
      await hre.network.provider.send('evm_mine');

      // User1 collects farmed resources using the collectFarmedResources function
      const initialResourceBalance = await resourceTokenContract.balanceOf(user1.address);
      await slothFarmingContract.connect(user1).collectFarmedResources(tokenId);
      const finalResourceBalance = await resourceTokenContract.balanceOf(user1.address);

      // Check if the user1's resource balance has increased
      expect(finalResourceBalance).to.be.gt(initialResourceBalance);
    });
  });
});
