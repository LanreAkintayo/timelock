const currentTime = require("./currentTime")


async function increaseTimeBy(difference) {
  await network.provider.send("evm_increaseTime", [difference])
}

async function increaseTimeTo(target) {
 const now = await currentTime()

 if (target < now) {
  throw Error(
   `Cannot increase current time to a moment in the past`
  )
 }

 let difference = target - now;

 const result = await increaseTimeBy(difference)

 return result;
}

module.exports = increaseTimeTo