### written

[![Build Status](https://travis-ci.org/stephenhutchings/written.svg)](https://travis-ci.org/stephenhutchings/written)

_written_ provides a set of utilities for manipulating text, with a focus on
providing typographic tools rather than pure string manipulation. It can be
added as a set of mixins to Underscore or used in it's own right, both in front
and back end contexts.

- [Capitalization](#capitalization)
- [Utilities](#utilities)
- [Collapse](#collapse)
- [Cases](#cases)
- [Tags](#tags)
- [Lists](#lists)
- [Hyphenation](#hyphenation)
- [Quantify](#quantify)
- [Written Numbers](#written-numbers)
- [Quotes](#quotes)
- [Ordinals](#ordinals)
- [Numbers](#numbers)
- [Glyphs](#glyphs)
- [Language Support](#language-support)

##### Deno or ESM

```js
import * as written from "https://deno.land/x/written/written.ts";

// or import singular functions
import { writtenNumber } from "https://deno.land/x/written/written.ts";
```

##### Browser

```html
<script type="module" src=></script>
```

##### NPM

As this is a Deno fork, the original NPM version is published by
@stephenhutchings from the repo
[stephenhutchings/written](https://www.github.com/stephenhutchings/written).
Note that the Node version doesn't have types.

```bash
npm install written
```

---

#### Setup

_written_ can be used in any environment that supports both ES Modules and
TypeScript.

Some style guides prefer the numbers 12 and under to be written, so we'll
include those in here. If more or fewer numbers need to be added, or those from
another language, see [Language Support](#language-support).

Following the APA style guide (for ease and practicality) conjunctions,
articles, and short prepositions of less than four letters will be left in
lowercase when calling `capitalizeAll()`.

A rule is needed to determine the correct ordinal for any number. For English,
we use match in such a way that the first value in the matching array is
returned, unless it is 11, 12 or 13. We use this number to determine the correct
ordinal form.

---

#### Capitalization

Capitalize the first letter of a string.

Examples:

```ts
w.capitalize("obviously");                       // Obviously
```

Capitalize all words in a string apart from some common lower case words. This
can be tested with the internal noncaps regular expression, which are stored by
language code, or by passing a regular expression of your own.

Examples:

```ts
w.capitalizeAll("this and that");                // This and That
w.capitalizeAll("the cat in the hat");           // The Cat in the Hat
```

#### Utilities

`enclose` wraps a string within two other strings, repeating the first if needs
be. `cleanJoin` joins an array of words with falsy, non-string values removed
with some glue. Both are used internally but are offered in case of their
external value.

Examples:

```ts
w.enclose("'", "string");                        // 'string'
w.cleanJoin(["this", null, "that"], " and ");    // this and that
```

#### Collapse

Replace all white-space in a string with a single space character

Examples:

```ts
w.collapse("this   \t\t and \n    that");        // this and that
```

#### Cases

Transform strings between common code cases.

Examples:

```ts
w.camelCase("some-thing");                       // someThing
w.hyphenCase("some_thing");                      // some-thing
w.snakeCase("someThing");                        // some_thing
w.humanCase("fromA_to-Z");                       // from A to Z
```

This helps to split "cased" words into their constituent parts...

#### Tags

Enclose a string inside an HTML tag.

Examples:

```ts
w.wrapInTag("Hello world!");                     // <span>Hello world!</span>
w.wrapInTag("Hello world!", "em");               // <em>Hello world!</em>
w.wrapInTag(                                     // <a href="/url" class="b" disabled="disabled">Link</a>
  "Link",
  "a",
  {
    href: "/url",
    class: ["b"],
    disabled: true,
  },
);
```

#### Lists

Group strings into a grammatically correct list with an arbitrary limit. The
final example shows all the possible options available.

Examples:

```ts
w.prettyList(["Ben", "Bob"])                     // Ben and Bob
w.prettyList(["Ben", "Bob", "Bill"])             // Ben, Bob and Bill
w.prettyList(["Ben", "Bob", "Bill", "Max"], 2)   // Ben, Bob and 2 more
w.prettyList(["Ben", "Bob"], 1, {more: "other"}) // Ben and 1 other
w.prettyList([                                   // Document 1 & two other files
  {file: "Document 1"},
  {file: "Document 2"},
  {file: "Document 3"}
], 1, {
  amp: "&"
  written: true,
  more: "other file",
  quantify: true,
  key: "file"
})
```

#### Hyphenation

Add soft hyphens every `n` characters so that the CSS attribute
`hyphens: manual` will allow for nice breaks in long strings of text. This is
especially useful on mobile devices, where long strings can break the layout.

Examples:

```ts
w.hyphenate("antidisestablishmentarianism"); // antidisest%C2%ADablishm...
```

#### Quantify

Add an "s" to a string when an amount is non-singular, disregarding the order of
the arguments passsed. If an array or collection is passed, it’s length will be
used as the numerical input.

Examples:

```ts
w.quantify("monkey", 1);                         // 1 monkey
w.quantify(1, "monkey");                         // 1 monkey
w.quantify("monkey", 9, { written: true });      // nine monkeys
w.quantify("person", 9, { plural: "people" });   // 9 people
w.quantify([1, 2, 3], "number");                 // 3 numbers
```

#### Written Numbers

Convert numbers between one and twelve into their written counter-parts.

Examples:

```ts
w.writtenNumber(1);                              // one
w.writtenNumber(2, "DE");                        // zwei
```

#### Quotes

Wrap a string in single or double quotes or guillemets (angle quotes).

Examples:

```ts
w.quote("pastry chef", "s");                     // ‘pastry chef’
w.quote("cats cradle");                          // “cats cradle”
w.quote("tres chic", "a");                       // «tres chic»
w.quote("Gol", "!");                             // ¡Gol!
w.quote("Cómo estás", "?");                      // ¿Cómo estás?
```

#### Ordinals

Convert a number from it's cardinal to ordinal equivalent.

Examples:

```ts
w.ordinal(1);                                    // 1st
w.ordinal(2, { written: true });                 // second
w.ordinal(3, { wrap: true });                    // 3<sup>rd</sup>
w.ordinal(4, { wrap: "em" });                    // 4<em>th</em>
```

#### Numbers

Format a number in various ways and parse one from a string.

Examples:

```ts
w.prettyNumber(1000);                            // 1,000
w.prettyNumber(10.5, 2);                         // 10.50
w.prettyNumber(9999, " ", 2, ",");               // 9 999,00

w.prettyPrice(4);                                // $4.00
w.prettyPrice(1200, "£");                        // £1,200.00
w.prettyPrice(                                   // €4<sup>00</sup>
  4,
  {
    currency: "€",
    wrap: "sup",
  },
);

w.prettyPercent(0.5);                            // 50%
w.prettyPercent(1, 4);                           // 25%
w.prettyPercent(1, 3, 2);                        // 33.33%

w.parseNumber(1000);                             // 1000
w.parseNumber("1,000.00");                       // 1000
w.parseNumber("99%");                            // 0.99
w.parseNumber("some 44,000 participants");       // 44000
```

#### Glyphs

Provide quick access to different typographic glyphs without the need commit
them to memory or look at a reference table.

Examples:

```ts
w.glyphs();                                      // Create map of ASCII glyphs
w.glyph("!");                                    // &#33;
```

#### Language Support

Set cardinal and ordinal numbers and non-caps words for different languages as
appropriate. Please note that only partial support for French, German, Italian,
Spanish and Swedish is currently implemented. If using in the browser, ensure
that the document's charset is set to UTF-8. _Pull requests which extend
language support are encouraged._

To load and install a locale, do:

```ts
import * as written from "https://deno.land/x/written/written.ts";
import * as DE from "https://deno.land/x/written/lang/written.de.ts";
// there is also es,fs,it and se.

written.setLanguage(DE.dico, DE.code);

// now all your operations will be based on the DE locale.
w.writtenNumber(1);                              // eins

// you can also override the set locale:
w.writtenNumber(2, "EN");                        // two
```

#### Aliases

Pack up the `written` object (with some aliases...)

* `dasherize` -> `hyphenCase`
* `dashify` -> `hyphenCase`
* `slugify` -> `snakeCase`
* `underscore` -> `snakeCase`
* `numerate` -> `quantify`
* `count` -> `quantify`
* `titleCase` -> `capitalizeAll`
