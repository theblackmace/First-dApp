const pEl = document.querySelector("#output-el");
const addEl = document.querySelector("#address-el");
const dappAddress = "0x8D3cfe243208DC6c5D97744a79D17f587084c491";
var web3Instance;
const inputEl = document.querySelector('input');
var userAccount;


const scABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "userAddress",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getString",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_sample",
				"type": "string"
			}
		],
		"name": "setString",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3js = new Web3(window.ethereum);
        startApp();
      } else {
        pEl.textContent = "Please install Metamask to access this dApp";
        addEl.innerHTML = `Here's the <a href="https://metamask.io/" target="_blank">link</a> for the website`;
      }
})


async function startApp() {
	try {
		var accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		userAccount = accounts[0];
		document.querySelector("#address-el").textContent = "Your Address: "+userAccount;
		web3Instance = new web3js.eth.Contract(scABI, dappAddress);
		console.log(web3Instance);

	} catch (error) {
		console.log('Please install MetaMask to use this dApp!');
	}
}
  

document.querySelector("#changeState").addEventListener('click', function() {
	const input = inputEl.value;
	setString(input);
})

document.querySelector("#getVar").addEventListener('click', function() {
	console.log("Getting string value...");
	getString();
})


function setString(parameter) {
	console.log("Sending txn...");
    return web3Instance.methods.setString(parameter)
        .send({ from: userAccount })
        .on("receipt", function(receipt) {
            console.log("Txn Send successfully: " + receipt);
			getString();
        })
        .on("error", function(error) {
            console.log("Error occurred: " + error);
        });
}

async function getString() {
	return web3Instance.methods.getString().call()
	.then(function(result) {
		pEl.textContent = "State variable: "+result;
	});
}