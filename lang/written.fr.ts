// French language support for Written

export const code = "FR";
export const dico = {
  cardinals: {
    written: [
      { m: "un", f: "une" },
      "deux",
      "trois",
      "quatre",
      "cinq",
      "six",
      "sept",
      "huit",
      "neuf",
      "dix",
      "onze",
      "douze",
    ],
  },

  ordinals: {
    written: [
      { m: "premier", f: "première" },
      "deuxième",
      "troisième",
      "quatrième",
      "cinquième",
      "sixième",
      "septième",
      "huitième",
      "neuvième",
      "dixième",
    ],

    rule: /(\d)\b/,

    suffixes: {
      "1": { m: "er", f: "re" },
      "n": "e",
    },
  },
};
