const { getNamedAccounts, ethers } = require("hardhat")
const { getWeth, AMOUNT } = require("../scripts/getWeth")
const {
    lendingPoolAddressProvider,
    wethTokenAddress,
} = require("../hardhat-helper-config.js")

async function main() {
    //the protocol treats everything as an ERC20 token
    await getWeth()
    const { deployer } = await getNamedAccounts()

    //*Interact with aave
    //we need abi and contracts

    //Lending pool Address Provider: 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    //Lending Pool: ^

    const lendingPool = await getLendingPool(deployer)
    console.log(`LendingPool Address: ${lendingPool.address}`)

    const wethContract = await ethers.getContractAt("IWeth", wethTokenAddress)

    //*Deposit
    let balance = await wethContract.balanceOf(deployer)
    console.log(
        `Your eth Balance before depositing ${AMOUNT} ETH is ${balance}`
    )
    await getBorrowUserData(lendingPool, deployer)
    //approve
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Depositing...")
    const depositTx = await lendingPool.deposit(
        wethTokenAddress,
        AMOUNT,
        deployer,
        0
    )
    console.log("Deposited")
    await getBorrowUserData(lendingPool, deployer)

    //*withdraw
    await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
    console.log("Withdrawing...")
    await lendingPool.withdraw(wethTokenAddress, AMOUNT, deployer)
    console.log("Withdrawn")
    await getBorrowUserData(lendingPool, deployer)

    balance = await wethContract.balanceOf(deployer)
    console.log(`Your eth Balance after withdrawing is ${balance} WETH`)

    //*withdraw again or try setinterval
    const { totalCollateralETH } = await lendingPool.getUserAccountData(
        deployer
    )
    await approveErc20(
        wethTokenAddress,
        lendingPool.address,
        totalCollateralETH,
        deployer
    )
    console.log("Withdrawing...")
    await lendingPool.withdraw(wethTokenAddress, totalCollateralETH, deployer)
    console.log("Withdrawn")
    await getBorrowUserData(lendingPool, deployer)

    balance = await wethContract.balanceOf(deployer)
    console.log(`Your eth Balance after withdrawing again is ${balance} WETH`)
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH } = await lendingPool.getUserAccountData(account)
    console.log(
        `You have ${ethers.utils.formatEther(
            totalCollateralETH
        )} worth of ETH deposited.`
    )
    return { totalCollateralETH }
}

async function getLendingPool(account) {
    const lendingPoolAddressesprovider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        lendingPoolAddressProvider,
        account
    )

    const lendingPoolAddress =
        await lendingPoolAddressesprovider.getLendingPool()
    const lendingPool = await ethers.getContractAt(
        "ILendingPool",
        lendingPoolAddress,
        account
    )

    return lendingPool
}

async function approveErc20(
    erc20Address,
    spenderAddress,
    amountToSpend,
    account
) {
    const erc20Token = await ethers.getContractAt(
        "IERC20",
        erc20Address,
        account
    )
    const tx = await erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)
    console.log("Approved!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
