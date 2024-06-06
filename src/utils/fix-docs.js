const fs = require('fs');
const path = require('path');

// Cesta k původnímu souboru
const originalFilePath = path.join(__dirname, '../extensions/documentation/documentation/1.0.0/full_documentation.json');
// Cesta k novému souboru
const newFilePath = path.join(__dirname, '../extensions/documentation/documentation/1.0.0/capa-boost.docs.json');

// Funkce pro načtení obsahu souboru
function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

// Funkce pro zápis obsahu do souboru
function writeFileAsync(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

// Funkce pro získání všech složek v adresáři
function getDirectories(source) {
  return fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// Funkce pro načtení obsahu všech JSON souborů v dané složce
async function readJsonFilesInDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));
  const contents = {};

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const data = await readFileAsync(filePath);
    Object.assign(contents, data);
  }

  return contents;
}

// Hlavní funkce pro zpracování
async function processFiles() {
  try {
    // Načtení původního souboru
    const originalData = await readFileAsync(originalFilePath);

    // Získání všech složek v ./src/api
    const apiDirectories = getDirectories(path.join(__dirname, '../api'));

    const allPaths = {};

    // Procházení každé složky entity
    for (const dir of apiDirectories) {
      const pathsDir = path.join(__dirname, `../api/${dir}/documentation-custom/paths`);

      if (fs.existsSync(pathsDir) && fs.lstatSync(pathsDir).isDirectory()) {
        // Načtení obsahu všech JSON souborů ve složce paths
        const pathsContent = await readJsonFilesInDirectory(pathsDir);
        Object.assign(allPaths, pathsContent);
      }
    }

    // Přidání načtených paths do původního obsahu
    originalData.paths = { ...originalData.paths, ...allPaths };

    // Zápis do nového souboru
    await writeFileAsync(newFilePath, originalData);
    console.log('New file created: capa-boost.docs.json');
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Spuštění hlavní funkce
processFiles();
