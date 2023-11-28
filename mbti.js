let contract;
let signer;
let contractWithSigner;

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

