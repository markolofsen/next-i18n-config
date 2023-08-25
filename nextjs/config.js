const fs = require('fs');
const path = require('path');

class TranslationGenerator {
  constructor(rootDir, destDir, defaultLocale = 'en') {
    // this.rootDir = path.join(__dirname, '.');
    this.rootDir = rootDir;
    this.destDir = path.join(this.rootDir, destDir);

    // console.log({ rootDir: this.rootDir });
    // console.log({ destDir: this.destDir });

    this.defaultLocale = defaultLocale;
    this.localesDir = path.join(this.rootDir, 'public/locales');
    this.defaultSrc = path.join(this.localesDir, this.defaultLocale);

    this.locales = fs.readdirSync(this.localesDir)
  }

  get i18n() {
    return {
      defaultLocale: this.defaultLocale,
      locales: fs.readdirSync(this.localesDir),
      localeDetection: true,
    };
  }

  async makeNextI18NextConfig() {
    const nextI18NextConfigPath = path.join(__dirname, 'next-i18next.config.js');

    const nextI18NextContent = await fs.readFileSync(nextI18NextConfigPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file: ${nextI18NextConfigPath}`, err);
        return;
      }

      // console.log({ updatedData })
      // console.log({ defaultLocale: this.defaultLocale })
      // console.log({ locales: this.locales })

      return updatedData;
    });

    const ns = await fs.readdirSync(this.defaultSrc).map(file => path.basename(file, '.json'))

    const content = nextI18NextContent.toString()
      .replace('_DEFAULT_LOCALE_', `'${this.defaultLocale}'`)
      .replace('_LOCALES_', this.locales.map(locale => `'${locale}'`).join(', '))
      .replace('__NS__', ns.map(n => `'${n}'`).join(', '))

    // console.log({ content })

    const nextI18NextConfigPathNew = path.join(this.rootDir, 'next-i18next.config.js');
    await fs.writeFileSync(nextI18NextConfigPathNew, content);
  }

  buildTranslationStructure(jsonData, objectPath = []) {
    if (Array.isArray(jsonData)) {
      return jsonData.map((item, index) =>
        this.buildTranslationStructure(item, [...objectPath, index])
      );
    }

    if (typeof jsonData === 'object' && jsonData !== null) {
      const result = {};

      Object.entries(jsonData).forEach(([key, value]) => {
        result[key] = this.buildTranslationStructure(value, [...objectPath, key]);
      });

      return result;
    }

    return [...objectPath].join('.');
  }

  processJSONFile(file) {
    if (path.extname(file) === '.json') {
      const fileName = path.basename(file, '.json');
      const srcFilePath = path.join(this.defaultSrc, file);
      const destFilePath = path.join(this.destDir, `${fileName}.ts`);

      const fileContent = fs.readFileSync(srcFilePath, 'utf8');
      const jsonData = JSON.parse(fileContent);

      const translationStructure = this.buildTranslationStructure(jsonData);
      const tsContent = `const translations = ${JSON.stringify(
        translationStructure,
        null,
        2
      )};

export default translations;`;

      fs.writeFile(destFilePath, tsContent, (err) => {
        if (err) {
          console.error(`Error writing file: ${destFilePath}`, err);
        } else {
          console.log(`TS file with translation structure saved in ${destFilePath}`)
        }
      });
    }
  }

  generateTranslations() {
    if (fs.existsSync(this.destDir)) {
      fs.rmSync(this.destDir, { recursive: true });
    }

    fs.mkdirSync(this.destDir, { recursive: true });

    fs.readdir(this.defaultSrc, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${this.defaultSrc}`, err);
      } else {
        files.forEach(this.processJSONFile.bind(this));

        const indexFilePath = path.join(this.destDir, 'index.ts');
        const importStatements = files
          .filter((file) => path.extname(file) === '.json')
          .map(
            (file) =>
              `import ${path.basename(file, '.json')} from './${path.basename(
                file,
                '.json'
              )}';`
          )
          .join('\n');

        const indexContent = `${importStatements}

export default {
  ${files.map((file) => path.basename(file, '.json')).join(',\n  ')}
};`;

        fs.writeFile(indexFilePath, indexContent, (writeErr) => {
          if (writeErr) {
            console.error(`Error writing file: ${indexFilePath}`, writeErr);
          } else {
            console.log(`File index.ts created in ${indexFilePath}`);
          }
        });

      }
    });
  }


}



module.exports = async ({ rootDir, destDir, defaultLocale = 'en' }) => {
  const generator = new TranslationGenerator(rootDir, destDir, defaultLocale);
  await generator.generateTranslations();
  await generator.makeNextI18NextConfig();

  return generator;
};

