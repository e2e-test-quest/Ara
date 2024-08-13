import { CriteriumResult, CriteriumResultStatus } from "./types";

export enum Status {
  UNKNOWN = "unknown",
  SUCCESS = "success",
  MANUAL = "manual",
  ERROR = "error"
}

export interface NonCompliantNode {
  node?: HTMLElement;
  selector: string;
  html?: string;
}

export class QueryResult {
  constructor(
    readonly domNode: HTMLElement,
    readonly linkedNodes: HTMLElement[] = []
  ) {}
}

export interface NodeToCheckManually {
  node: QueryResult;
  selector: string;
  attributes: string;
  html: string;
  help: string;
}

export enum RuleCheckEnum {
  MANUAL = "MANUAL",
  AUTO = "AUTO"
}

export interface A11yRule {
  check: RuleCheckEnum;
  criterion: string;
  wcag: string;
  id: string;
  elementType: string;
  query: any;
  shouldNotExist: boolean;
  description?: string;
  help?: string | string[];
  attributes?: string[];
}

export class A11yResult {
  status: Status = Status.UNKNOWN;
  ruleResults: A11yRuleResult[] = [];

  constructor(readonly url?: string) {}
}

export class A11yRuleValidationResult {
  status: Status = Status.UNKNOWN;
  errorNodes: NonCompliantNode[] = [];
  nodesToCheckManually: NodeToCheckManually[] = [];

  constructor(readonly criteria: string) {}
}

export class A11yRuleResult {
  status: Status = Status.UNKNOWN;
  validations: A11yRuleValidationResult[] = [];

  constructor(
    readonly rule: A11yRule,
    readonly url?: string
  ) {}
}

export function formatValidations(results: A11yRuleResult): string {
  const validations: string[] = [`# ${results.rule.id}`];
  results.validations.map((value) => {
    if (value.errorNodes.length > 0) {
      validations.push(`## Erreurs`);
      value.errorNodes.forEach((errorNode, index) => {
        validations.push(`### Erreur ${index + 1}`);
        validations.push(`#### Selecteur CSS`);
        validations.push(`\`${errorNode.selector}\``);
        validations.push(`#### Html`);
        validations.push(`\`${errorNode.html}\``);
      });
    }
    if (value.nodesToCheckManually.length > 0) {
      validations.push(`## Vérifications manuelles`);
      value.nodesToCheckManually.forEach((check, index) => {
        validations.push(`### Vérification ${index + 1}`);
        validations.push(`#### Sélecteur CSS`);
        validations.push(`\`${check.selector}\``);
        validations.push(`#### Dom Html`);
        validations.push(`##### Element`);
        validations.push(`\`${check.node.domNode.outerHTML}\``);
        validations.push(`##### Elements lié`);
        check.node.linkedNodes.map((linkedNode, index) => {
          validations.push(`##### Element ${index + 1}`);
          validations.push(`\`${linkedNode.outerHTML}\``);
        });
        if (check.attributes) {
          validations.push(`#### Attributes`);
          validations.push(`\`${check.attributes}\``);
        }
        if (check.help) {
          validations.push(`#### Help`);
          validations.push(`\`${check.help}\``);
        }
      });
    }
  });
  if (validations.length <= 1) {
    return "";
  }
  return validations.join("\n");
}

export function transformUuvReport(
  uuvReport: A11yResult,
  pageId: number
): CriteriumResult[] {
  const result: CriteriumResult[] = [];
  const resultGroupedByCriterium = uuvReport.ruleResults.reduce(
    (result: any, currentValue: A11yRuleResult) => {
      (result[currentValue.rule.criterion] =
        result[currentValue.rule.criterion] || []).push(currentValue);
      return result;
    },
    {}
  );
  Object.keys(resultGroupedByCriterium).map((criteriumId: string) => {
    const ids = criteriumId.split(".").map((num) => parseInt(num, 10));
    const topic = ids[0];
    const criterium = ids[1];
    let status = CriteriumResultStatus.NOT_TESTED;
    const compliantComment: string[] = [];
    const notCompliantComment: string[] = [];
    const notApplicableComment: string[] = [];
    resultGroupedByCriterium[criteriumId].map((value: A11yRuleResult) => {
      switch (value.status) {
        case Status.ERROR:
          status = CriteriumResultStatus.NOT_COMPLIANT;
          notCompliantComment.push(formatValidations(value));
          break;
        case Status.SUCCESS:
          if (status !== CriteriumResultStatus.NOT_COMPLIANT) {
            status = CriteriumResultStatus.COMPLIANT;
            compliantComment.push(formatValidations(value));
          }
          break;
        case Status.MANUAL:
          if (status !== CriteriumResultStatus.NOT_COMPLIANT) {
            //FIXME SSE pour pouvoir afficher le commentaire nativement
            status = CriteriumResultStatus.NOT_APPLICABLE;
            notApplicableComment.push(formatValidations(value));
          }
          break;
        case Status.UNKNOWN:
          if (status !== CriteriumResultStatus.NOT_COMPLIANT) {
            status = CriteriumResultStatus.NOT_APPLICABLE;
            notApplicableComment.push(formatValidations(value));
          }
          break;
        default:
          break;
      }
    });
    result.push({
      topic: topic,
      criterium: criterium,
      status: status,
      pageId: pageId,
      quickWin: false,
      transverse: false,
      compliantComment: compliantComment.join(""),
      notCompliantComment: notCompliantComment.join(""),
      notApplicableComment: notApplicableComment.join(""),
      userImpact: null,
      exampleImages: []
    } as CriteriumResult);
  });
  return result;
}
