import { defineStore } from "pinia";

import raamCriteria from "../raam/criteres.json";
import raamMethodologies from "../raam/methodologies.json";
import rawebCriteria from "../raweb/criteres.json";
import rawebMethodologies from "../raweb/methodologies.json";
import rgaaCriteria from "../rgaa/criteres.json";
import rgaaMethodologies from "../rgaa/methodologies.json";
import { AuditReference, AuditType } from "../types";
export interface ReferenceStoreState {
  criteria: any | null;
  methodologies: any | null;
  reference: AuditReference | null;
}

export const RGAA_FAST_CRITERIA = [
  { topic: 1, criterium: 1 },
  { topic: 3, criterium: 1 },
  { topic: 4, criterium: 1 },
  { topic: 4, criterium: 10 },
  { topic: 5, criterium: 3 },
  { topic: 5, criterium: 7 },
  { topic: 6, criterium: 1 },
  { topic: 6, criterium: 2 },
  { topic: 7, criterium: 1 },
  { topic: 7, criterium: 3 },
  { topic: 8, criterium: 3 },
  { topic: 8, criterium: 4 },
  { topic: 8, criterium: 5 },
  { topic: 9, criterium: 1 },
  { topic: 10, criterium: 3 },
  { topic: 10, criterium: 6 },
  { topic: 10, criterium: 7 },
  { topic: 11, criterium: 1 },
  { topic: 11, criterium: 2 },
  { topic: 11, criterium: 5 },
  { topic: 11, criterium: 6 },
  { topic: 11, criterium: 9 },
  { topic: 11, criterium: 10 },
  { topic: 12, criterium: 8 },
  { topic: 12, criterium: 9 }
];

export const RAWEB_FAST_CRITERIA = [
  { topic: 1, criterium: 1 },
  { topic: 1, criterium: 2 },
  { topic: 1, criterium: 3 },
  { topic: 1, criterium: 4 },
  { topic: 1, criterium: 5 },
  { topic: 1, criterium: 6 },
  { topic: 1, criterium: 7 },
  { topic: 2, criterium: 1 },
  { topic: 3, criterium: 1 },
  { topic: 3, criterium: 2 },
  { topic: 4, criterium: 1 },
  { topic: 4, criterium: 2 },
  { topic: 4, criterium: 3 },
  { topic: 4, criterium: 4 },
  { topic: 4, criterium: 8 },
  { topic: 4, criterium: 9 },
  { topic: 4, criterium: 10 },
  { topic: 4, criterium: 11 },
  { topic: 5, criterium: 6 },
  { topic: 5, criterium: 7 },
  { topic: 6, criterium: 1 },
  { topic: 6, criterium: 2 },
  { topic: 7, criterium: 3 },
  { topic: 8, criterium: 1 },
  { topic: 8, criterium: 2 },
  { topic: 8, criterium: 3 },
  { topic: 8, criterium: 4 },
  { topic: 8, criterium: 5 },
  { topic: 8, criterium: 6 },
  { topic: 8, criterium: 7 },
  { topic: 8, criterium: 8 },
  { topic: 9, criterium: 1 },
  { topic: 9, criterium: 2 },
  { topic: 10, criterium: 7 },
  { topic: 10, criterium: 8 },
  { topic: 10, criterium: 9 },
  { topic: 10, criterium: 10 },
  { topic: 10, criterium: 14 },
  { topic: 11, criterium: 1 },
  { topic: 11, criterium: 2 },
  { topic: 11, criterium: 5 },
  { topic: 11, criterium: 6 },
  { topic: 11, criterium: 7 },
  { topic: 11, criterium: 9 },
  { topic: 11, criterium: 10 },
  { topic: 12, criterium: 6 },
  { topic: 12, criterium: 7 },
  { topic: 12, criterium: 8 },
  { topic: 12, criterium: 9 },
  { topic: 12, criterium: 11 },
  { topic: 13, criterium: 1 },
  { topic: 13, criterium: 7 },
  { topic: 13, criterium: 8 }
];
export const RGAA_COMPLEMENTARY_CRITERIA = [
  ...RGAA_FAST_CRITERIA,
  { topic: 1, criterium: 3 },
  { topic: 1, criterium: 5 },
  { topic: 1, criterium: 6 },
  { topic: 1, criterium: 7 },
  { topic: 4, criterium: 2 },
  { topic: 4, criterium: 4 },
  { topic: 4, criterium: 8 },
  { topic: 4, criterium: 9 },
  { topic: 5, criterium: 4 },
  { topic: 5, criterium: 6 },
  { topic: 7, criterium: 2 },
  { topic: 8, criterium: 2 },
  { topic: 8, criterium: 6 },
  { topic: 8, criterium: 10 },
  { topic: 10, criterium: 2 },
  { topic: 10, criterium: 8 },
  { topic: 10, criterium: 9 },
  { topic: 10, criterium: 10 },
  { topic: 13, criterium: 1 },
  { topic: 13, criterium: 3 },
  { topic: 13, criterium: 4 },
  { topic: 13, criterium: 5 },
  { topic: 13, criterium: 6 },
  { topic: 13, criterium: 7 },
  { topic: 13, criterium: 8 }
];

export const RAWEB_COMPLEMENTARY_CRITERIA = [...RAWEB_FAST_CRITERIA];

export function fetchReferenceFile(auditReference: AuditReference) {
  let criteria = null;
  let methodologies = null;
  switch (auditReference) {
    case AuditReference.RAWEB:
      criteria = rawebCriteria;
      methodologies = rawebMethodologies;
      break;
    case AuditReference.RAAM:
      criteria = raamCriteria;
      methodologies = raamMethodologies;
      break;
    case AuditReference.RGAA:
      criteria = rgaaCriteria;
      methodologies = rgaaMethodologies;
      break;
    default:
      break;
  }
  return { criteria: criteria, methodologies: methodologies };
}
export const useReferenceStore = defineStore("reference", {
  state: (): ReferenceStoreState => ({
    criteria: null,
    methodologies: null,
    reference: null
  }),
  actions: {
    async fetchReference(auditReference: AuditReference) {
      this.reference = auditReference;
      const referenceFile = fetchReferenceFile(auditReference);
      this.criteria = referenceFile.criteria;
      this.methodologies = referenceFile.methodologies;
    },

    getCriteria() {
      return this.criteria.topics.flatMap((topic) =>
        topic.criteria.map((c) => ({
          topic: topic.number,
          criterium: c.criterium.number
        }))
      );
    },
    getFastCriteria() {
      const result = [];
      switch (this.reference!) {
        case AuditReference.RAWEB:
          result.push(...RAWEB_FAST_CRITERIA);
          break;
        case AuditReference.RAAM:
          break;
        case AuditReference.RGAA:
          result.push(...RGAA_FAST_CRITERIA);
          break;
        default:
          break;
      }
      return result;
    },
    getComplementaryCriteria() {
      const result = [];
      switch (this.reference!) {
        case AuditReference.RAWEB:
          result.push(...RAWEB_COMPLEMENTARY_CRITERIA);
          break;
        case AuditReference.RAAM:
          break;
        case AuditReference.RGAA:
          result.push(...RGAA_COMPLEMENTARY_CRITERIA);
          break;
        default:
          break;
      }
      return result;
    },
    getCriteriaByAuditType() {
      return {
        [AuditType.FULL]: this.getCriteria(),
        [AuditType.FAST]: this.getFastCriteria(),
        [AuditType.COMPLEMENTARY]: this.getComplementaryCriteria()
      };
    }
  }
});
