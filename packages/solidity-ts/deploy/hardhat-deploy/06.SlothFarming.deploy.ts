import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

import { SlothToken } from '~generated/contract-types';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  /*
    Getting a previously deployed contract
    */
  const MetadataStorage = await ethers.getContract('MetadataStorage', deployer);
  const SlothToken: SlothToken = await ethers.getContract('SlothToken', deployer);
  const SlothNFT = await ethers.getContract('SlothNFT', deployer);

  // const yourContract = await ethers.getContractAt('YourContract', '0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A'); //<-- if you want to instantiate a version of a contract at a specific address!
  const slothFarm = await deploy('SlothFarming', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [SlothToken.address, SlothNFT.address, MetadataStorage.address],
    log: true,
  });

  await SlothToken.addMinter(slothFarm.address);
};
export default func;
func.tags = ['SlothFarming'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
