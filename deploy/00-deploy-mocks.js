const { network } = require("hardhat")
const { developmentChains, BASE_FEE, GAS_PRICE_LINK } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (developmentChains.includes(network.name)) {
        console.log("Local Network Detected! Deploying Mocks...")

        const args = [BASE_FEE, GAS_PRICE_LINK]

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
        log("Mocks Deployed!")
        log("-------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
