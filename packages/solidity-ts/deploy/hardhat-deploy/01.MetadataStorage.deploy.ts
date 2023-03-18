import { DeployFunction } from 'hardhat-deploy/types';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';

const func: DeployFunction = async (hre: THardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // const yourContract = await ethers.getContractAt('YourContract', '0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A'); //<-- if you want to instantiate a version of a contract at a specific address!
  await deploy('MetadataStorage', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: ["Hello"],
    log: true,
  });
};
export default func;
func.tags = ['MetadataStorage'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
