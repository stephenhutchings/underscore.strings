/**
 * #### Rules
 */

/** A number can either be a string or a map of genders and the corresponding string */
type Written = string | Record<string, string>;

/**
 * A language is described in the object.
 * None of the properties are required and will be gracefully replaced by their english counterparts
 */
export interface Language {
  /** A regex that matches words which should not be capitalised */
  noncaps: RegExp;
  /** Cardinal letters */
  cardinals: {
    /** An array of ordinal letters */
    written: Written[];
  };
  /** Ordinal letters */
  ordinals: {
    /** An array of ordinal letters */
    written: Written[];
    /** A regex that matches numbers that can be converted to ordinals */
    rule: RegExp;
    /** suffixes to ordinals (such as (1)st) */
    suffixes: Record<string, Written>;
  };
}

const dictionary: Record<string, Language> = {
  EN: {
    noncaps:
      /^(an|and|as|at|be|but|by|has|in|if|nor|of|off|on|or|out|per|the|to|up|was)$/,
    cardinals: {
      written: [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
      ],
    },
    ordinals: {
      written: [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
        "eleventh",
        "twelfth",
      ],
      rule: /((1{0,1}[123])|(\d))\b/,
      suffixes: {
        "1": "st",
        "2": "nd",
        "3": "rd",
        "n": "th",
      },
    },
  },
};

/**
 * Capitalization
 */

/**
 * Capitalize the first letter of a string
 * @example
 * w.capitalize("obviously");                    // Obviously
 * @param str the string to capitalize
 * @returns the capitalized string
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Capitalize all words in a string apart from some common lower case words.
 * This can be tested with the internal noncaps regular expression, which are
 * stored by language code, or by passing a regular expression of your own.
 * @example
 * w.capitalizeAll("this and that");             // This And That
 * @param str The string to capitalize
 * @param init Regex that matches words which should not be capitalised or a
 * language code
 * @returns
 */
export const capitalizeAll = (
  str: string,
  init: RegExp | "EN" = dictionary["EN"].noncaps,
): string => {
  let regEx: RegExp;
  if (!(init instanceof RegExp)) {
    regEx = dictionary[init].noncaps;
  } else {
    regEx = init;
  }

  return str.split(/\s/g)
    .map((value, index) => {
      if (index > 0 && regEx.test(value)) {
        return value;
      } else {
        return capitalize(value);
      }
    })
    .join(" ");
};

// Utilities

/**
 * Wraps a string within two other strings, repeating the first if it needs be
 * @param a The string to wrap with
 * @param b The string to wrap
 * @param c The string to wrap with at the end (if provided)
 * @returns wrapped string
 */
export const enclose = (a: string, b: string, c?: string): string =>
  `${a}${b}${c || a}`;

/**
 * Joins an array of words with falsy, non-string values removed with some glue.
 * @param arr The array of words to join
 * @param glue The glue to join the words with
 * @returns The joined string
 */
export const cleanJoin = function (arr: Array<string | null>, glue = ""): string {
  return arr
    .filter((string) => (string && typeof string === "string"))
    .join(glue);
};

/**
 * Replace all white-space in a string with a single space character
 * @param str The string to remove whitespace from
 * @returns The string with whitespace removed
 */
export const collapse = (str: string): string => str.replace(/\s+/g, " ");

// cases

const caseSplitter = /[-_\s]+|(!?[A-Z][a-z]*)/g;

/**
 * Converts a string to camel case (pascal case)
 * @param str The string to convert
 * @returns The string in camel case
 */
export const camelCase = (str: string): string => {
  return str.replace(/[\s_-]+(\w)/g, (_a, w) => w.toUpperCase());
};

/**
 * Converts a string to hyphen case (with hyphens/dashes between words)
 * @param str The string to convert
 * @param leading Whether to add a hyphen as the first letter
 * @returns The string in hyphen case
 */
export const hyphenCase = (str: string, leading?: boolean): string =>
  (leading ? "-" : "") +
  cleanJoin(str.split(caseSplitter), "-").toLowerCase();

/**
 * Converts a string to snake case (with underscores)
 * @param str The string to convert
 * @returns The string in snake case
 */
export const snakeCase = (str: string): string =>
  cleanJoin(str.split(caseSplitter), "_").toLowerCase();

