const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
    // 31337
}

const developmentChains = ["hardhat", "localhost"]
const lendingPoolAddressProvider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5"
const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

module.exports = {
    networkConfig,
    developmentChains,
    lendingPoolAddressProvider,
    daiTokenAddress,
    wethTokenAddress,
}
