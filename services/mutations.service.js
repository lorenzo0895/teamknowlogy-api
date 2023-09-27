const { collection, addDoc, getDocs } = require("firebase/firestore/lite");
const { db } = require("../db");
const col = collection(db, "mutation");

_validBases = ["A", "T", "C", "G"];

/**
 * Checks if the given DNA sequence is valid.
 * @param {string | string[]} dna - The DNA sequence to check. It can be a string or an array of strings.
 * @return {boolean} Returns true if the DNA sequence is valid, otherwise returns false.
 */
function isValidBase(dna) {
  if (Array.isArray(dna)) {
    return dna.every((x) => isValidBase(x));
  } else {
    return dna.split("").every((n) => this._validBases.includes(n));
  }
}

/**
 * Checks if the given DNA sequence is NxN, meaning that each subarray has the same length as the main array.
 * @param {string[]} dnaSequence - The DNA sequence to be checked.
 * @return {boolean} Returns true if the DNA sequence is NxN, false otherwise.
 */
function isNxN(dnaSequence) {
  return dnaSequence.every((x) => x.length === dnaSequence.length);
}

/**
 * Check if the given DNA sequence is valid.
 * @param {string[]} dnaSequence - The DNA sequence to be checked.
 * @return {boolean} True if the DNA sequence is valid, false otherwise.
 */
function isValidDna(dnaSequence) {
  return isNxN(dnaSequence) && isValidBase(dnaSequence);
}

function dnaSequenceToMatrix(dnaSequence) {
  return dnaSequence.map((x) => x.split(""));
}

/**
 * @param {string[]} dnaChain - The DNA sequence to be checked.
 */
function hasMutation(dnaChain) {
  const matrix = dnaSequenceToMatrix(dnaChain);
  return hasHorizontalMutation(matrix);
}

/**
 * @param {string[][]} matrix - The DNA sequence to be checked.
 */
function hasHorizontalMutation(matrix) {
  let hasMutation = false;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const letter = matrix[i][j];
      if (
        matrix[i][j + 1] === letter &&
        matrix[i][j + 2] === letter &&
        matrix[i][j + 3] === letter
      ) {
        hasMutation = true;
        break;
      }
    }
    if (hasMutation) break;
  }
  return hasMutation;
}

/**
 * @param {string[][]} matrix - The DNA sequence to be checked.
 */
function hasVerticalMutation(matrix) {
  let hasMutation = false;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const letter = matrix[i][j];
      if (
        matrix[i + 1][j] === letter &&
        matrix[i + 2][j] === letter &&
        matrix[i + 3][j] === letter
      ) {
        hasMutation = true;
        break;
      }
    }
    if (hasMutation) break;
  }
  return hasMutation;
}

/**
 * @param {string[][]} matrix - The DNA sequence to be checked.
 */
function hasDiagonalMutation(matrix) {
  let hasMutation = false;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const letter = matrix[i][j];
      if (
        matrix[i + 1][j + 1] === letter &&
        matrix[i + 2][j + 1] === letter &&
        matrix[i + 3][j + 1] === letter
      ) {
        hasMutation = true;
        break;
      } else if (
        matrix[i - 1][j - 1] === letter &&
        matrix[i - 2][j - 1] === letter &&
        matrix[i - 3][j - 1] === letter
      ) {
        hasMutation = true;
        break;
      }
    }
    if (hasMutation) break;
  }
  return hasMutation;
}

function compareSequence(dna1, dna2) {
  if (dna1.length !== dna2.length) return false;
  for (let i = 0; i < dna1.length; i++) {
    if (dna1[i] !== dna2[i]) {
      return false;
    }
  }
  return true;
}

async function findMutation(dna) {
  const docs = await getDocs(col);
  return docs.docs.find((x) => compareSequence(x.data().dna, dna))?.data?.();
}

async function addMutation(dna, hasMutation) {
  return await addDoc(col, { dna, hasMutation });
}

module.exports = { isValidDna, hasMutation, addMutation, findMutation };