/**
 * Converts a string to human case (separated by white space)
 * @param str The string to convert
 * @returns The string in human case
 */
export const humanCase = (str: string): string =>
  cleanJoin(str.split(caseSplitter), " ");

/**
 * Enclose a string inside an HTML tag.
 * @param str The string to wrap
 * @param tag The tag to wrap the string with
 * @param attributes The attributes to add to the tag
 * attributes is an object whose values can either be strings, booleans or an
 * array of strings eg. `{ class: ["foo", "bar"], id: "baz", hidden: true }`
 * @returns string wrapped in tag with attributes
 */
export const wrapInTag = (
  str: string,
  tag = "span",
  attributes: Record<string, string | boolean | Array<string>> = {},
): string => {
  const attrs = Object.entries(attributes)
    .map(([key, val]) => {
      if (typeof val === "boolean") val = key;
      if (Array.isArray(val)) val = val.join(" ");
      return ` ${key}="${val}"`;
    });

  return enclose(`<${tag}${attrs.join("")}>`, str, `</${tag}>`);
};

// Lists

interface PrettyListOptions {
  /** The string to use for "more" */
  more?: string;
  /** The string used to join items (ampersand) */
  amp?: string;
  /** The accessor used to access values when the provided value is an array */
  key?: string;
  /** Which tag to use to wrap the items with */
  wrap?: string;
  /** Whether to pluralize the items */
  quantify?: boolean;
  /** Whether to write the remaining items in words */
  written?: boolean;
  /** The language to use */
  lang?: string;
}

/**
 * Pretty-print a list of items.
 * @param arr The array of items to pretty print
 * @param max The maximum number of items to show
 * @param opts The options to use
 * @returns The pretty printed list
 */
export const prettyList = (
  arr: unknown[],
  max?: number,
  opts: PrettyListOptions = {},
): string => {
  let more = opts.more || "more";
  const amp = opts.amp || "and";

  if (opts.key) {
    const key = opts.key;
    arr = arr
      .filter((obj) => (typeof obj === "object"))
      .map((obj) => (obj as Record<string, string>)[key]);
  }

  if (opts.wrap) {
    arr = arr
      .map((s) => wrapInTag(s as string, opts.wrap));
  }

  const len = arr.length;
  if (max && max < len) {
    const diff = len - max;
    if (opts.quantify) {
      more = quantify(more, diff, { numberless: true });
    }
    let diffStr: string = diff.toString();
    if (opts.written) {
      diffStr = writtenNumber(diff, opts.lang);
    }
    arr = arr
      .slice(0, max)
      .concat(`${diffStr} ${more}`);
  }

  return arr
    .slice(0, -1)
    .join(", ")
    .concat(arr.length === 1 ? "" : ` ${amp} `, ...arr.slice(-1) as string[]);
};

// hyphenation

/**
 * Add soft hyphens every `n` characters so that the CSS attribute
 * `hyphens: manual` will allow for nice breaks in long strings of text. This is
 * especially useful on mobile devices, where long strings can break the layout.
 * @param str The string to hyphenate
 * @param n The number of characters after which a hyphen is added
 * @param softHyphen Which hyphen to use (default is soft hyphen)
 * @returns The hyphenated string
 */
export const hyphenate = (str: string, n = 10, softHyphen = "\u00AD"): string =>
  str
    .replace(/(^|[^>])+(?=$|\<)/g, (sub) =>
      sub.replace(
        new RegExp(`(\\w{${n - 1}})(\\w)`, "g"),
        (_w, a, b) => a + softHyphen + b,
      ));

// quantify

interface QuantifyOptions {
  /** Whether to display the number in front of the word (default true) */
  numberless?: boolean;
  /** Whether to write the number as a word instead of digits (default false) */
  written?: boolean;
  /** The language to use */
  lang?: "EN";
  /** The plural of the word to use (instead of adding an `s`) */
  plural?: string;
}

/**
 * Add an "s" to a string when an amount is non-singular, disregarding the order of
 * the arguments passsed. If an array or collection is passed, it’s length will be
 * used as the numerical input.
 * @param first The number of items or an array of items (the length of which
 * is used)
 * @param second The name of items
 * **NOTE:** The first arguement can be interchanged with the second one
 * @param options The options to use
 * @returns A string depicting the items and their number
 */
