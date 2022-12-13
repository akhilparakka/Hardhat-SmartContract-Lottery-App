const { network, run } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const verify = async (contractAddress, args) => {
    if (!developmentChains.includes(network.name)) {
        console.log("verifying Contract...")
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: args,
            })
        } catch (e) {
            if (e.message.toLowerCase().includes("already verified")) {
                console.log("Already Verified!!")
            } else {
                console.log(e)
            }
        }
    }
}

module.exports = {
    verify,
}
