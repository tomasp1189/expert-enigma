import { useContext } from "react"
import { Store } from "../providers/Store"

export const useReadContract = (contractName: string, functionName: string, args?: any[]) => {
  const { contractStore } = useContext(Store)

  const readContract = async () => {
    if (!contractStore[contractName]) return
    const tx = await contractStore[contractName]["read"][functionName](...args ?? [])
    return tx
  }

  return readContract

} 

