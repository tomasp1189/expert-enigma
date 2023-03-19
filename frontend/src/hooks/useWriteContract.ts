import { useContext } from "react"
import { useContract } from "wagmi"
import { Store } from "../providers/Store"
import { contractData } from "../_constants/contractData"

export const useWriteContract = (contractName: string, functionName: string, args: any[]) => {
  const context = useContext(Store)
  const contract = useContract({
    address: contractData[contractName]?.address,
    abi: contractData[contractName]?.abi,
    signerOrProvider: context.userStore.signer,
  })

  const writeContract = async () => {
    if (!contract) return
    const tx = await contract[functionName](...args)
    await tx.wait()
  }

  return writeContract

} 

