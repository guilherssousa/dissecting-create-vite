import path from "path";
import fs from "fs";

/**
 * Recebe uma string e o formata como um caminho válido,
 * retirando todos os caracteres de barra (/).
 *
 * @param {string | undefined} targetDir
 * @return {string} String formatada.
 */
export function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

/**
 * Função que recebe o diretório alvo do projeto e
 * retorna o nome do projeto.
 *
 * @returns {string} Nome do projeto.
 */
export function getProjectName(targetDir) {
  return targetDir === "." ? path.basename(path.resolve()) : targetDir;
}

/**
 * Confere se o diretório `path` está vazio.
 * @param {string} path
 * @returns {boolean}
 */
export function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

/**
 * Recebe uma string e retona se ela é um nome de pacote válido.
 * @param {string} projectName
 * @returns {boolean}
 */
export function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  );
}

/**
 * Transforma `projectName` em um nome de pacote válido.
 * @param {string} projectName
 * @returns {string} Nome de pacote válido.
 */
export function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z0-9-~]+/g, "-");
}

/**
 * Recebe uma string de diretório e o esvazia.
 * Se o diretório não existir, a função não faz nada.
 * @param {string} dir
 */
export function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
  }
}

/**
 * Copia os dados do registro `src` para `dest` (pasta ou arquivo).
 * @param {string} src
 * @param {string} dest
 */
export function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

/**
 * Recebe o User Agent do gerenciador de pacotes
 * e retorna formatado como objeto.
 * @param {string} userAgent
 * @return Informações do gerenciador de pacotes.
 */
export function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(" ")[0];
  const pkgSpecArr = pkgSpec.split("/");
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}

/**
 * Copia o diretório, usando recursão se necessário.
 *
 * @param {string} srcDir Diretório de origem
 * @param {string} destDir Diretório de destino
 */
export function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}
