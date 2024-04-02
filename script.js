// HTML Controls
const alphabetInput = document.getElementById("alphabetInput");
const textInput = document.getElementById("textInput");
const numberOfCharactersInput = document.getElementById("d_value");
const keyInput = document.getElementById("k_value");

const encryptBtn = document.getElementById("encrypt-btn");
const dencryptBtn = document.getElementById("dencrypt-btn");

const outputareaControl = document.getElementById("outputArea");

// Global Variabels

function GetKeyNumericalValue(alphabet, keyAsString, characterNumber) {
	let keyNumericalArray = [];
	let keyAsCharArray = Array.from(keyAsString);

	let maximumKeyLenght = keyAsString.length >= characterNumber ? characterNumber : keyAsString.length;

	for (let index = 0; index <= maximumKeyLenght - 1; index++) {
		keyNumericalArray.push(alphabet.indexOf(keyAsCharArray[index]));

	}
	return keyNumericalArray;

}

function encrypt(alphabet, inputText, characterNumber, key) {
	let alphabetArray = Array.from(alphabet);
	let numericalKey = GetKeyNumericalValue(alphabetArray, key, characterNumber);

	let cryptedText = "";
	let tempKeyPosition = 0;

	console.log(inputText);
	console.log(numericalKey);

	console.log(`Alphabet Array Length ${alphabet.length}`)

	Array.from(inputText).forEach(character => {
		switch (character) {
			case ",":
			case "-":
			case "?":
			case "!":
			case ".":
			case "-":
			case "'":
			case ":":
			case "\n":
			case " ":
				cryptedText = cryptedText.concat(character);
				break

			default:
				// Get Index of letter from alphabet
				let currentLetterIndex = alphabetArray.indexOf(character);
				// Get Index of current Key Letter compared to key number
				let currentKeyPositionIndex = numericalKey[tempKeyPosition];
				tempKeyPosition = tempKeyPosition++ >= numericalKey.length - 1 ? 0 : tempKeyPosition++;
				// Combine those 2 keys
				let newKeyPosition = (currentKeyPositionIndex + currentLetterIndex) > alphabetArray.length - 1 ?
					((currentKeyPositionIndex + currentLetterIndex) - (alphabetArray.length -1)) :
					(currentKeyPositionIndex + currentLetterIndex)
				// Get element from that position.
				let cryptedLetter = alphabetArray[newKeyPosition];
				// Return crypted letter to crypted text
				cryptedText = cryptedText.concat(cryptedLetter);
				break;
		}
	});
	return cryptedText;
}



function decrypt(alphabet, inputText, characterNumber, key) {
	let alphabetArray = Array.from(alphabet);
	let numericalKey = GetKeyNumericalValue(alphabetArray, key, characterNumber);

	let decryptedText = "";
	let tempKeyPosition = 0;

	Array.from(inputText).forEach(character => {
		switch (character) {
			case ",":
			case "-":
			case "?":
			case "!":
			case ".":
			case "-":
			case "'":
			case ":":
			case "\n":
			case " ":
				decryptedText = decryptedText.concat(character);
				break;

			default:

				// 1. Get Index of the crypted letter
				let currentLetterIndex = alphabetArray.indexOf(character);

				// 2. Get the key element

				let currentKeyPositionIndex = numericalKey[tempKeyPosition];
				tempKeyPosition = tempKeyPosition++ >= numericalKey.length - 1 ? 0 : tempKeyPosition++;

				// 3. Remove the key element

				let newIndex;
				if (currentLetterIndex - currentKeyPositionIndex < 0) {
					newIndex = currentLetterIndex - currentKeyPositionIndex + alphabetArray.length - 1;

					if (newIndex > alphabetArray.length - 1) newIndex = newIndex - alphabetArray.length - 1;

				} else {
					newIndex = currentLetterIndex - currentKeyPositionIndex
				}
				// 4. Get the value from the alphabet
				let decryptedLetter = alphabetArray[newIndex];
				// 5. Add the decrypted value to the string
				decryptedText = decryptedText.concat(decryptedLetter);

				break;
		}
	});
	return decryptedText;
}


