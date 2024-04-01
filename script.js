// HTML Controls
const alphabetInput = document.getElementById("alphabetInput");
const textInput = document.getElementById("textInput");

// Global Variabels
let errorMessage = "";


// const letters = (() => {
//     const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
//     return caps;
//   })();

//   console.log(letters);

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
				console.log(newKeyPosition);
				let cryptedLetter = alphabetArray[newKeyPosition];
				// Return crypted letter to crypted text
				cryptedText = cryptedText.concat(cryptedLetter);
				break;
		}
	});
	return cryptedText;
}

console.log(encrypt(
	alphabetFromCOde,
	textToCrypt.toUpperCase(),
	1,
	"SPDCP"
))

function GetKeyNumericalValue(alphabet, keyAsString, characterNumber) {
	let keyNumericalArray = [];
	let keyAsCharArray = Array.from(keyAsString);
	// console.log(keyAsCharArray)

	let maximumKeyLenght = keyAsString.length >= characterNumber ? characterNumber : keyAsString.length;

	for (let index = 0; index <= maximumKeyLenght - 1; index++) {
		keyNumericalArray.push(alphabet.indexOf(keyAsCharArray[index]));

	}
	return keyNumericalArray;

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
				// // Get Index of letter from alphabet
				// let currentLetterIndex = alphabetArray.indexOf(character);

				// // Get the "reverse" key position based on current key position
				// let currentKeyPositionIndex = (alphabet.length - 1) - numericalKey[tempKeyPosition];
				// tempKeyPosition = tempKeyPosition++ >= numericalKey.length - 1 ? 0 : tempKeyPosition++;

				// // Decrypt the letter using the "reverse" key
				// let newKeyPosition = (currentLetterIndex - currentKeyPositionIndex) < 0 ?
				// 	(currentLetterIndex + (alphabet.length - 1)) :
				// 	(currentLetterIndex - currentKeyPositionIndex);

				// // Get the decrypted letter from the alphabet
				// let decryptedLetter = alphabetArray[newKeyPosition];

				// // Add the decrypted letter to the decrypted text
				// decryptedText = decryptedText.concat(decryptedLetter);




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


/// 
console.log("DECRIPT")
console.log(decrypt(
	alphabetFromCOde,
	"EHKWF BILNF VHEHK LBM SFWM, UHGLWUMWMNK SVBIBLUBGY WEBMR FSWUWGSL LWV WKSM LBM SFWM LSIBWG OWZBUNES IHLNWKWR LNLIWGVBLLW WKHL SGMW, SEBJNSF SU VNB S, FSMMBL OWLMBTNENF GBLER OWLMBTNENF LNLUBIBM YKSOBVS IWEEWGMWLJNWR GNEESF SM BFIWKVBWM EHKWFR GSF LUWEWKBLJNW, MHKMHK BV SEBJNWM BGMWKVNF, WKSM WQ NEESFUHKIWK MWEENL, WN VSIBTNL GNGU VHEHK SM WKHLR BGMWYWK WYWM LWF SU WEBM SEBJNSF LUWEWKBLJNWR LWV GWU GNEES WKSMR VHGWU LHVSEWL IWEEWGMWLJNW MWEENL LUWEWKBLJNW MBGUBVNGMR LWV HKGSKW WXXBUBMNK WKSM, OWE LNLUBIBM FSLLSR FHKTB MBGUBVNGM VSIBTNL GBLE, LBM SFWM LWFIWK EWH MWFIHK BVR IWEEWGMWLJNW KZHGUNL FSEWLNSVS LSIBWG, BV SEBJNSF CNLMH VBYGBLLBF UHGOSEEBLR VHGWU SU IZSKWMKS ESUNLR VHGWU GWU FB BV GNGU EHTHKMBL SEBJNWM NM GWU MWEENLR VHGWU OHENMISM WQ NM MWEENL ONEINMSMW, LWV NEMKBUWL FSYGS NEMKBUBWLR",
    	1,
	"SPDCP"
))

function readAlphabet() {
	let alphabetFile = alphabetInput.files[0];
	if (!alphabetFile) {
		return Promise.reject(new Error("The alphabet file was not uploaded"));
	}

	let reader = new FileReader();
	let alphabetArray = new Set();

	return new Promise((resolve, reject) => {
		reader.readAsText(alphabetFile);
		reader.onload = function(e) {
			const alphabetExtracted = e.target.result;
			Array.from(alphabetExtracted).forEach(character => {
				switch (character) {
					case ",":
					case ";":
					case "-":
					case " ":
						break;
					default:
						alphabetArray.add(character);
						break;
				}
			});
			resolve(alphabetArray);
		};
		reader.onerror = function(error) {
			reject(error);
		};
	});
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
		let dictionaryItems = await readAlphabet().then(
			((value) => {
				return value
			}),
			((error) => {
				throw new Error(error)
			})
		);


		if (!dictionaryItems) {
			throw new Error("The dictionary cannot be build")
		}

		let textToBeReturned = "";

		reader.onload = function(e) {
			console.log("Test");
			const textExtracted = e.target.result;
			let individualCharacterSet = new Set();

			Array.from(textExtracted).forEach(character => {
				if (character != " ")
					individualCharacterSet.add(character);
			})

			// Habar nu am de ce size-ul dictionarului imi este mereu zero


			// Compare sizes of arrays
			console.log(`Text Character array size ${individualCharacterSet.size}`);
			console.log(individualCharacterSet);

			console.log(`Dictionary Character array size ${dictionaryItems.size}`);
			console.log(dictionaryItems);



			if (individualCharacterSet.size > dictionaryItems.size) {
				throw new Error("The message have more unique character than the dictionary");
			}

			individualCharacterSet.forEach(chacter => {
				if (!(dictionaryItems.has(chacter)) && chacter != "") throw new Error("One or more elements are not present in the dictionary");
			})

			return textExtracted;
		};
		console.log(textToBeReturned)
		return textToBeReturned;
	}
}

// To do

// 1. Citire alphabet din fisier text
// 2. Citire text in clar din alt fisier
// 3. Sa preia din UI D si K
// 4. Sa cripteze textul 
// 5. Sa decripteze textul