export const quantify = (
  first: string | number | Array<unknown>,
  second: string | number | Array<unknown>,
  options: QuantifyOptions = {},
): string => {
  let str: string, n: number;
  if (
    typeof first === "string" &&
    (typeof second === "number" || Array.isArray(second))
  ) {
    str = first;
    n = Array.isArray(second) ? second.length : second;
  } else if (
    (typeof first === "number" || Array.isArray(first)) &&
    typeof second === "string"
  ) {
    str = second;
    n = Array.isArray(first) ? first.length : first;
  } else {
    throw TypeError(
      "The first and second argument must be strings or numbers (or an array) exclusively",
    );
  }

  const { numberless, written, lang, plural } = options;

  // n = n.length ? n
  const s = (n === 1) ? str : (plural || `${str}s`);
  let num: string = n.toString();
  if (written) num = writtenNumber(n, lang);
  const strn = numberless ? "" : `${num} `;

  return strn + s;
};

// Written numbers

/**
 * Convert numbers between one and twelve into their written counter-parts.
 * @param n The number
 * @param lang The language to use
 * @param gender The required gender of the word
 * @returns written counterpart of a number
 */
export const writtenNumber = (n: number, lang = "EN", gender = "m"): string => {
  const num = dictionary[lang]?.cardinals.written[n - 1];
  if (num) {
    if (typeof num === "object" && num[gender]) {
      return num[gender];
    } else if (typeof num === "object") {
      return Object.values(num)[0];
    } else {
      return num;
    }
  } else {
    return n.toString();
  }
};

// quotes
type Quotes =
  | "s"
  | "single"
  | "a"
  | "angle"
  | "g"
  | "guillemets"
  | "!"
  | "?"
  | "q"
  | string;

/**
 * Wrap a string in single or double quotes or guillemets (angle quotes).
 * @param str The string to quote
 * @param type The type of quotes to use
 * @returns The quoted string
 */
export const quote = (str: string, type?: Quotes): string => {
  let a: string, z: string;
  switch (type) {
    case "s":
    case "single":
      [a, z] = ["‘", "’"];
      break;
    case "a":
    case "angle":
    case "g":
    case "guillemets":
      [a, z] = [a, z] = ["«", "»"];
      break;
    case "!":
      [a, z] = ["¡", "!"];
      break;
    case "?":
      [a, z] = ["¿", "?"];
      break;
    default:
      [a, z] = ["“", "”"];
      break;
  }
  return enclose(a, str, z);
};

// ordinals

interface OrdinalOptions {
  /** Whether to use the written form of the number (default false) */
  written?: boolean;
  /** Wrap the suffix in a tag (when true, tag is `sup`) (default false) */
  wrap?: boolean | string;
  /** The language to use */
  lang?: "EN";
}

/**
 * Convert a number from it's cardinal to ordinal equivalent.
 * @param n The number
 * @param opts The options to use
 * @param gender The required gender of the written number
 * @returns The ordinal form of a cardinal number
 */
export const ordinal = (
  n: number,
  opts: OrdinalOptions = {},
  gender = "m",
): string => {
  const { suffixes, rule, written } = dictionary[opts.lang || "EN"].ordinals;
  const base = (n.toString().match(rule) || [])[0];

  const w = written[+n - 1];
  if (opts.written) {
    if (typeof w === "object") {
      return w[gender];
    } else {
      return w;
    }
  } else {
    let suffix = suffixes[base as string] || suffixes.n;
    if (typeof suffix === "object") {
      suffix = suffix[gender];
    }

    if (opts.wrap) {
      if (typeof opts.wrap === "boolean") opts.wrap = "sup";
      suffix = wrapInTag(suffix, opts.wrap);
    }

    return n + suffix;
  }
};

// numbers

/**
 * Pretty print a number
 * @param n The number
 * @param delimiter The delimiter to use after every 3 digits (thousand) or the
 * number of digits after the decimal points
 * @param decimals The number of digits after the decimal point
 * @param dot The decimal point to use
 * @returns The pretty printed number
 */
