/*
The SDK expects a certain message format to serialize and then sign.

type StdSignMsg struct {
  ChainID       string      `json:"chain_id"`
  AccountNumber uint64      `json:"account_number"`
  Fee           auth.StdFee `json:"fee"`
  Msgs          []sdk.Msg   `json:"msgs"`
  Memo          string      `json:"memo"`
  Nonce         uint64      `json:"nonce"`
}
*/
export function createSignMessage (
  jsonTx,
  { accountNumber, chainId }
) {
  // sign bytes need amount to be an array
  const fee = {
    amount: jsonTx.fee.amount || [],
    gas: jsonTx.fee.gas
  }

  return JSON.stringify(
    removeEmptyProperties({
      fee,
      memo: jsonTx.memo,
      nonce: jsonTx.nonce,
      msgs: jsonTx.msg, // weird msg vs. msgs
      account_number: accountNumber,
      chain_id: chainId
    })
  )
}

export function createSignature (
  signature,
  accountNumber,
  publicKey
) {
  return {
    signature: signature.toString(`base64`),
    account_number: accountNumber,
    pub_key: {
      type: `tendermint/PubKeySecp256k1`, // TODO: allow other keytypes
      value: publicKey.toString(`base64`)
    }
  }
}

export function removeEmptyProperties (jsonTx) {
  if (Array.isArray(jsonTx)) {
    return jsonTx.map(removeEmptyProperties)
  }

  // string or number
  if (typeof jsonTx !== `object`) {
    return jsonTx
  }

  const sorted = {}
  Object.keys(jsonTx)
    .sort()
    .forEach(key => {
      if (jsonTx[key] === undefined || jsonTx[key] === null) return

      sorted[key] = removeEmptyProperties(jsonTx[key])
    })
  return sorted
}
