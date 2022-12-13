const { assert, expect } = require("chai")
const { network, ethers, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains, networkConfig } = require("../../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", () => {
          let raffle, deployer, entranceFee
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              entranceFee = await raffle.getEntranceFee()
          })

          describe("fulfillRandomWords", () => {
              it("Works with live Chainlink Keepers and Chainlink VRF, get a random WInner", async () => {
                  console.log("Setting up test...")

                  const startingTimeStamp = await raffle.getLatesTimeStamp()
                  const accounts = await ethers.getSigners()

                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Winner Picked, Event Fired!")

                          try {
                              const recentWinner = await raffle.getRecentWinner()
                              const raffleState = await raffle.getRaffleState()
                              const winnerBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await raffle.getLatesTimeStamp()

                              await expect(raffle.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerBalance.toString(),
                                  winnerStartingBalance.add(entranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })
                      console.log("Entering Raffle..")
                      const tx = await raffle.enterRaffle({ value: entranceFee })
                      await tx.wait(1)
                      console.log("Ok, time to wait...")
                      const winnerStartingBalance = await accounts[0].getBalance()
                  })
              })
          })
      })
