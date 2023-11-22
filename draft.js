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

    /////// ADD YOUR CODE BELOW THIS LINE ///////
    
    const myAddress = await signer.getAddress();
    console.log(myAddress);

    //mint an NFT when the user hits "mint" button
    mintButton.addEventListener("click", function(){
        contractWithSigner.safeMint(myAddress)
    })

    // add an event listener that listens for when a new mint
  // has happened
  contract.on("MintEvent", (tokenURI, tokenID) => {
    console.log(tokenURI);
    console.log(tokenID);

    displayImage(tokenURI);
  });

  const uri1 = await contract.tokenURI(1);

  displayImage(uri1);
}

async function displayImage(uri) {
    fetch(uri)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      mintedImage.src = data.image;
      // const jsonString = JSON.stringify(data);
      // console.log(jsonString);
    })
    .catch((error) => console.error("Error:", error));
    
}


