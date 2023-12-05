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


//mint
function limitDecimalPlaces(e, count) {
    if (e.target.value.indexOf('.') == -1) { return; }
    if ((e.target.value.length - e.target.value.indexOf('.')) > count) {
        e.target.value = parseFloat(e.target.value).toFixed(count);
    }
}


document.getElementById('submitPriceBtn').addEventListener('click', async function() {
    if (!currentRelationshipId) {
        alert("Please select an NFT first.");
        return;
    }

    const priceInput = document.getElementById('priceInput').value;
    if (!isValidPrice(priceInput)) {
        alert("Invalid price. Please enter a price between 0.1 and 10 ETH.");
        return;
    }

    // 提交价格到智能合约
    try {
        const priceInWei = ethers.utils.parseEther(priceInput);
        const tx = await contractWithSigner.submitOffer(currentRelationshipId, priceInWei);
        await tx.wait();
        console.log("Offer submitted for relationship ID " + currentRelationshipId);

        // 更新平均价格等数据
        updateAveragePrice(currentRelationshipId);
    } catch (error) {
        console.error("Error submitting offer:", error);
    }
});

function isValidPrice(price) {
    const numPrice = parseFloat(price);
    return numPrice >= 0.1 && numPrice <= 10;
}

async function updateAveragePrice(relationshipId) {
    try {
        // 使用contractWithSigner调用智能合约中的getAveragePrice函数
        const averagePriceWei = await contractWithSigner.getAveragePrice(relationshipId);
        
        // 将从智能合约返回的价格（单位为wei）转换为以太（ETH）
        const averagePriceEth = ethers.utils.formatEther(averagePriceWei);
        
        // 更新页面上的元素以显示平均价格
        document.getElementById('avgPrice').innerText = averagePriceEth + " ETH";

    } catch (error) {
        console.error("Error fetching updated data:", error);
    }
}

async function getCurrentOwner(tokenId) {
    try {
        const ownerAddress = await contractWithSigner.ownerOf(tokenId);
        console.log("Current owner:", ownerAddress);
        // 更新网页上的元素以显示当前所有者
        document.getElementById('currentOwner').innerText = ownerAddress;
    } catch (error) {
        console.error("Error fetching current owner:", error);
    }
}