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
	// let alphabetFile = alphabetInput.files[0];
	// if (!alphabetFile) {
	// 	return Promise.reject(new Error("The alphabet file was not uploaded"));
	// }

	// let reader = new FileReader();
	// let alphabetArray = new Set();

	// return new Promise((resolve, reject) => {
	// 	reader.readAsText(alphabetFile);
	// 	reader.onload = function(e) {
	// 		const alphabetExtracted = e.target.result;
	// 		
	// 		resolve(alphabetArray);
	// 	};
	// 	reader.onerror = function(error) {
	// 		reject(error);
	// 	};
	// });

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
							console.log("RT")
							alphabetSet.add(character);
							break;
					}
				});

		console.log(alphabetSet)
		return alphabetSet;
}


function OnAlphabetIsChanged() {
	textInput.setAttribute("disabled", true);
	let alphabetFile = alphabetInput.files[0];
	if (alphabetFile) textInput.removeAttribute("disabled");
}



async function readText() {
	let textInputFile = textInput.files[0];
	if (!textInputFile) {
		errorMessage = errorMessage.concat("The text file was not uploaded");
		throw new Error("The text file was not uploaded");
	} else {
		let reader = new FileReader();
		let textArray = [];

		reader.readAsText(textInputFile);
		let textToBeReturned = await readAlphabetFromFile().
        then(
			((value) => {

                if (!value) {
                    throw new Error("The dictionary cannot be build")
                }




                let textToBeReturned = reader.onload = function(e) {
                    const textExtracted = e.target.result;
                    let individualCharacterSet = new Set();
        
                    Array.from(textExtracted).forEach(character => {
                        if (character != " ")
                            individualCharacterSet.add(character);
                    })
        
                    if (individualCharacterSet.size > value.size) {
                        throw new Error("The message have more unique character than the dictionary");
                    }
        
                    individualCharacterSet.forEach(chacter => {
                        if (!(value.has(chacter)) && chacter != "") throw new Error("One or more elements are not present in the dictionary");
                    })
        
                    return e.target.result
                };


				return textToBeReturned





			}),
			((error) => {
				throw new Error(error)
			})
		);



		console.log(textToBeReturned);
		return textToBeReturned;
	}
}
