import { describe, equals, it } from "../test_deps.ts";

import { written as w } from "../test_deps.ts";

describe("written", () => {
  describe("cleanJoin()", () => {
    it("should join an array of strings will falsy values removed", () => {
      equals("this and that", w.cleanJoin(["this", null, "that"], " and "));
    });
  });
  describe("enclose()", () => {
    it("should enclose a string within another", () => {
      equals("'string'", w.enclose("'", "string"));
    });
  });
  describe("capitalize()", () => {
    it("should capitalize the first letter of a string", () => {
      equals("Hello world!", w.capitalize("hello world!"));
    });
  });
  describe("capitalizeAll()", () => {
    it("should capitalize the first letter of non-reserved words in a string", () => {
      equals("Hello World!", w.capitalizeAll("hello world!"));
      equals("This and That", w.capitalizeAll("this and that"));
    });
  });
  describe("collapse()", () => {
    it("should replace all white-space in a string with a single space character", () => {
      equals("this and that", w.collapse("this     \t\t and \n    that"));
    });
  });
  describe("camelCase()", () => {
    it('should format a "cased" string into camel-case', () => {
      equals("someThing", w.camelCase("some-thing"));
      equals("someThing", w.camelCase("some_thing"));
      equals("someThing", w.camelCase("someThing"));
      equals("someThing", w.camelCase("some Thing"));
      equals("someThing", w.camelCase("some    Thing"));
    });
  });
  describe("hyphenCase()", () => {
    it('should format a "cased" string into hyphen-case', () => {
      equals("some-thing", w.hyphenCase("some-thing"));
      equals("some-thing", w.hyphenCase("some_thing"));
      equals("some-thing", w.hyphenCase("someThing"));
      equals("some-thing", w.hyphenCase("some Thing"));
      equals("some-thing", w.hyphenCase("some    Thing"));
      equals("-some-thing", w.hyphenCase("someThing", true));
    });
  });
  describe("snakeCase()", () => {
    it('should format a "cased" string into snake-case', () => {
      equals("some_thing", w.snakeCase("some-thing"));
      equals("some_thing", w.snakeCase("some_thing"));
      equals("some_thing", w.snakeCase("someThing"));
      equals("some_thing", w.snakeCase("some Thing"));
      equals("some_thing", w.snakeCase("some    Thing"));
    });
  });
  describe("humanCase()", () => {
    it('should format a "cased" string into human-case', () => {
      equals("some thing", w.humanCase("some-thing"));
      equals("some thing", w.humanCase("some_thing"));
      equals("some Thing", w.humanCase("someThing"));
      equals("some Thing", w.humanCase("some Thing"));
      equals("some Thing", w.humanCase("some    Thing"));
      equals("from A to Z", w.humanCase("fromA_to-Z"));
    });
  });
  describe("wrapInTag()", () => {
    it("should wrap a string inside an HTML tag", () => {
      equals("<span>Hello world!</span>", w.wrapInTag("Hello world!"));
      equals(
        "<strong>Hello world!</strong>",
        w.wrapInTag("Hello world!", "strong"),
      );
      equals(
        '<a href="/url" class="b" disabled="disabled">Link</a>',
        w.wrapInTag("Link", "a", {
          href: "/url",
          class: ["b"],
          disabled: true,
        }),
      );
    });
  });
  describe("prettyList()", () => {
    it("should format an array into a grammatically correct string", () => {
      equals("Ben and Bob", w.prettyList(["Ben", "Bob"]));
      equals("Ben, Bob and Bill", w.prettyList(["Ben", "Bob", "Bill"]));
      equals(
        "Ben, Bob and 2 more",
        w.prettyList(["Ben", "Bob", "Bill", "Max"], 2),
      );
      equals(
        "Ben and 1 other",
        w.prettyList(["Ben", "Bob"], 1, {
          more: "other",
        }),
      );
      equals(
        "Ben and one more",
        w.prettyList(["Ben", "Bob"], 1, {
          written: true,
        }),
      );
      equals(
        "Doc1 and two other files",
        w.prettyList(["Doc1", "Doc2", "Doc3"], 1, {
          written: true,
          more: "other file",
          quantify: true,
        }),
      );
      equals(
        "Doc1 and 1 more",
        w.prettyList(
          [
            {
              file: "Doc1",
            },
            {
              file: "Doc2",
            },
          ],
          1,
          {
            key: "file",
          },
        ),
      );
    });
  });
  describe("prettyNumber()", () => {
    it("should format a number into a correctly formatted string", () => {
      equals("1,000", w.prettyNumber(1000));
      equals("10.50", w.prettyNumber(10.5, 2));
      equals("9 999,00", w.prettyNumber(9999, " ", 2, ","));
      equals("0.3333333333333333", w.prettyNumber(1 / 3));
      equals("-1,000.33", w.prettyNumber(-1000.33));
    });
  });
  describe("prettyNumber()", () => {
    it("should format a number into a correctly formatted string", () => {
      equals("50%", w.prettyPercent(0.5));
      equals("25%", w.prettyPercent(1, 4));
      equals("33.33%", w.prettyPercent(1, 3, 2));
    });
  });
  describe("prettyPrice()", () => {
    it("should format a number as a correctly formatted price", () => {
      equals("$4.00", w.prettyPrice(4));
      equals("£4.00", w.prettyPrice(4, "£"));
      equals("4.00£", w.prettyPrice(4, {
        currency: "£",
        front: false,
      }));
      equals(
        "€4<sup>00</sup>",
        w.prettyPrice(4, {
          currency: "€",
          wrap: "sup",
        }),
      );
      equals(
        "$99<sup>00</sup>",
        w.prettyPrice(99, {
          wrap: "sup",
        }),
      );
    });
  });
  describe("parseNumber()", () => {
    it("should convert a string to it's numerical equivalent", () => {
      equals(1000, w.parseNumber(1000));
      equals(1000, w.parseNumber("1,000.00"));
      equals(0.99, w.parseNumber("99%"));
      equals(44000, w.parseNumber("some 44,000 participants"));
    });
  });
  describe("hypenate()", () => {
    it("should add invisible soft hyphens to a string every `n` characters", () => {
      equals(
        "antidises­tablishmen­tarianism",
        w.hyphenate("antidisestablishmentarianism"),
      );
      equals("s­pa­ce­d p­hr­as­e", w.hyphenate("spaced phrase", 2));
      equals(
        "antidises%C2%ADtablishmen%C2%ADtarianism",
        encodeURIComponent(w.hyphenate("antidisestablishmentarianism")),
      );
      equals(
        "an <a href='http://www.longishurl.com'>an­cho­r</a>",
        w.hyphenate("an <a href='http://www.longishurl.com'>anchor</a>", 3),
      );
    });
  });
  describe("quantify()", () => {
    it('should add an "s" where appropriate to a number and a string', () => {
      equals("1 monkey", w.quantify("monkey", 1));
      equals("1 monkey", w.quantify(1, "monkey"));
      equals(
        "monkey",
        w.quantify("monkey", 1, {
          numberless: true,
        }),
      );
      equals(
        "nine monkeys",
        w.quantify("monkey", 9, {
          written: true,
        }),
      );
      equals(
        "1 person",
        w.quantify("person", 1, {
          plural: "people",
        }),
      );
      equals(
        "9 people",
        w.quantify("person", 9, {
          plural: "people",
        }),
      );
      equals("3 numbers", w.quantify([1, 2, 3], "number"));
    });
  });
  describe("writtenNumber()", () => {
    it("should convert a number between 1 and 12 to it's written counterpart", () => {
      equals("one", w.writtenNumber(1));
    });
  });
  describe("ordinals()", () => {
    it("should convert a number from it's cardinal to ordinal equivalent", () => {
      equals("1st", w.ordinal(1));
      equals(
        "second",
        w.ordinal(2, {
          written: true,
        }),
      );
      equals(
        "3<sup>rd</sup>",
        w.ordinal(3, {
          wrap: true,
        }),
      );
      equals(
        "4<em>th</em>",
        w.ordinal(4, {
          wrap: "em",
        }),
      );
    });
  });
  describe("quote()", () => {
    it("should wrap a string in single, double quotes or guillemets (angle quotes).", () => {
      equals("‘pastry chef’", w.quote("pastry chef", "s"));
      equals("“cats cradle”", w.quote("cats cradle"));
      equals("«tres chic»", w.quote("tres chic", "g"));
      equals("¡Gol!", w.quote("Gol", "!"));
      equals("¿Cómo estás?", w.quote("Cómo estás", "?"));
    });
  });
  describe("setLanguage()", () => {
    it("should add a language to the dictionary", () => {
      equals(
        "1",
        (() => {
          w.setLanguage({
            cardinals: {
              written: ["1"],
            },
          }, "key");
          return w.writtenNumber(1, "key");
        })(),
      );
    });
  });
  describe("aliases", function() {
    it("should match the behaviour of their counterparts", function() {
      equals(w.dasherize, w.hyphenCase);
      equals(w.dashify, w.hyphenCase);
      equals(w.slugify, w.snakeCase);
      equals(w.underscore, w.snakeCase);
      equals(w.numerate, w.quantify);
      equals(w.count, w.quantify);
      equals(w.titleCase, w.capitalizeAll);
    });
  });
});
