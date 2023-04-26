const firstFileContainer = document.getElementById('result1');
const secondFileContainer = document.getElementById('result2');
const longerKeyContainer = document.getElementById('result3');

let firstAsObject = null;
let secondAsObject = null;

const longerValues = [];

document.getElementById("selectFile").addEventListener("change", function (ev) {
  let file = ev.currentTarget.files[0];

  // Abort file reading if no file was selected
  if (!file) return;

  readFileAsText(file).then((fileContent) => {
    // Print file content on the console
    firstFileContainer.value = fileContent;
  });
}, false);

document.getElementById("selectSecondFile").addEventListener("change", function (ev) {
  let file = ev.currentTarget.files[0];

  // Abort file reading if no file was selected
  if (!file) return;

  readFileAsText(file).then((fileContent) => {
    secondFileContainer.value = fileContent;
  });
}, false);

document.getElementById("validate").addEventListener("click", function (ev) {
  if (!firstFileContainer.value || !secondFileContainer.value) {
    document.getElementById("error").textContent = 'You need to select 2 files.'
    return
  }
  ;
  document.getElementById("error").textContent = '';
  firstAsObject = JSON.parse(firstFileContainer.value);
  secondAsObject = JSON.parse(secondFileContainer.value);
  const validElement = document.getElementById("valid");

  if (shallowEqual(firstAsObject, secondAsObject)) {
    validElement.textContent = 'The json file structure is identical!'
  } else {
    validElement.style.color = 'red';
    validElement.textContent = 'The json file structure is not identical!'
  }

  iterate(firstAsObject, secondAsObject);
  longerKeyContainer.textContent = longerValues.join(' || ');
}, false);


const iterate = (obj, obj2) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      iterate(obj[key], obj2[key]);
    }

    if(obj[key].length < obj2[key].length){
      longerValues.push(key);
    }
  })
}

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key].value !== object2[key].value) {
      return false;
    }
  }

  return true;
}

function readFileAsText(file) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve(fr.result);
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsText(file);
  });
}
