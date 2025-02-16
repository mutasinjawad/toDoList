async function setup() {
  const provider = await window.detectEthereumProvider()

  if (provider && provider === window.ethereum) {
    startApp(provider)
    await getAccount()
  } else {
    console.log("Please install MetaMask!")
  }
}

function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?")
  }
}

window.addEventListener("load", setup)

const chainId = await window.ethereum.request({ method: "eth_chainId" })

window.ethereum.on("chainChanged", handleChainChanged)

function handleChainChanged(chainId) {
  window.location.reload()
}

async function getAccount() {
  const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error.
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.")
      } else {
        console.error(err)
      }
    })
  const account = accounts[0]
  $('#account').html(account)
}