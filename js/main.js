// main.js
const stakeNFTs = [];

document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.ready();

  lucide.createIcons();

  // Telegram user info
  if (tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    document.getElementById("username").innerText =
      "Username: @" + (user.username || "unknown");
  }

  // Navigation footer buttons
  document.querySelectorAll(".footer button[data-tab]").forEach((button) => {
    button.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");
      switchTab(tab);
    });
  });

  // Main section buttons
  document.querySelectorAll('#home button[data-tab]').forEach(button => {
    button.addEventListener('click', function () {
      const tab = this.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Button listeners
  document.getElementById("stakeNFTBtn")?.addEventListener("click", stakeNFT);

  // ✅ Initialize TonConnectUI
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://omariniesta.github.io/Omar/tasks.json',
    buttonRootId: 'ton-connect-btn'
  });

  // ✅ Listen for connection and show address
  tonConnectUI.onStatusChange(walletInfo => {
    if (walletInfo && walletInfo.account?.address) {
      const address = walletInfo.account.address;
      document.getElementById("walletAddress").innerText = address;
    } else {
      document.getElementById("walletAddress").innerText = "Not connected";
    }
  });
});

// Tab switching
function switchTab(tab) {
  document.querySelectorAll(".main").forEach((div) => div.classList.remove("active"));
  const targetSection = document.getElementById(tab);
  if (targetSection) targetSection.classList.add("active");

  document.querySelectorAll(".footer button").forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.footer button[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  lucide.createIcons();
}

// Stake NFT (local simulation)
async function stakeNFT() {
  const walletAddress = document.getElementById("walletAddress").innerText;
  if (walletAddress === "Not connected") {
    alert("Please connect your wallet first.");
    return;
  }

  const nftId = document.getElementById("nftIdInput").value.trim();
  if (!nftId) {
    alert("Enter NFT ID to stake");
    return;
  }

  stakeNFTs.push(nftId);

  const stakedNFTsContainer = document.getElementById("stakedNFTs");
  stakedNFTsContainer.innerHTML = "";
  stakeNFTs.forEach((id) => {
    stakedNFTsContainer.innerHTML += `<li>Staked NFT ID: ${id}</li>`;
  });

  alert(`NFT ${nftId} staked successfully!`);
}
