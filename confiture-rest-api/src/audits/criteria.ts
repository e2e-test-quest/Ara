import { AuditType } from "@prisma/client";
import * as RAWEB1 from "../raweb1.json";
import * as RGAA from "../rgaa.json";
import * as RAAM from "../raam.json";

interface CriteriumId {
  topic: number;
  criterium: number;
}

function getCriteria(auditReference: AuditReference) {
  return getCriteriaFile(auditReference).topics.flatMap((topic) =>
    topic.criteria.map((c) => ({
      topic: topic.number,
      criterium: c.criterium.number
    }))
  );
}

/**
 * Criteria list for "fast" audits.
 * Source: https://design.numerique.gouv.fr/outils/audit-rapide/
 */
function getFast(auditReference: AuditReference) {
  switch (auditReference) {
    case AuditReference.RAWEB:
      return [
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
    case AuditReference.RAAM:
      return [];
    case AuditReference.RGAA:
      return [
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
  }
}
/**
 * Criteria list for "complementary" audits.
 * Source:
 * - https://design.numerique.gouv.fr/outils/audit-rapide/
 * - https://design.numerique.gouv.fr/outils/audit-complementaire/
 */
function getComplementary(auditReference: AuditReference) {
  switch (auditReference) {
    case AuditReference.RAWEB:
      return [
        ...getFast(auditReference),
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
    case AuditReference.RAAM:
      return [...getFast(auditReference)];
    case AuditReference.RGAA:
      return [
        ...getFast(auditReference),
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
  }
}
export function getCriteriaByAuditTypeAndReference(
  auditType: AuditType,
  reference: AuditReference
): CriteriumId[] {
  switch (auditType) {
    case "FULL":
      return getCriteria(reference);
    case "COMPLEMENTARY":
      return getComplementary(reference);
    case "FAST":
      return getFast(reference);
  }
}

export enum AuditReference {
  RAWEB = "RAWEB",
  RAAM = "RAAM",
  RGAA = "RGAA"
}

export function getCriteriaFile(auditReference: AuditReference) {
  switch (auditReference) {
    case AuditReference.RAWEB:
      return RAWEB1;
    case AuditReference.RAAM:
      return RAAM;
    case AuditReference.RGAA:
      return RGAA;
  }
}
