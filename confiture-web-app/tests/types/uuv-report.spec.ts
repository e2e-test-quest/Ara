import {
  A11yResult,
  formatValidations,
  RuleCheckEnum,
  Status,
  transformUuvReport
} from "../../src/types/uuv-report";

const errorValidationRule = {
  status: Status.ERROR,
  validations: [
    {
      status: Status.ERROR,
      errorNodes: [
        {
          node: {} as HTMLElement,
          selector: "html > body > main > img:nth-of-type(1)",
          html: '<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px" alt="">'
        },
        {
          node: {} as HTMLElement,
          selector: "html > body > main > img:nth-of-type(2)",
          html: '<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px">'
        }
      ],
      nodesToCheckManually: [],
      criteria: "1.1"
    }
  ],
  rule: {
    check: RuleCheckEnum.AUTO,
    shouldNotExist: true,
    criterion: "1.1",
    wcag: "1.1.1 A",
    id: "1.1.1",
    elementType: "image",
    query: {
      subQuery: {
        selectors: ["img"]
      },
      shouldBeEmpty: true
    },
    description: "image has no text information",
    help: "set text information to image"
  }
};
const successValidationRule = {
  status: Status.SUCCESS,
  validations: [
    {
      status: Status.SUCCESS,
      errorNodes: [],
      nodesToCheckManually: [],
      criteria: "1.1"
    }
  ],
  rule: {
    check: RuleCheckEnum.AUTO,
    shouldNotExist: true,
    criterion: "1.1",
    wcag: "1.1.1 A",
    id: "1.1.4",
    elementType: "image",
    query: {
      selectors: ["a[href]img[ismap]"]
    },
    description:
      "The clickable zone does not have an identical mechanism, which can be used regardless of the pointing device used and provides access to the same destination",
    help: "provide a mechanism identical to the clickable zone, which can be used regardless of the pointing device used and provides access to the same destination"
  }
};

