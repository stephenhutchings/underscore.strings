// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

async function get_latest_version() {
  const p = new Deno.Command("git", {
    args: ["describe", "--tags", "--abbrev=0"],
  });

  const decoder = new TextDecoder("utf-8");

  const latest = await p
    .output()
    .then((result) => {
      if (result.code !== 0) throw new Error("Couldn't get latest tag");
      return decoder.decode(result.stdout);
    })
    // remove \n from end of string
    .then((result) => result.slice(0, -1));

  console.log(`No version provided, using latest: ${latest}`);

  return latest;
}

await build({
  entryPoints: [
    "./written.ts",
    {
      name: "./lang/de",
      path: "./lang/written.de.ts",
    },
    {
      name: "./lang/es",
      path: "./lang/written.es.ts",
    },
    {
      name: "./lang/fr",
      path: "./lang/written.fr.ts",
    },
    {
      name: "./lang/it",
      path: "./lang/written.it.ts",
    },
    {
      name: "./lang/se",
      path: "./lang/written.se.ts",
    },
  ],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: false,
  },
  packageManager: "npm",
  test: false,
  typeCheck: false,
  compilerOptions: {
    lib: ["ES2022"],
  },
  package: {
    // package.json properties
    name: "@vixalien/written",
    version: Deno.args[0] || await get_latest_version(),
    description: "A a set of utilities for manipulating text, with a focus on \
providing typographic tools rather than pure string manipulation.",
    tags: [
      "written",
      "typography",
      "strings",
      "text",
      "utility",
    ],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/vixalien/vixalien.git",
    },
    bugs: {
      url: "https://github.com/vixalien/vixalien/issues",
    },
    files: [
      "/esm",
      "/script",
      "/types",
      "LICENCE",
      "README.md",
    ],
  },
});

// post build steps
Deno.copyFileSync("LICENCE", "npm/LICENCE");
Deno.copyFileSync("README.md", "npm/README.md");
