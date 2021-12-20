let currentAccount = null;
let web3;
let abi;
let contactAddress = '0xB16bEc01bfe4F13D5e85A2F75F51893D797Df1F7';

function handleAccountsChanged(accounts) {
  console.log('Calling HandleChanged')

  if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
      $('#btn-connect-text').html('Connect with Metamask')
  } else if (accounts[0] !== currentAccount) {
    console.log('masuk sini')
    
    currentAccount = accounts[0];
    $('#btn-connect-text').html(currentAccount)
    $('#status').html('')

    if(currentAccount != null) {
      // Set the button label
      $('#btn-connect-text').html(currentAccount)
    }
  }
  console.log('WalletAddress in HandleAccountChanged ='+currentAccount)
}

function detectMetaMask() {
  if (typeof window.ethereum !== 'undefined') {                
      return true
  } else {                
      return false
  }
}
function connect() {
  console.log('Calling connect()')
  ethereum
  .request({ method: 'eth_requestAccounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log('Please connect to MetaMask.');
      $('#status').html('You refused to connect Metamask')
    } else {
      console.error(err);
    }
  });
}

$('.btn-connect').click(function(){
    console.log('hi saya masuk untuk connect');
    connect();

});