async function setup() {
  const provider = await window.detectEthereumProvider()

  if (provider && provider === window.ethereum) {
    startApp(provider)
    await getAccount();
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
        console.log("Please connect to MetaMask.")
      } else {
        console.error(err)
      }
    });

    $('.accountList').empty();

    const $accountSelect = $('.accountSelect');
    for (var i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const $newAccountSelect = $accountSelect.clone();
      $newAccountSelect.find('.accounts').html(account);
      $newAccountSelect.show();
      $('#accountList').append($newAccountSelect);
    }

    if (accounts.length > 0) {
      window.userAccount = accounts[0];
      $('#account').html(window.userAccount);
      localStorage.setItem("isLoggedIn", "true"); // Store login state
    }
}

document.getElementById("accountList").addEventListener("click", async (e) => {
  const selectedAccount = e.target.innerHTML.trim();

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.includes(selectedAccount)) {
      window.userAccount = selectedAccount;
      document.getElementById("account").innerText = selectedAccount;
      window.location.reload();
    } else {
      console.error("Selected account is not approved in MetaMask.");
    }
  } catch (err) {
    console.error("User denied account selection or MetaMask error:", err);
  }
});
