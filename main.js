let contract;
let signer;
let contractWithSigner;
let currentRelationshipId;

main();

//Different path for "P" and "J",
//E.g. "J" can access and mint the Relationship NFTs,
// but "P" can only look at the numbers without doing actual trans
// adding a section for people to leave and show their reason for the measurement in the website
// showing the average prices for each NFT in the portal page.

async function main() {
    console.log("is this working?");

    // basic setup code required for all the web pages we make that interact with MetaMask and the Ethereum blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, provider);
    contractWithSigner = contract.connect(signer);
    console.log("connected???")

    currentRelationshipId = submitBtn.dataset.relationshipId;


    // 1. display the average price for each relationship
    // 2. display the current owners and price history in a chart


    // DISPLAY AVERAGE PRICE

    updateAveragePrice();

    displayPriceHistory();


    //mint



    submitBtn.addEventListener('click', async function () {
        // if (!currentRelationshipId) {
        //     alert("Please select an NFT first.");
        //     return;
        // }


        console.log(currentRelationshipId);

        const priceInput = document.getElementById('priceInput').value;
        if (!isValidPrice(priceInput)) {
            alert("Invalid price. Please enter a price between 0.1 and 10 ETH.");
            return;
        }
        // 提交价格到智能合约
        try {
            const priceInWei = ethers.utils.parseEther(priceInput);
            const transactionData = contractWithSigner.interface.encodeFunctionData('safeMint', [currentRelationshipId]);

            const tx = await signer.sendTransaction({
                to: contractAddress,
                data: transactionData,
                value: priceInWei, // User-determined price
            });

            // const tx = await contractWithSigner.safeMint(currentRelationshipId);
            await tx.wait();
            console.log("Offer submitted for relationship ID " + currentRelationshipId);

            // 更新平均价格等数据
            updateAveragePrice(currentRelationshipId);
        } catch (error) {
            console.error("Error submitting offer:", error);
        }
    });

    contract.on("NFTMinted", async () => {
        console.log("NFTMinted event emitted")
        updateAveragePrice();

        const priceHistory = await contract.getPriceHistory(currentRelationshipId);
        const owners = await contract.getOwners(currentRelationshipId);

        let currentPrice = priceHistory[priceHistory.length-1];
        let currentOwner = owners[owners.length-1];

        currentPrice = ethers.utils.formatEther(+currentPrice + "");
        currentOwner = currentOwner + "";
        console.log(currentPrice, currentOwner);

        const newRow =
        `
        <div class="owner">${currentOwner}</div>
        <div class="price">${currentPrice}</div>
        `

        $('.price-history-container').append(newRow);
    })

    function isValidPrice(price) {
        const numPrice = parseFloat(price);
        return numPrice >= 0.1 && numPrice <= 10;
    }

    async function updateAveragePrice() {
        
        let averagePrice = await contract.getAveragePrice(currentRelationshipId);
        averagePrice = +averagePrice + "";
        averagePrice = ethers.utils.formatEther(averagePrice);
        document.getElementById('avgPrice').innerText = averagePrice + " ETH";
    }

    async function displayPriceHistory() {

        const priceHistory = await contract.getPriceHistory(currentRelationshipId);
        const owners = await contract.getOwners(currentRelationshipId);

        for(let i = 0; i < priceHistory.length; i++) {
            let currentPrice = priceHistory[i];
            let currentOwner = owners[i]

            currentPrice = ethers.utils.formatEther(+currentPrice + "");
            currentOwner = currentOwner + "";
            console.log(currentPrice, currentOwner);

            const newRow =
            `
            <div class="owner">${currentOwner}</div>
            <div class="price">${currentPrice}</div>
            `

            $('.price-history-container').append(newRow);
        }

        console.log(priceHistory, owners)

//         function drawChart(data) {
//     const ctx = document.getElementById('priceHistoryChart').getContext('2d');
//     const myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: data.labels,
//             datasets: [{
//                 label: 'Price History',
//                 data: data.prices,
//                 backgroundColor: 'rgba(0, 123, 255, 0.2)',
//                 borderColor: 'rgba(0, 123, 255, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: false
//                 }
//             }
//         }
//     });
// }


        // get the price history of the current relationship
        // loop through the array of prices
        // loop through the array of owners
        // create a .row div and store the information in there
        // add the row to the container
    }

    async function getCurrentOwner(tokenId) {
        try {
            const ownerAddress = await contractWithSigner.ownerOf(tokenId);
            console.log("Current owner:", ownerAddress);
            document.getElementById('currentOwner').innerText = ownerAddress;
        } catch (error) {
            console.error("Error fetching current owner:", error);
        }
    }
}

function limitDecimalPlaces(e, count) {
    if (e.target.value.indexOf('.') == -1) { return; }
    if ((e.target.value.length - e.target.value.indexOf('.')) > count) {
        e.target.value = parseFloat(e.target.value).toFixed(count);
    }
}


// let num = 1;
// for(let i = 1; i <= 10; i++) {
//     num*=i;
//     console.log(num);
// }