import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import minimist from "minimist";
import prompts from "prompts";
import { reset } from "kolorist";

import {
  formatTargetDir,
  isEmpty,
  isValidPackageName,
  toValidPackageName,
  getProjectName,
  emptyDir,
  copy,
  pkgFromUserAgent,
} from "./utils/functions.js";

import FRAMEWORKS from "./utils/frameworks.js";

// Recebe os argumentos do comando e transforma
// todas as props sem flags em um array de strings.
const ARGUMENTS = minimist(process.argv.slice(2), { string: ["_"] });

// Recebe o caminho do arquivo de entrada. (o diretório no qual você rodou o comando)
const cwd = process.cwd();

// Mapeia todas as variantes de frameworks e retorna um array único
// com todas as variantes.
const TEMPLATES = FRAMEWORKS.map(
  (framework) =>
    (framework.variants &&
      framework.variants.map((variant) => variant.name)) || [framework.name]
).flat();

// Como variáveis não podem começar com pontos, usaremos uma _ para
// mapear o arquivo .gitignore e verificaremos no futuro.
const renameFiles = {
  _gitignore: ".gitignore",
};

/**
    Função principal da interface.
*/
async function init() {
  // 1. Enviaremos o primeiro argumento não ordenado
  // e formataremos como um caminho válido.
  let targetDir = formatTargetDir(ARGUMENTS._[0]);

  // 2. Verificamos se foi informado algum template,
  // usasndo as flags --template e -t.
  let template = ARGUMENTS.template || ARGUMENTS.t;

  const defaultTargetDir = "vite-project";

  let result = {};

  try {
    // Inicia uma série de perguntas para o usuário.
    result = await prompts(
      [
        {
          // Primeira pergunta: Qual o nome do projeto?
          // (se já foi informado como argumento, ignore a etapa.)
          // Se a pergunta for ignorada pelo usuário, usaremos o
          // nome definido na variável `defaultTargetDir`.
          type: targetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
        },

        {
          // Caso o resultado da primeira pergunta seja um diretório
          // com arquivos dentro, pediremos por permissão para
          // remover os arquivos e continuar.
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            `is not empty. Remove existing files and continue?`,
        },

        {
          // Caso o resultado da segunda pergunta seja falso,
          // abortaremos o processo de criação do projeto.
          type: (_, { overwrite } = {}) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
          name: "overwriteChecker",
        },

        {
          // Terceira pergunta: Qual o nome do pacote? (se já foi informado como argumento, ignore a etapa.)
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },

        {
          // Quarta pergunta: Qual o framework? Se já foi informado como argumento
          // e é um template válido, ignore a etapa. Caso o template previamente
          // informado seja inválido, pediremos para que seja selecionado um framework agora:
          type: template && TEMPLATES.includes(template) ? null : "select",
          name: "framework",
          message:
            typeof template === "string" && !TEMPLATES.includes(template)
              ? reset(
                  `"${template}" isn't a valid template. Please choose from below: `
                )
              : reset("Select a framework:"),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color;
            return {
              title: frameworkColor(framework.name),
              value: framework,
            };
          }),
        },

        {
          // Após recebermos o framework, perguntaremos para que variante do framework
          // seja escolhida. (ex.: react e react-ts).
          type: (framework) =>
            framework && framework.variants ? "select" : null,
          name: "variant",
          message: reset("Select a variant:"),
          // @ts-ignore
          choices: (framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color;
              return {
                title: variantColor(variant.name),
                value: variant.name,
              };
            }),
        },
      ],
      {
        // Caso todo esse processo seja cancelado, lançaremos um erro.
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled");
        },
      }
    );

    // Agora que já temos todas as informações necessárias,
    // vamos recebê-las usando desestruturação de objetos.
    const { framework, overwrite, packageName, variant } = result;

    // Definimos um caminho para o diretório de destino e
    // criamos a pasta do projeto.
    const root = path.join(cwd, targetDir);

    if (overwrite) {
      emptyDir(root);
    } else if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }

    // Atualiza a variável template e avisa o usuário
    // sobre o processo.
    template = variant || framework || template;
    console.log(`\nScaffolding project in ${root}...`);

    // Procuraremos agora o template da variante escolhida
    // dentro da pasta templates.
    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      "..",
      "templates",
      `template-${template}`
    );

    // A função write será responsável por
    // copiar ou escrever os arquivos do projeto,
    // baseado no conteúdo do template.
    const write = (file, content) => {
      const targetPath = renameFiles[file]
        ? path.join(root, renameFiles[file])
        : path.join(root, file);
      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    };

    // Nessa etapa mapearemos todos os arquivos do
    // diretório do template (exceto package.json) e os
    // escreveremos no diretório de destino.
    const files = fs.readdirSync(templateDir);
    for (const file of files.filter((f) => f !== "package.json")) {
      write(file);
    }

    // Como package.json é um arquivo especial para um projeto,
    // teremos que gerá-lo de forma diferente.
    // Primeiro, lemos o package.json do template como um objeto:
    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
    );

    // Trocaremos a variável name para o nome do projeto informado pelo usuário.
    pkg.name = packageName || getProjectName();

    // Finalmente escreveremos o package.json modificado no projeto.
    write("package.json", JSON.stringify(pkg, null, 2));

    // Faremos agora uma verificação do gerenciador de pacotes
    // usado para invocar a CLI. Com isso, poderemos customizar
    // a informação exibida para o usuário mais tarde.
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";

    // Agora podemos informar o usuário sobre a conclusão do processo!
    console.log(`\nDone. Now run:\n`);
    if (root !== cwd) {
      console.log(`  cd ${path.relative(cwd, root)}`);
    }

    switch (pkgManager) {
      case "yarn":
        console.log("  yarn");
        console.log("  yarn dev");
        break;
      default:
        console.log(`  ${pkgManager} install`);
        console.log(`  ${pkgManager} run dev`);
        break;
    }
    console.log();

    // Seu projeto está pronto para ser usado!
  } catch (cancelled) {
    console.log(cancelled.message);
    return;
  }
}

// Roda a função principal e adiciona um bloco catch
// para exibir mensagem em caso de erro.
init().catch((error) => {
  console.error(error);
});
