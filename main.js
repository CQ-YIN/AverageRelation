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
}

// Function to mint an NFT
async function mintNFT(tokenId) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; // Using the first account

    return contract.methods.mintNFT(tokenId).send({ from: account });
}

// Function to update the value of an NFT
async function updateValue(tokenId, newValue) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    return contract.methods.updateValue(tokenId, web3.utils.toWei(newValue.toString(), 'ether')).send({ from: account });
}

// Function to transfer NFT
async function transferNFT(tokenId, toAddress) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    return contract.methods.transferNFT(tokenId, toAddress).send({ from: account });
}

// Example usage
mintNFT(1).then(console.log).catch(console.error);
updateValue(1, 0.5).then(console.log).catch(console.error);
transferNFT(1, '0xANOTHER_ADDRESS').then(console.log).catch(console.error);

//MBTI
document.getElementById("submitMBTI").addEventListener("click", function() {
    const mbtiType = document.getElementById("mbti").value.toUpperCase();
    const validMBTITypes = ["ENTJ", "ENFJ", "ESFJ", "ESTJ", "ENTP", "ENFP", "ESFP", "ESTP", "INTJ", "INFJ", "ISFJ", "ISTJ", "INTP", "INFP", "ISFP", "ISTP"];
   
    if (!validMBTITypes.includes(mbtiType)) {
        alert("Not a valid MBTI type.");
        return;
    }

    document.getElementById("mbtiInput").style.display = "none";
    document.querySelector(".mbti-question").style.display = "none"; // Hide the question

    const responseText = document.getElementById("responseText");
    const continueButton = document.getElementById("continueButton");

    if (mbtiType.endsWith("J")) {
        responseText.innerHTML = "Thank you for participating! Let's proceed to the project introduction.";
        continueButton.onclick = function() {
            window.location.href = "about.html"; // Ensure this is the correct path to your introduction page
        };
    } else {
        responseText.innerHTML = "NOTE: This project involves valuing relationships with numbers, which might be uncomfortable for some. Do you wish to proceed?";
        continueButton.onclick = function() {
            window.location.href = "about.html";
        };
    }

    document.getElementById("response").style.display = "block"; // Show the response
    continueButton.style.display = "block"; // Show the continue button
});


//mint
function limitDecimalPlaces(e, count) {
    if (e.target.value.indexOf('.') == -1) { return; }
    if ((e.target.value.length - e.target.value.indexOf('.')) > count) {
      e.target.value = parseFloat(e.target.value).toFixed(count);
    }
  }
  
  async function submitPrice() {
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

// Initial data load (replace with real data fetching)
window.onload = () => {
    document.getElementById('nftTitle').innerText = 'Example NFT';
    updatePriceInfo('0.5'); // Example average price
};
