# Dissecando `create-vite`

Este repositório contém uma versão mastigada do código-fonte do [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite), CLI usada para criar um novo projeto Vite. Seu propósito é estudar seu funcionamento e explicar de forma simples e clara o que é o `create-vite` e como ele funciona por debaixo dos panos.

O código é fortemente comentado com suporte a JSDocs para que você possa entender o que está acontecendo.

Eu escrevi um artigo no Medium, chamado ["Dissecando o create-vite: Entendendo como funciona a CLI do Vite"](https://medium.com/@guilherssousa/dissecando-o-create-vite-entendendo-como-funciona-a-cli-do-vite-e6ddfa196029) onde explico o processo de funcionamento da CLI em formato de blog post.

## ⚠ Aviso

O código apresentado nesse repositório é apenas uma reprodução comentada do repositório original, portanto, não substitui ou não deve ser usado em produção ou em qualquer outra situação que não seja para o estudo de sua funcionalidade. Caso esteja interessado em criar um projeto Vite, use a ferramenta original, [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite).

## O que mudou?

Alguns trechos de código como nomes de variáveis foram alteradas para melhor entendimento.

- A variável `argv` foi renomeada para `ARGUMENTS`.
- A variável `FRAMEWORKS` foi movida para o arquivo `utils/frameworks.js`.
- Todas as funções isoladas do código agora possuem documentações explicativas usando **JSDoc**.

A estrutura do código foi modificada para facilitar a leitura e a localização do usuário no código.

- Os templates que antes ficavam na raíz do projeto original, **agora ficam na pasta `templates`**.
- As funções auxiliares que antes ficavam no arquivo `index.js`, agora ficam na pasta `utils/functions.js`.

## Contribuições

Caso você tenha achado um erro nas explicações do código ou ache que sejam de difícil entendimento, sinta-se livre para abrir uma [issue](https://github.com/guilherssousa/dissecting-create-vite/issues) ou um Pull Request corrigindo o que for preciso.

Pull Requests que implementarem mudanças em templates ou adicionarem funcionalidades não fundamentais ao código provavelmente serão ignoradas.

## Licença

O código deste repositório não possui licença, então, você pode copiar, modificar e distribuir o código livremente. Porém, entenda que o código apresentado aqui é uma reprodução comentada do código original, que está sob a [licença MIT](https://github.com/vitejs/vite/blob/main/packages/create-vite/LICENSE).
