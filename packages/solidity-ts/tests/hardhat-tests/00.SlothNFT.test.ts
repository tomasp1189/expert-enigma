import '~helpers/hardhat-imports';
import '~tests/utils/chai-imports';

import { expect } from 'chai';
import { SlothNFT__factory, SlothNFT, MetadataFactory, MetadataFactory__factory, MetadataStorage, MetadataStorage__factory } from 'generated/contract-types';
import hre from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

describe('🚩 Challenge 0: 🎟 Simple NFT Example 🤓', function () {
  this.timeout(180000);

  // console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe('slothNFT', function () {
    let slothNFTContract: SlothNFT;
    let metadataFactoryContract: MetadataFactory;
    let metadataStorageContract: MetadataStorage;

    before(async () => {
      const { deployer } = await getHardhatSigners(hre);
      const metadataStorageFactory = new MetadataStorage__factory(deployer);
      metadataStorageContract = await metadataStorageFactory.deploy();
      const metadataFactoryFactory = new MetadataFactory__factory(deployer);
      metadataFactoryContract = await metadataFactoryFactory.deploy();
      const factory = new SlothNFT__factory(deployer);
      slothNFTContract = await factory.deploy(metadataFactoryContract.address, metadataStorageContract.address);
    });

    beforeEach(async () => {
      // put stuff you need to run before each test here
    });

    describe('mintItem()', function () {
      it('Should be able to mint an NFT', async function () {
        const { user1 } = await getHardhatSigners(hre);

        console.log('\t', ' 🧑‍🏫 Tester Address: ', user1.address);

        const startingBalance = await slothNFTContract.balanceOf(user1.address);
        console.log('\t', ' ⚖️ Starting balance: ', startingBalance.toNumber());

        console.log('\t', ' 🔨 Minting...');
        const mintResult = await slothNFTContract.mintItem(user1.address, 'https://sloth.com/1');
        console.log('\t', ' 🏷  mint tx: ', mintResult.hash);

        console.log('\t', ' ⏳ Waiting for confirmation...');
        const txResult = await mintResult.wait(1);
        expect(txResult.status).to.equal(1);

        // console.log('\t', 'tokenURI:', await slothNFTContract.tokenURI(1));
        // console.log('\t', 'tokenMetadata:', await slothNFTContract.tokenMetadata(1));

        console.log('\t', ' 🔎 Checking new balance: ', startingBalance.toNumber());
        expect(await slothNFTContract.balanceOf(user1.address)).to.equal(startingBalance.add(1));
      });
    });
  });
});
