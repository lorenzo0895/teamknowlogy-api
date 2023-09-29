const { collection, getDocs } = require("firebase/firestore/lite");
const { db } = require("../db");
const collec = collection(db, "mutation");

class StatsService {
  async getStats() {
    const data = await getDocs(collec);
    let count_mutations = 0;
    let count_no_mutations = 0;
    data.docs.forEach((doc) => {
      if (doc.data().hasMutation) count_mutations += 1;
      else count_no_mutations += 1;
    });
    const ratio =
      count_no_mutations === 0 ? 0 : count_mutations / count_no_mutations;
    return {
      count_mutations,
      count_no_mutations,
      ratio: Math.round(ratio * 100) / 100,
    };
  }
}

module.exports = { StatsService };
