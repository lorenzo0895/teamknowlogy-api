const { collection, addDoc, getDocs } = require("firebase/firestore/lite");
const { db } = require("../db");
const createHttpError = require("http-errors");
const collec = collection(db, "mutation");

class MutationsService {
  constructor(lengthMutation) {
    this._validBases = ["A", "T", "C", "G"];
    /** Posibles mutations acording to the length.
     * For example: ['AAAA', 'TTTT', 'CCCC', 'GGGG'] */
    this._possibleMutations = Array.from(this._validBases, (x) =>
      x.repeat(lengthMutation)
    );
  }

  /**
   * Checks if the given DNA sequence is valid.
   * @param {string | string[]} dna - The DNA sequence to check. It can be a string or an array of strings.
   * @return {boolean} Returns true if the DNA sequence is valid, otherwise returns false.
   */
  _isValidBase(dna) {
    if (Array.isArray(dna)) {
      return dna.every((x) => this._isValidBase(x));
    } else {
      return dna.split("").every((n) => this._validBases.includes(n));
    }
  }

  /**
   * Checks if the given DNA sequence is NxN, meaning that columns are equal to rows.
   * @param {string[]} dnaSequence - The DNA sequence to be checked.
   * @return {boolean} Returns true if the DNA sequence is NxN, false otherwise.
   */
  _isNxN(dnaSequence) {
    return dnaSequence.every((x) => x.length === dnaSequence.length);
  }

  /**
   * Check if the given DNA sequence is valid.
   * @param {string[]} dnaSequence - The DNA sequence to be checked.
   * @return {boolean} True if the DNA sequence is valid, false otherwise.
   */
  _isValidDna(dnaSequence) {
    return this._isNxN(dnaSequence) && this._isValidBase(dnaSequence);
  }

  /**
   * Converts a DNA sequence into a matrix representation.
   * @param {string[]} dnaSequence - The DNA sequence to convert.
   * @return {string[][]} The matrix representation of the DNA sequence.
   */
  _dnaSequenceToMatrix(dnaSequence) {
    return dnaSequence.map((x) => x.split(""));
  }

  async checkAndSaveMutation(dnaChain) {
    // Check if the DNA sequence is valid
    if (!dnaChain || dnaChain.length === 0) {
      throw new createHttpError(400, 'Property "dna" cannot be empty');
    }
    if (!this._isValidDna(dnaChain)) {
      throw new createHttpError(400, "Invalid DNA sequence");
    }
    const hasMutation = this.hasMutation(dnaChain);
    // Avoid inserting the same mutation
    const repeated = await this.findMutation(dnaChain);
    if (!repeated) {
      await this.addMutation(dnaChain, hasMutation);
    }
    if (!hasMutation) {
      throw new createHttpError(403, "Forbidden");
    }
  }

  hasMutation(dnaChain) {
    let total = 0;
    total += this._horizontalMutation(dnaChain);
    if (total > 1) return true;
    const matrix = this._dnaSequenceToMatrix(dnaChain);
    total += this._verticalMutation(matrix);
    if (total > 1) return true;
    total += this._diagonalMutation(matrix);
    return total > 1;
  }

  _horizontalMutation(dnaChain) {
    let count = 0;
    for (const dna of dnaChain) {
      if (this._possibleMutations.some((p) => dna.includes(p))) {
        count++;
      }
    }
    return count;
  }

  _verticalMutation(matrix) {
    let count = 0;
    const length = matrix.length;
    for (let row = 0; row < length; row++) {
      let str = "";
      for (let col = 0; col < length; col++) {
        str += matrix[col][row];
      }
      if(this._possibleMutations.some((p) => str.includes(p))) {
        count++;
      }
    }
    return count;
  }

  _diagonalMutation(matrix) {
    let count = 0;
    const length = matrix.length;
    const diagDesc = [];
    const diagAsc = [];
    for (let i = -length + 1; i <= length - 1; i++) {
      let strDesc = "";
      let strAsc = "";
      for (let j = 0; j < length - Math.abs(i); j++) {
        if (i < 0) {
          strDesc += matrix[j][j - i];
          strAsc += matrix[j][length - 1 + i - j];
        } else {
          strDesc += matrix[j + i][j];
          strAsc += matrix[j + i][length - 1 - j];
        }
      }
      diagDesc.push(strDesc);
      diagAsc.push(strAsc);
    }
    for (let i = 0; i < length*2-1; i++) {
      if (this._possibleMutations.some(p => diagAsc[i].includes(p))) {
        count++;
      }
      if (this._possibleMutations.some(p => diagDesc[i].includes(p))) {
        count++;
      }
    }
    return count;
  }

  _compareSequence(dna1, dna2) {
    if (dna1.length !== dna2.length) return false;
    for (let i = 0; i < dna1.length; i++) {
      if (dna1[i] !== dna2[i]) {
        return false;
      }
    }
    return true;
  }

  async findMutation(dna) {
    const docs = await getDocs(collec);
    return docs.docs
      .find((x) => this._compareSequence(x.data().dna, dna))
      ?.data?.();
  }

  async addMutation(dna, hasMutation) {
    return await addDoc(collec, { dna, hasMutation });
  }
}

module.exports = { MutationsService };
