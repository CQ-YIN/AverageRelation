let contract;
let signer;
let contractWithSigner;

main();

async function main() {
    console.log("is this working?");

    // basic setup code required for all the web pages we make that interact with MetaMask and the Ethereum blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, provider);
    contractWithSigner = contract.connect(signer);
    console.log("connected???")


    //
}

// // Function to mint an NFT
// async function mintNFT(tokenId) {
//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0]; // Using the first account

//     return contract.methods.mintNFT(tokenId).send({ from: account });
// }

// // Function to update the value of an NFT
// async function updateValue(tokenId, newValue) {
//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0];

//     return contract.methods.updateValue(tokenId, web3.utils.toWei(newValue.toString(), 'ether')).send({ from: account });
// }

// // Function to transfer NFT
// async function transferNFT(tokenId, toAddress) {
//     const accounts = await web3.eth.getAccounts();
//     const account = accounts[0];

//     return contract.methods.transferNFT(tokenId, toAddress).send({ from: account });
// }

// // Example usage
// mintNFT(1).then(console.log).catch(console.error);
// updateValue(1, 0.5).then(console.log).catch(console.error);
// transferNFT(1, '0xANOTHER_ADDRESS').then(console.log).catch(console.error);


// event listeners



submitBtn.addEventListener("click", submitPrice);


//mint
function limitDecimalPlaces(e, count) {
    if (e.target.value.indexOf('.') == -1) { return; }
    if ((e.target.value.length - e.target.value.indexOf('.')) > count) {
        e.target.value = parseFloat(e.target.value).toFixed(count);
    }
}

function submitPrice() {
    const price = document.getElementById("priceInput").value;
    if (price < 0.1 || price > 10) {
        alert("Price must be between 0.1 and 10 ETH");
        return;
    }

    // Here you would send the price to your smart contract
    console.log("Submitted price: " + price + " ETH");

    // Simulating response after successful submission
    updatePriceInfo(price);
}

function updatePriceInfo(newPrice) {
    // Dummy data - replace with actual data from your smart contract or server
    const avgPrice = newPrice; // Placeholder
    document.getElementById('avgPrice').innerText = avgPrice + " ETH";

    // Update other dynamic elements as needed
}