async function readFileContent(fileDOMElement) {
	let file = fileDOMElement.files[0];

	if (!file) {
		throw new Error("File does not exist in the element");
	}

	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.onload = (e) => {
			resolve(e.target.result);
		};
		reader.onerror = (e) => {
			reject(new Error("Error reading file:", e));
		};
		reader.readAsText(file);
	});
}


async function readAlphabetFromFile() {
	const alphabetContentAsString = await readFileContent(alphabetInput);
	let alphabetSet = new Set();

	await Array.from(alphabetContentAsString).forEach(character => {
		switch (character) {
			case ",":
			case ";":
			case "-":
			case " ":
				break;
			default:
				alphabetSet.add(character);
				break;
		}
	});
	return alphabetSet;
}


function OnAlphabetIsChanged() {
	textInput.setAttribute("disabled", true);
	let alphabetFile = alphabetInput.files[0];
	if (alphabetFile) textInput.removeAttribute("disabled");
}



async function ValidateTextIsMatchingAlphabet() {
	try {

		if (alphabetInput) {
			const textContentAsString = await readFileContent(textInput);
			let individualCharacterSet = new Set();

			Array.from(textContentAsString).forEach(character => {
				if (character != " ")
					individualCharacterSet.add(character);
			});
			let alphabetSet = await readAlphabetFromFile();


			if (alphabetSet.length < individualCharacterSet.length) {
				throw new Error("The text have more unique character than the dictionary");
			}

			individualCharacterSet.forEach(chacter => {
				if (
					!(alphabetSet.has(chacter)) && 
					chacter != " " && 
					chacter != "." && 
					chacter != "," && 
					chacter != "?" && 
					chacter != "!" &&
					chacter != "-" &&
					chacter != "'" &&
					chacter != "\n" &&
					chacter != ":") {
					console.log(`Character not found is ${chacter}`)
					throw new Error("One or more elements are not present in the dictionary " + chacter.charCodeAt(0));
				}
			});

		} else {
			throw new Error("Text cannot be validated if the alphanet dosen't exist");
		}

	} catch (error) {
		alert(`Huston, we have a problem \n${error}`);
	}
}


async function EncryptFromUI() {
	try {
		// Validate if all fields are populated
		if (
			(alphabetInput != null) &&
			(textInput != null) &&
			ValidateKey() &&
			ValidateCharacterNumber()
		) {

			let alphabetSet = await readAlphabetFromFile();
			let textContentAsString = await readFileContent(textInput);
			let numberOfCharacters = numberOfCharactersInput.value;
			let key = keyInput.value;

			let encryptedText = encrypt(
				alphabetSet,
				textContentAsString,
				numberOfCharacters,
				key
			)

			ClearOutputResult();
			outputareaControl.value = encryptedText;

		}
	} catch (error) {
		alert(`Huston, we have a problem \n${error}`);
	}
}

async function DecryptFromUI() {
	try {
		// Validate if all fields are populated
		if (
			(alphabetInput != null) &&
			(textInput != null) &&
			ValidateKey() &&
			ValidateCharacterNumber()
		) {

			let alphabetSet = await readAlphabetFromFile();
			let textContentAsString = await readFileContent(textInput);
			let numberOfCharacters = numberOfCharactersInput.value;
			let key = keyInput.value;

			let decryptedText = decrypt(
				alphabetSet,
				textContentAsString,
				numberOfCharacters,
				key
			)

			ClearOutputResult();
			outputareaControl.value = decryptedText;

		}
	} catch (error) {
		alert(`Huston, we have a problem \n${error}`);
	}
}


function ValidateCharacterNumber() {
	let numberOfCharacters = numberOfCharactersInput.value;
	let key = keyInput.value;
	if (numberOfCharacters != null) {
		if (numberOfCharacters > key.length) {
			throw new Error("The number of characters from the key should be less or at least the size of the key")
		}
	} else {
		throw new Error("Number of characters from key should not be null !")
	}
	return true;
}

function ValidateKey() {
	let key = keyInput.value;

	if (key == null) {
		throw new Error("The key should contain a value")
	}
	return true
}

function ClearOutputResult() {
	console.log(outputareaControl.children);
	if (outputareaControl.hasChildNodes) {
		outputareaControl.value = "";
	}
}