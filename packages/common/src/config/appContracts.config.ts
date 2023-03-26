/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  createConnectorForExternalContract,
  createConnectorForFoundryContract,
  createConnectorForHardhatContract,
} from 'eth-hooks/context';
import { invariant } from 'ts-invariant';

import { externalContractsAddressMap } from './externalContracts.config';

import * as toolkitContracts from '~common/generated/contract-types/';
import * as externalContracts from '~common/generated/external-contracts/esm/types';
import foundryDeployedContractsJson from '~common/generated/foundry_contracts.json';
import hardhatDeployedContractsJson from '~common/generated/hardhat_contracts.json';
import { scaffoldConfig } from '~common/scaffold.config';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * ### Instructions
 * 1. edit externalContracts.config.ts to add your external contract addresses.
 * 2. edit `appContractsConfig` function below and add them to the list
 * 3. run `yarn contracts:build` to generate types for contracts
 * 4. run `yarn deploy` to generate hardhat_contracts.json
 *
 * ### Summary
 * - called  by useAppContracts
 * @returns
 */
export const appContractsConfig = () => {
  try {
    const result = {
      // --------------------------------------------------
      // 🙋🏽‍♂️ Contracts examples either using hardhat or foundry
      // --------------------------------------------------
      SlothFarming:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'SlothFarming',
              toolkitContracts.SlothFarming__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'SlothFarming',
              toolkitContracts.SlothFarming__factory,
              foundryDeployedContractsJson
            ),
      SlothArena:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'SlothArena',
              toolkitContracts.SlothArena__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'SlothArena',
              toolkitContracts.SlothArena__factory,
              foundryDeployedContractsJson
            ),
      SlothToken:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'SlothToken',
              toolkitContracts.SlothToken__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'SlothToken',
              toolkitContracts.SlothToken__factory,
              foundryDeployedContractsJson
            ),
      SlothNFT:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'SlothNFT',
              toolkitContracts.SlothNFT__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'SlothNFT',
              toolkitContracts.SlothNFT__factory,
              foundryDeployedContractsJson
            ),
      MetadataStorage:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'MetadataStorage',
              toolkitContracts.MetadataStorage__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'MetadataStorage',
              toolkitContracts.MetadataStorage__factory,
              foundryDeployedContractsJson
            ),
      MetadataFactory:
        scaffoldConfig.build.solidityToolkit === 'hardhat'
          ? createConnectorForHardhatContract(
              'MetadataFactory',
              toolkitContracts.MetadataFactory__factory,
              hardhatDeployedContractsJson
            )
          : createConnectorForFoundryContract(
              'MetadataFactory',
              toolkitContracts.MetadataFactory__factory,
              foundryDeployedContractsJson
            ),

      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external contracts here, make sure to define the address in `externalContractsConfig.ts`Í
      // --------------------------------------------------
      DAI: createConnectorForExternalContract('DAI', externalContracts.DAI__factory, externalContractsAddressMap),

      // --------------------------------------------------
      // 🙋🏽‍♂️ Add your external abi here (unverified contracts)`
      // --------------------------------------------------
      // YourContractFromAbi: createConnectorForExternalAbi(
      //   'YourContract',
      //   {
      //     [1235]: {
      //       address: 'xxx',
      //     },
      //   },
      //   toolkitContracts.YourContract__factory.abi
      //   // optional if you have a connect function:  externalContracts.YourContract__factory.connect
      // ),
    } as const;

    return result;
  } catch (e) {
    invariant.error(
      '❌ appContractsConfig: ERROR with loading contracts please run `yarn contracts:build or yarn contracts:rebuild`.  Then run `yarn deploy`!'
    );
    invariant.error(e);
    throw e;
  }
};
