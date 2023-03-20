import { useContext } from "react"
import { Store } from "../providers/Store"

export const useWriteContract = (contractName: string, functionName: string, args?: any[]) => {
  const { contractStore } = useContext(Store)

  const writeContract = async () => {
    if (!contractStore[contractName]) return
    const tx = await contractStore[contractName]["write"][functionName](...args ?? [])
    await tx.wait()
  }

  return writeContract

} 

