// HTML Controls
const alphabetInput = document.getElementById("alphabetInput");
const textInput = document.getElementById("textInput");
const numberOfCharactersInput = document.getElementById("d_value");
const keyInput = document.getElementById("k_value");

const encryptBtn = document.getElementById("encrypt-btn");
const dencryptBtn = document.getElementById("dencrypt-btn");

const outputareaControl = document.getElementById("outputArea");

// Global Variabels
let errorMessage = "";

let alphabetFromCOde = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z"
]

let textToCrypt = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed erat sit amet sapien vehicula posuere. Suspendisse eros ante, aliquam ac dui a, mattis vestibulum nisl. Vestibulum suscipit gravida pellentesque. Nullam at imperdiet lorem. Nam scelerisque, tortor id aliquet interdum, erat ex ullamcorper tellus, eu dapibus nunc dolor at eros. Integer eget sem ac elit aliquam scelerisque. Sed nec nulla erat. Donec sodales pellentesque tellus scelerisque tincidunt. Sed ornare efficitur erat, vel suscipit massa. Morbi tincidunt dapibus nisl, sit amet semper leo tempor id. Pellentesque rhoncus malesuada sapien, id aliquam justo dignissim convallis. Donec ac pharetra lacus. Donec nec mi id nunc lobortis aliquet ut nec tellus. Donec volutpat ex ut tellus vulputate, sed ultrices magna ultricies.";

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

	Array.from(inputText).forEach(character => {
		switch (character) {
			case ",":
			case "-":
			case "?":
			case "!":
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
				let newKeyPosition = (currentKeyPositionIndex + currentLetterIndex) > alphabet.length - 1 ?
					((currentKeyPositionIndex + currentLetterIndex) - (alphabet.length - 1)) :
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
                    if(currentLetterIndex - currentKeyPositionIndex < 0){
                    newIndex =  currentLetterIndex - currentKeyPositionIndex + alphabetArray.length -1;
                        
                        if(newIndex > alphabetArray.length-1) newIndex = newIndex - alphabetArray.length-1;

                    }else{
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
	const alphabetContentAsString =  await readFileContent(alphabetInput);
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
		
		if(alphabetInput){
			const textContentAsString =  await readFileContent(textInput);
			let individualCharacterSet = new Set();
	
			Array.from(textContentAsString).forEach(character => {
				if (character != " ")
					individualCharacterSet.add(character);
			});
			let alphabetSet = await readAlphabetFromFile();
	
	
			if(alphabetSet.length < individualCharacterSet.length){
				throw new Error ("The text have more unique character than the dictionary");
			}
	
			individualCharacterSet.forEach(chacter => {
				if (!(alphabetSet.has(chacter)) && chacter != ""){
					textInput.files[0] = null;
					throw new Error("One or more elements are not present in the dictionary");
				}
			});
	
		}else{
			throw new Error("Text cannot be validated if the alphanet dosen't exist");
		}

	} catch (error) {
		alert(`Huston, we have a problem \n${error}`);
	}
}


function EncryptFromUI(){
	try {
		// Validate if all fields are populated

		// Validate Text is Matching Alphabet Again

		// Run Function

		// Display Output


	} catch (error) {
		alert(`Huston, we have a problem \n${error}`);
	}
}

function DecryptFromUI(){
	try {
		
	} catch (error) {
		alert(`Huston, we have a problem \n${error}`);
	}
}
