import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // 1. Specifieer de bestanden die linten
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  
  // 2. Definieer de globale variabelen voor de browseromgeving
  { languageOptions: { globals: globals.browser } },

  // 3. Voeg de aanbevolen configuraties toe voor JavaScript en React
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  // 4. Pas de regels aan volgens de team-standaarden
  {
    rules: {
      // 5. 'no-unused-vars' op 'warn' zetten in plaats van 'error'
      "no-unused-vars": ["warn"], // Zet de waarschuwing op 'warn' voor onbenutte variabelen. 
      // Dit maakt het minder strikt dan 'error', wat betekent dat deze code geen build zal breken, maar een waarschuwing geeft.
      
      // 6. 'no-self-assign' uitschakelen
      "no-self-assign": "off", // Schakelt de regel uit die waarschuwt voor zelftoewijzing van een variabele (bijvoorbeeld: `a = a`).
      // Dit kan voorkomen in gegenereerde of tijdelijke code, maar de waarschuwing kan vaak onterecht zijn voor bepaalde gevallen.

      // 7. 'no-empty' uitschakelen
      "no-empty": "off", // Schakelt de regel uit die waarschuwt voor lege blokken (bijvoorbeeld `{}`). 
      // Dit komt vaak voor in auto gegenereerde code of tijdelijke constructies waar een blok wel moet bestaan maar leeg is.

      // 8. 'no-useless-escape' uitschakelen
      "no-useless-escape": "off", // Schakelt de regel uit die waarschuwt voor onnodige escape-tekensequenties (bijvoorbeeld: `\\*`).
      // Deze regel kan niet altijd van toepassing zijn op een project met veel dynamische strings of speciale tekens.

      // 9. '@typescript-eslint/require-await' uitschakelen
      "@typescript-eslint/require-await": "off", // Schakelt de regel uit die vereist dat je `async` functies altijd een `await`-uitdrukking bevatten.
      // Dit is handig als je bijvoorbeeld een `async` functie hebt die geen `await` gebruikt, maar die toch nodig is voor andere redenen (zoals promises of API calls).

      // 10. 'no-constant-condition' uitschakelen
      "no-constant-condition": "off", // Schakelt de regel uit die waarschuwt voor constante voorwaarden in statements (bijvoorbeeld `if (true)`).
      // Dit komt vaak voor in gegenereerde code of tijdens debugging, maar is meestal geen probleem in dat geval.

      // 11. 'no-control-regex' uitschakelen
      "no-control-regex": "off", // Schakelt de regel uit die waarschuwt voor controlekarakters in reguliere expressies.
      // Reguliere expressies met controlekarakters kunnen onterecht gewaarschuwd worden in bepaalde toepassingen, bijvoorbeeld bij data validatie.

    }
  }
];
