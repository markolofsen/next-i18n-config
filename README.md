The "next-i18n-config" module provides a convenient way to integrate multilingual support (i18n) into your Next.js application. Here's why you should consider using it:

1. **Translation Automation**: The module automatically scans your directory structure containing translations and generates TypeScript (TS) files based on JSON files. This eliminates the need to manually create TS files for each translation, saving time and reducing the chances of errors.
2. **Convenient Management**: You no longer need to manually keep track of and maintain TS files for translations. The "next-i18n-config" module handles this process for you, making translation management more convenient and efficient.
3. **Easy Integration with Next.js**: The module creates a **`next-i18next.config.js`** file for use with the Next.js library. This file contains i18n settings based on your translation structure, making the integration of i18n into your Next.js application nearly painless.
4. **Clear Naming Conventions**: Translations are organized in a hierarchical structure, making translation keys easy to understand and ensuring a structured project.
5. **Instant Access to Translations**: Thanks to the generation of TS files with translations, you can reference translations directly in your code, providing easy access and tracking of translations.

### **Installation and Configuration Instructions**

To install and configure the "next-i18n-config" module using Yarn, follow these steps:

1. Install the module as a dependency using Yarn:
    
    ```bash
    yarn add next-i18n-config
    ```
    
2. Create a directory structure for your translations. For example:
    
    ```
    nextjs root folder:
    
    public
    ├── locales
    │   ├── en
    │   │   ├── common.json
    │   │   ├── something.json
    │   ├── es
    │   │   ├── common.json
    │   │   ├── something.json
    └── ...
    
    src/
    ├── translations/
    │   ├── index.ts
    │   ├── common.ts
    │   ├── something.ts
    │   │   └── ...
    │   └── ...
    ├── ...
    
    next-i18next.config.js
    package.json
    ...
    ```
    
    - Inside the **`public/locales`** directory, create subdirectories for each language, such as **`en`** for English and **`es`** for Spanish.
    - Within each language subdirectory, place JSON files like **`common.json`** and **`something.json`** containing translations.
3. Ensure your JSON files have a hierarchical structure. For example:
    
    **`public/locales/en/common.json`**:
    
    ```json
    
    {
        "test": "Works fine!",
        "menu": {
            "main": "Main Menu",
            "privacyPolicy": "Privacy Policy"
        }
    }
    
    ```
    
4. In your JavaScript file (e.g., **`next.config.js`**), import and configure the "next-i18n-config" module as follows:
    
    ```jsx
    
    const path = require('path');
    const NextConfig = require('next-i18n-config/lib/next');
    
    const { i18n } = NextConfig({
      rootDir: path.join(__dirname, '.'),
      destDir: 'src/i18/translations',
      defaultLocale: 'en',
    });
    
    module.exports = {
      i18n,
    };
    
    ```
    
    - The module will scan the **`public/locales`** directory, collect all the JSON files, and save them in the specified **`destDir`** in TypeScript format with a hierarchical structure.
5. `**src/i18/useTranslate.ts**`
    
    ```jsx
    // useTranslate.ts
    
    // ** Third Party Import
    import { useTranslation } from 'next-i18next';
    
    // ** Local Import
    import tDict from './translations'
    
    type IUseTranslate = [
      (text: string, options?: any) => string,
      {
        i18n: any,
        locales: string[],
        languages: string[],
      }
    ]
    
    const useTranslate = (namespace: string = 'common'): IUseTranslate => {
    
      // ** Hook
      const { t, i18n }: any = useTranslation(namespace);
    
      const locales: string[] = i18n.options?.locales || []
      const suffix: string = env.isProd ? '' : `_`
      const reT = (text: string, options?: any) => `${suffix}${t(text, options)}`
    
      const languages = locales.reduce((acc: any, locale: string) => {
        switch (locale) {
          case 'en':
            acc[locale] = 'English'
            break;
          // Add cases for other languages if needed
        }
        return acc;
      }, {})
    
      return [reT, {
        i18n,
        locales,
        languages,
      }]
    }
    
    export { tDict }
    export default useTranslate
    ```
    
6. Once configured, you can import and use the translations in your project. For example:
    
    ```jsx
    
    import useTranslate, { tDict } from 'src/i18/useTranslate';
    
    const DemoPage = () => {
      const [tCommon] = useTranslate();
      const [tMain] = useTranslate('main');
    
      return (
        <div>
          {tCommon(tDict.common.title)}
          {tMain(tDict.main.title, { count: 1 })}
        </div>
      );
    };
    
    ```
    

By using "next-i18n-config," you simplify the process of managing translations and integrating i18n into your Next.js application.

If you have any questions or need further assistance, feel free to reach out to me. Happy coding!

---

**About the Author (Mark)**

- Name: Mark
- Passion: Development
- Fun Project: Created this module for fun
- GitHub: **https://github.com/markolofsen**