const json: A11yResult = {
  status: Status.ERROR,
  ruleResults: [
    errorValidationRule,
    successValidationRule,
    {
      status: Status.ERROR,
      validations: [
        {
          status: Status.ERROR,
          errorNodes: [
            {
              node: {} as HTMLElement,
              selector:
                "html > body > main > map:nth-of-type(1) > area:nth-of-type(3)",
              html: '<area shape="poly" coords="209,249,49,249,130,139" href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank">'
            },
            {
              node: {} as HTMLElement,
              selector:
                "html > body > main > map:nth-of-type(1) > area:nth-of-type(4)",
              html: '<area shape="poly" coords="48,249,0,96,129,138" href="https://developer.mozilla.org/docs/Web/API" target="_blank">'
            },
            {
              node: {} as HTMLElement,
              selector:
                "html > body > main > map:nth-of-type(1) > area:nth-of-type(5)",
              html: '<area shape="poly" coords="0,95,128,0,128,137" href="https://developer.mozilla.org/docs/Web/CSS" target="_blank">'
            }
          ],
          nodesToCheckManually: [],
          criteria: "1.1"
        }
      ],
      rule: {
        check: RuleCheckEnum.AUTO,
        shouldNotExist: true,
        criterion: "1.1",
        wcag: "1.1.1 A",
        id: "1.1.2",
        elementType: "area",
        query: {
          subQuery: {
            selectors: ["area[href]"]
          },
          shouldBeEmpty: true
        },
        description: "area has no alternative text",
        help: "set alternative text to area"
      }
    },
    {
      status: Status.SUCCESS,
      validations: [
        {
          status: Status.SUCCESS,
          errorNodes: [],
          nodesToCheckManually: [],
          criteria: "1.2"
        }
      ],
      rule: {
        check: RuleCheckEnum.AUTO,
        shouldNotExist: true,
        criterion: "1.2",
        wcag: "1.1.1 A, 4.1.2 A",
        id: "1.2.1",
        elementType: "image",
        query: {
          subQuery: {
            selectors: [
              "img[alt='']:not([href])",
              "img[aria-hidden=true]:not([href]",
              "img[role=presentation]:not([href])"
            ]
          },
          shouldBeEmpty: false
        },
        description: "decorative image has alternative text",
        help: "remove alternative text to decorative image"
      }
    },
    {
      status: Status.MANUAL,
      validations: [
        {
          status: Status.MANUAL,
          errorNodes: [],
          nodesToCheckManually: [
            {
              node: {
                domNode: {} as HTMLElement,
                linkedNodes: []
              },
              selector: "html > body > main > img:nth-of-type(1)",
              attributes: "",
              html: '<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px" alt="">',
              help: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.1"
            },
            {
              node: {
                domNode: {} as HTMLElement,
                linkedNodes: []
              },
              selector: "html > body > main > img:nth-of-type(3)",
              attributes: "aria-label=je ne suis pas pertinent, alt=logo UUV",
              html: '<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px" alt="logo UUV" aria-label="je ne suis pas pertinent">',
              help: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.1"
            },
            {
              node: {
                domNode: {} as HTMLElement,
                linkedNodes: []
              },
              selector: "html > body > main > img:nth-of-type(4)",
              attributes: "aria-label=je ne suis pas pertinent non plus",
              html: '<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px" aria-label="je ne suis pas pertinent non plus">',
              help: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.1"
            }
          ],
          criteria: "1.3"
        }
      ],
      rule: {
        attributes: ["title", "aria-labelledby", "aria-label", "alt"],
        check: RuleCheckEnum.MANUAL,
        shouldNotExist: true,
        criterion: "1.3",
        wcag: "4.1.2 A",
        id: "1.3.1",
        elementType: "image",
        query: {
          selectors: [
            "img[title]",
            "img[aria-labelledby]",
            "img[aria-label]",
            "img[alt]"
          ]
        },
        description:
          "if present, attributes alt, title, aria-label, aria-labelledby must be relevant",
        help: "adapt these attributes to be relevant"
      }
    }
  ]
};
describe("uuvReport", () => {
  test("transformUuvReport", async () => {
    expect(transformUuvReport(json, 1)).toStrictEqual([
      {
        compliantComment: "",
        criterium: 1,
        notApplicableComment: "",
        notCompliantComment:
          '# 1.1.1\n## Erreurs\n### Erreur 1\n#### Selecteur CSS\n`html > body > main > img:nth-of-type(1)`\n#### Html\n`<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px" alt="">`\n### Erreur 2\n#### Selecteur CSS\n`html > body > main > img:nth-of-type(2)`\n#### Html\n`<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px">`# 1.1.2\n## Erreurs\n### Erreur 1\n#### Selecteur CSS\n`html > body > main > map:nth-of-type(1) > area:nth-of-type(3)`\n#### Html\n`<area shape="poly" coords="209,249,49,249,130,139" href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank">`\n### Erreur 2\n#### Selecteur CSS\n`html > body > main > map:nth-of-type(1) > area:nth-of-type(4)`\n#### Html\n`<area shape="poly" coords="48,249,0,96,129,138" href="https://developer.mozilla.org/docs/Web/API" target="_blank">`\n### Erreur 3\n#### Selecteur CSS\n`html > body > main > map:nth-of-type(1) > area:nth-of-type(5)`\n#### Html\n`<area shape="poly" coords="0,95,128,0,128,137" href="https://developer.mozilla.org/docs/Web/CSS" target="_blank">`',
        pageId: 1,
        quickWin: false,
        status: "NOT_COMPLIANT",
        topic: 1,
        transverse: false,
        userImpact: null
      },
      {
        compliantComment: "# 1.2.1",
        criterium: 2,
        notApplicableComment: "",
        notCompliantComment: "",
        pageId: 1,
        quickWin: false,
        status: "COMPLIANT",
        topic: 1,
        transverse: false,
        userImpact: null
      },
      {
        compliantComment: "",
        criterium: 3,
        notApplicableComment:
          "# 1.3.1\n## Vérifications manuelles\n### Vérification 1\n#### Sélecteur CSS\n`html > body > main > img:nth-of-type(1)`\n#### Dom Html\n##### Element\n`undefined`\n##### Elements lié\n#### Help\n`https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.1`\n### Vérification 2\n#### Sélecteur CSS\n`html > body > main > img:nth-of-type(3)`\n#### Dom Html\n##### Element\n`undefined`\n##### Elements lié\n#### Attributes\n`aria-label=je ne suis pas pertinent, alt=logo UUV`\n#### Help\n`https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.1`\n### Vérification 3\n#### Sélecteur CSS\n`html > body > main > img:nth-of-type(4)`\n#### Dom Html\n##### Element\n`undefined`\n##### Elements lié\n#### Attributes\n`aria-label=je ne suis pas pertinent non plus`\n#### Help\n`https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/#1.3.1`",
        notCompliantComment: "",
        pageId: 1,
        quickWin: false,
        status: "NOT_APPLICABLE",
        topic: 1,
        transverse: false,
        userImpact: null
      }
    ]);
  });
  test("formatValidations - error", async () => {
    expect(formatValidations(errorValidationRule)).toStrictEqual(`# 1.1.1
## Erreurs
### Erreur 1
#### Selecteur CSS
\`html > body > main > img:nth-of-type(1)\`
#### Html
\`<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px" alt="">\`
### Erreur 2
#### Selecteur CSS
\`html > body > main > img:nth-of-type(2)\`
#### Html
\`<img src="https://orange-opensource.github.io/uuv/img/uuv.png" class="h-32px m-16px w-32px">\``);
  });

  test("formatValidations - success", async () => {
    expect(formatValidations(successValidationRule)).toBe("");
  });
});
