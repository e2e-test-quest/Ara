import ky from "ky";
import { defineStore } from "pinia";

import { AuditReport, AuditStatus, CriteriumResultStatus } from "../types";
import { useReferenceStore } from "./reference";

export interface ReportStoreState {
  data: AuditReport | null;
}

export const useReportStore = defineStore("report", {
  state: (): ReportStoreState => ({
    data: null
  }),
  actions: {
    async fetchReport(consultUniqueId: string) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = (await ky
        .get(`/api/reports/${consultUniqueId}`)
        .json()) as AuditReport;
      this.data = data;
    }
  },
  getters: {
    /**
     * Return the audit status based on:
     * - the number of results (criteria count * number of pages)
     * - the status of each criteria
     * - the completion of a11y statement
     */
    getAuditStatus(): AuditStatus {
      const referenceStore = useReferenceStore();
      if (
        (this.data &&
          this.data.results.length !==
            referenceStore.getCriteriaByAuditType()[this.data?.auditType]
              .length *
              this.data.pageDistributions.length) ||
        this.data?.results.some(
          (r) => r.status === CriteriumResultStatus.NOT_TESTED
        )
      ) {
        return AuditStatus.IN_PROGRESS;
      }

      if (this.data?.procedureInitiator) {
        return AuditStatus.PUBLISHABLE;
      }
      return AuditStatus.COMPLETED;
    }
  }
});
