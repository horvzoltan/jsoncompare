import "regenerator-runtime/runtime";
const firstFileContainer = document.getElementById("result1");
const secondFileContainer = document.getElementById("result2");
const longerKeyContainer = document.getElementById("result3");
const validElement = document.getElementById("valid");
const errorElement = document.getElementById("error");

let result = [];
let files = [];
let secondFile = null;
let isValid;

document.getElementById("selectFile").addEventListener("change", function (ev) {
  loadFile(ev, firstFileContainer).then((array) => {
    files = array;
    files.forEach((f) => {
      combineTwoFiles(files[0], f);
    });
  });
});

document
  .getElementById("selectSecondFile")
  .addEventListener("change", function (ev) {
    loadFile(ev, secondFileContainer).then((array) => {
      secondFile = array[0];
      validateStructure(files[0], secondFile).then((p) => {
        isValid = p;
      });
    });
  });

document.getElementById("reset").addEventListener("click", function () {
  reset();
});

document.getElementById("download").addEventListener("click", function () {
  if (result.length === 0) return;
  downloadResult();
});

document.getElementById("validate").addEventListener("click", function (ev) {
  if (!files || !secondFile || !isValid) {
    errorElement.textContent =
      "You need to select files in both files selectors.";
    return;
  }
  errorElement.textContent = "";
  firstFileContainer.value = JSON.stringify(files[0], null, "\t");
  secondFileContainer.value = JSON.stringify(secondFile, null, "\t");
  iterate(files[0], secondFile);
  longerKeyContainer.textContent = JSON.stringify(result, null, "\t");
});

const downloadResult = () => {
  download("result", JSON.stringify(result, null, "\t"));
};

const validateStructure = async (obj, obj2) => {
  if (shallowEqual(obj, obj2)) {
    validElement.textContent = "The json file structure is identical!";
    return true;
  }
  validElement.style.color = "red";
  validElement.textContent = "The json file structure is not identical!";
  return false;
};

const reset = () => {
  document.getElementById("small-form").reset();
  document.getElementById("valid").textContent = "";
  document.getElementById("error").textContent = "";
  longerKeyContainer.textContent = "";
  files = null;
  result = [];
};

const iterate = (obj, obj2) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      iterate(obj[key], obj2[key]);
    }
    if (obj[key]?.length < obj2[key]?.length) {
      result.push({ key: key, value: obj2[key] });
    }
  });
};

const combineTwoFiles = (obj, obj2) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      combineTwoFiles(obj[key], obj2[key]);
    }

    if (obj[key]?.length < obj2[key]?.length) {
      obj[key] = obj2[key];
    }
  });
};

const shallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key]?.value !== object2[key]?.value) {
      return false;
    }
  }

  return true;
};

// Function for file loading
const loadFile = async (ev, container) => {
  let currentFiles = [];
  let filesTestArray = [];

  await Array.from(ev.currentTarget.files).forEach((file) =>
    currentFiles.push(file)
  );

  longerKeyContainer.textContent = "";
  result = [];

  // Abort file reading if no file was selected
  if (!currentFiles[0]) return;

  for (const value of currentFiles) {
    const index = currentFiles.indexOf(value);
    if (index > 0) {
      if (
        !(await validateStructure(
          filesTestArray[0],
          await readFileAsText(value)
        ))
      ) {
        console.log("123");
        return;
      }
    }
    filesTestArray.push(await readFileAsText(value));
  }

  return new Promise((resolve, reject) => {
    resolve(filesTestArray);
  });
};

// Function for reading the uploaded file as a text
const readFileAsText = async (file) => {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader();

    fr.onload = function () {
      resolve(JSON.parse(fr.result));
    };

    fr.onerror = function () {
      reject(fr);
    };

    fr.readAsText(file);
  });
};

// Function for downloading the result
const download = (filename, text) => {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
