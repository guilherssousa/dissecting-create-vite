import { blue, yellow, green, cyan, magenta, red, lightRed } from "kolorist";

const FRAMEWORKS = [
  {
    name: "vanilla",
    color: yellow,
    variants: [
      {
        name: "vanilla",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "vanilla-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
  {
    name: "vue",
    color: green,
    variants: [
      {
        name: "vue",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "vue-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
  {
    name: "react",
    color: cyan,
    variants: [
      {
        name: "react",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "react-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
  {
    name: "preact",
    color: magenta,
    variants: [
      {
        name: "preact",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "preact-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
  {
    name: "lit",
    color: lightRed,
    variants: [
      {
        name: "lit",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "lit-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
  {
    name: "svelte",
    color: red,
    variants: [
      {
        name: "svelte",
        display: "JavaScript",
        color: yellow,
      },
      {
        name: "svelte-ts",
        display: "TypeScript",
        color: blue,
      },
    ],
  },
];

export default FRAMEWORKS;
