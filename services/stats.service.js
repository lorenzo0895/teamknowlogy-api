const { collection, getDocs } = require('firebase/firestore/lite');
const { db } = require('../db');
const col = collection(db, 'mutation');

class StatsService {

  async getStats() {
    const data = await getDocs(col);
    let count_mutations = 0;
    let count_no_mutations = 0;
    data.docs.forEach((doc) => {
      if (doc.data().hasMutation) count_mutations += 1;
      else count_no_mutations += 1;
    });
    return {
      count_mutations,
      count_no_mutations,
      ratio: count_no_mutations === 0 ? 0 : count_mutations / count_no_mutations,
    };
  }
}

module.exports = { StatsService };
