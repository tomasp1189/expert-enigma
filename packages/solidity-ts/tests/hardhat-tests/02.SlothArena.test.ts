/* eslint-disable @typescript-eslint/no-unused-expressions */
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
  SlothArena__factory,
  SlothArena,
} from 'generated/contract-types';
import hre from 'hardhat';

import { getHardhatSigners } from '~helpers/functions/accounts';

describe('SlothArena', function () {
  let slothNFTContract: SlothNFT;
  let metadataFactoryContract: MetadataFactory;
  let metadataStorageContract: MetadataStorage;
  let slothArenaContract: SlothArena;

  beforeEach(async () => {
    await hre.network.provider.send('hardhat_reset');
    const { deployer } = await getHardhatSigners(hre);

    const metadataStorageFactory = new MetadataStorage__factory(deployer);
    metadataStorageContract = await metadataStorageFactory.deploy();
    const metadataFactoryFactory = new MetadataFactory__factory(deployer);
    metadataFactoryContract = await metadataFactoryFactory.deploy();
    const factory = new SlothNFT__factory(deployer);
    slothNFTContract = await factory.deploy(metadataFactoryContract.address, metadataStorageContract.address);

    // Deploy the SlothArena contract
    const slothArenaFactory = new SlothArena__factory(deployer);
    slothArenaContract = await slothArenaFactory.deploy(slothNFTContract.address, metadataStorageContract.address);

    await metadataStorageContract.setLeaderBoardRole(slothArenaContract.address);
  });

  describe('enterArena()', function () {
    it('Should be able to enter the arena with an NFT', async function () {
      const { user1 } = await getHardhatSigners(hre);
      console.log('\t', ' 🧑‍🏫 Tester Address: ', user1.address);

      // Mint an NFT for user1
      await slothNFTContract.mintItem(user1.address, 'https://sloth.com/1');
      const tokenId = 1;

      // User1 approves the SlothArena contract to manage their NFT
      await slothNFTContract.connect(user1).setApprovalForAll(slothArenaContract.address, true);

      // User1 enters the arena
      await slothArenaContract.connect(user1).enterArena(tokenId);

      // Check if the NFT is in the arena
      expect(await slothArenaContract.isInArena(tokenId)).to.be.true;
    });
  });

  describe('leaveArena()', function () {
    it('Should be able to leave the arena with an NFT', async function () {
      const { user1 } = await getHardhatSigners(hre);
      console.log('\t', ' 🧑‍🏫 Tester Address: ', user1.address);

      // Mint an NFT for user1
      await slothNFTContract.mintItem(user1.address, 'https://sloth.com/1');
      const tokenId = 1;

      // User1 approves the SlothArena contract to manage their NFT
      await slothNFTContract.connect(user1).setApprovalForAll(slothArenaContract.address, true);

      // User1 enters the arena
      await slothArenaContract.connect(user1).enterArena(tokenId);

      // User1 leaves the arena
      await slothArenaContract.connect(user1).leaveArena(tokenId);

      // Check if the NFT is not in the arena
      expect(await slothArenaContract.isInArena(tokenId)).to.be.false;
    });
  });
  describe('battle()', function () {
    it('Should be able to battle two NFTs in the arena', async function () {
      const { user1, user2 } = await getHardhatSigners(hre);

      // Mint NFTs for user1 and user2
      await slothNFTContract.mintItem(user1.address, 'https://sloth.com/1');
      await slothNFTContract.mintItem(user2.address, 'https://sloth.com/2');
      const tokenId1 = 1;
      const tokenId2 = 2;

      // Users approve the SlothArena contract to manage their NFTs
      await slothNFTContract.connect(user1).setApprovalForAll(slothArenaContract.address, true);
      await slothNFTContract.connect(user2).setApprovalForAll(slothArenaContract.address, true);

      // Users enter the arena
      await slothArenaContract.connect(user1).enterArena(tokenId1);
      await slothArenaContract.connect(user2).enterArena(tokenId2);

      // Check if the NFTs are in the arena
      expect(await slothArenaContract.isInArena(tokenId1)).to.be.true;
      expect(await slothArenaContract.isInArena(tokenId2)).to.be.true;

      // Users battle their NFTs
      await slothArenaContract.connect(user1).battle(tokenId1, tokenId2);

      // Check if the NFTs are not in the arena after the battle
      expect(await slothArenaContract.isInArena(tokenId1)).to.be.false;
      expect(await slothArenaContract.isInArena(tokenId2)).to.be.false;

      // Check if wins and losses have been updated for the NFTs
      const wins1 = await metadataStorageContract.wins(tokenId1);
      const wins2 = await metadataStorageContract.wins(tokenId2);
      const losses1 = await metadataStorageContract.losses(tokenId1);
      const losses2 = await metadataStorageContract.losses(tokenId2);

      expect(wins1.add(losses1)).to.be.equal(1);
      expect(wins2.add(losses2)).to.be.equal(1);
    });
  });
});