export const prettyNumber = (
  n: number,
  delimiter: string | number = ",",
  decimals = 0,
  dot = ".",
): string => {
  if (typeof delimiter === "number") {
    decimals = delimiter;
    delimiter = ",";
  }
  n = parseNumber(n);
  let num: string = n.toString();
  if (decimals > 0) num = n.toFixed(decimals);
  if (dot) num = num.replace(".", dot);
  const [int, frac] = num.toString().split(dot);
  return [int.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter), frac]
    .filter((e) => !!e)
    .join(dot);
};

interface Currency {
  /** The symbok of the currency */
  currency?: string;
  /** The tag to wrap the currency in */
  wrap?: string;
  /** The number of digits after the decimal point */
  decimals?: number;
  /** The delimiter to use after every 3 digits (thousand) */
  delimiter?: string;
  /** The decimal point to use */
  dot?: string;
  /** Whether to show the currency sign at the beginning of number (default true) */
  front?: boolean;
}
export const prettyPrice = (n: number, currency?: string | Currency): string => {
  let wrap: string | undefined,
    decimals: number | undefined,
    delimiter: string | undefined,
    dot = ".",
    front = true;
  if (typeof currency === "object") {
    ({ currency = "$", wrap, decimals, delimiter, dot = ".", front = true } =
      currency);
  }

  if (!currency) currency = "$";
  if (!decimals) decimals = 2;
  if (!dot) dot = ".";

  let num = prettyNumber(n, delimiter, decimals, dot);

  if (wrap) {
    const [integer, fraction] = num.split(dot);
    num = integer + wrapInTag(fraction, wrap);
  }

  if (front) {
    return currency + num;
  } else {
    return num + currency;
  }
};

/**
 * Pretty print a percentage
 * @param numerator The numerator of the percentage / The value
 * @param denominator The denominator of the percentage / The max value
 * @param decimals The number of digits after the decimal point (default 0)
 * @returns The pretty printed percentage
 */
export const prettyPercent = (numerator = 0, denominator = 1, decimals = 0): string => {
  const percent = (numerator / denominator * 100) || 0;
  return `${percent.toFixed(decimals)}%`;
};

/**
 * Extract a number from a string (or number)
 * @param n The string/number to extract the number from
 * @returns The extracted number
 */
export const parseNumber = (n: number | string): number => {
  if (typeof n === "string") {
    n = parseFloat(n.replace(/[^\d\.]+/g, "")) /
      (n.slice(-1) === "%" ? 100 : 1);
  }
  if (n <= Infinity) {
    return n;
  } else {
    return -1;
  }
};

// glyphs

const fromTo = (x: number, y: number): number[] =>
  new Array(y - x + 1).fill(0)
    // Array
    //   .apply(0, { length: y - x + 1 })
    .map((_e, i) => i + x);

/**
 * Provide quick access to different typographic glyphs without the need commit
 * them to memory or look at a reference table.
 * @returns a map of glyphs
 */
export const glyphs = (): Record<string, string> =>
  Object.fromEntries(
    [
      fromTo(161, 255),
      fromTo(338, 402),
      fromTo(8211, 8230),
      [8240, 8364, 8482],
    ]
      .flat()
      .map((code) => [code, String.fromCharCode(code)]),
  );

/**
 * Get the code point of a certain character
 * @param c the character
 * @returns the code point of the character eg: &#33;
 */
export const glyph = (c: string): string =>
  enclose("&#", c.charCodeAt(0).toString(), ";");

// language support

/**
 * Set cardinal and ordinal numbers and non-caps words for different languages as
appropriate. Please note that only partial support for French, German, Italian,
Spanish and Swedish is currently implemented. PRs are welcome.
 * @param object The language dictionary
 * @param lang The language code used to reference this language dictionary
 * @returns The language dictionary
 */
export const setLanguage = (object: Partial<Language>, lang: string) =>
  dictionary[lang] = { ...dictionary.EN, ...object };


// Aliases
/** Alias for `hyphenCase` */
export const dasherize = hyphenCase;
/** Alias for `hyphenCase` */
export const dashify = hyphenCase;
/** Alias for `snakeCase` */
export const slugify = snakeCase;
/** Alias for `snakeCase` */
export const underscore = snakeCase;
/** Alias for `quantify` */
export const numerate = quantify;
/** Alias for `quantify` */
export const count = quantify;
/** Alias for `capitalizeAll` */
export const titleCase = capitalizeAll;
