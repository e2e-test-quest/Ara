<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import PageMeta from "../../components/PageMeta";
import OnboardingModal from "../../components/report/OnboardingModal.vue";
import ReportErrors from "../../components/report/ReportErrors.vue";
import ReportImprovements from "../../components/report/ReportImprovements.vue";
import ReportNotes from "../../components/report/ReportNotes.vue";
import ReportResults from "../../components/report/ReportResults.vue";
import Dropdown from "../../components/ui/Dropdown.vue";
import TopLink from "../../components/ui/TopLink.vue";
import { useReportStore } from "../../store";
import { AuditStatus, CriteriumResultStatus } from "../../types";
import { formatBytes, formatDate, slugify } from "../../utils";

const reportStore = useReportStore();

const route = useRoute();
const uniqueId = route.params.uniqueId as string;

const hasNotes = computed(() => {
  return !!reportStore.data?.notes || reportStore.data?.notesFiles.length;
});

const hasCompliantOrNotApplicableComments = computed(() => {
  return reportStore.data?.results.some((r) => {
    return (
      (r.status === CriteriumResultStatus.COMPLIANT && r.compliantComment) ||
      (r.status === CriteriumResultStatus.NOT_APPLICABLE &&
        r.notApplicableComment)
    );
  });
});

const tabs = computed(() => [
  { title: "Résultats", component: ReportResults },
  ...(hasNotes.value ? [{ title: "Notes", component: ReportNotes }] : []),
  { title: "Détails des non-conformités", component: ReportErrors },
  ...(hasCompliantOrNotApplicableComments.value
    ? [{ title: "Points d’améliorations", component: ReportImprovements }]
    : [])
]);

const auditStatus = computed(() => {
  return reportStore.getAuditStatus;
});

const showCopyAlert = ref(false);

async function copyReportUrl() {
  const url = `${window.location.origin}/rapports/${uniqueId}`;

  navigator.clipboard.writeText(url).then(() => {
    showCopyAlert.value = true;
  });
}

function hideReportAlert() {
  showCopyAlert.value = false;
}

const onboardingModalRef = ref<InstanceType<typeof OnboardingModal>>();

watch(
  () => reportStore.data,
  (report) => {
    if (report) {
      if (
        auditStatus.value !== AuditStatus.IN_PROGRESS &&
        localStorage.getItem("confiture:seen-onboarding") !== "true"
      ) {
        onboardingModalRef.value?.show();
      }
    }
  }
);

function onOnboardingClose() {
  localStorage.setItem("confiture:seen-onboarding", "true");
}

const targetTab = ref(route.params.tab as string | undefined);
const targetTabIndex = computed(() => {
  let index = tabs.value.findIndex(
    (t) => slugify(t.title).toLowerCase() === targetTab.value?.toLowerCase()
  );
  return index === -1 ? 0 : index;
});
const router = useRouter();

function handleTabChange(tab: { title: string }) {
  // change the URL in the browser adress bar without triggering vue-router navigation
  history.pushState(
    {},
    "null",
    router.resolve({
      name: "report",
      params: {
        uniqueId,
        tab: slugify(tab.title)
      }
    }).fullPath
  );

  targetTab.value = slugify(tab.title);
}

const csvExportUrl = computed(() => `/api/reports/${uniqueId}/exports/csv`);

const csvExportFilename = computed(() => {
  if (!reportStore.data?.procedureName) {
    return "audit.csv";
  }
  return `audit-${slugify(reportStore.data.procedureName)}.csv`;
});

const csvExportSizeEstimation = computed(() => {
  return 502 + (reportStore.data?.pageDistributions.length || 0) * 318;
});

const siteUrl = computed(() => {
  if (reportStore.data) {
    return (
      reportStore.data.procedureUrl ||
      new URL(reportStore.data.context.samples[0].url).origin
    );
  }

  return null;
});
</script>

<template>
  <div
    v-if="reportStore.data && auditStatus === AuditStatus.IN_PROGRESS"
    class="fr-pt-1w in-progress-alert"
  >
    <div class="fr-alert fr-alert--warning fr-mb-6w">
      <p class="fr-alert__title">Audit en cours</p>
      <p>
        Les résultats de ce rapport sont provisoires tant que l’audit n'est pas
        terminé.
      </p>
    </div>
  </div>

  <div class="fr-mb-4w heading">
    <h1 class="fr-mb-0">Rapport d’audit accessibilité</h1>
    <div class="heading-actions">
      <button
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-links-fill"
        title="Copier le lien du rapport"
        @click="copyReportUrl"
        @blur="hideReportAlert"
      >
        Copier le lien du rapport
      </button>
      <Dropdown
        title="Télécharger"
        :button-props="{ class: 'fr-btn--secondary' }"
      >
        <ul role="list" class="fr-p-0 fr-m-0 dropdown-list">
          <li class="dropdown-item dropdown-item--with-meta">
            <a
              class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-download-fill fr-m-0"
              :href="csvExportUrl"
              :download="csvExportFilename"
            >
              Télécharger l'audit
              <span class="fr-text--xs fr-text--regular dropdown-item-meta">
                CSV – {{ formatBytes(csvExportSizeEstimation, 2) }}
              </span>
            </a>
          </li>
        </ul>
      </Dropdown>
    </div>
  </div>

  <div role="alert" aria-live="polite">
    <div
      v-if="showCopyAlert"
      class="fr-alert fr-alert--success fr-alert--sm fr-mb-2w"
    >
      <p>Le lien vers le rapport a bien été copié dans le presse-papier.</p>
    </div>
  </div>

  <template v-if="reportStore.data">
    <PageMeta
      title="Rapport d’audit accessibilité"
      :description="`Découvrez la synthèse de l'audit de ${reportStore.data?.procedureName}.`"
    />

    <OnboardingModal
      ref="onboardingModalRef"
      :accessibility-rate="reportStore.data.accessibilityRate"
      @close="onOnboardingClose"
    />

    <div class="fr-mb-6w fr-mb-md-12w header">
      <p class="fr-text--lead fr-mb-2w">{{ reportStore.data.procedureName }}</p>

      <p
        v-if="
          auditStatus === AuditStatus.IN_PROGRESS &&
          reportStore.data.creationDate
        "
        class="fr-text--light fr-mb-4w dates"
      >
        Commencé le {{ formatDate(reportStore.data.creationDate) }}
      </p>

      <p
        v-else-if="reportStore.data.publishDate"
        class="fr-text--light fr-mb-4w dates"
      >
        Publié le {{ formatDate(reportStore.data.publishDate) }}
        <template v-if="reportStore.data.updateDate">
          - Mis à jour le {{ formatDate(reportStore.data.updateDate) }}
        </template>
      </p>

      <p class="fr-mb-1v">
        URL du site :
        <a v-if="siteUrl" class="fr-link" target="_blank" :href="siteUrl">
          {{ siteUrl }}
          <span class="fr-sr-only">(nouvelle fenêtre)</span>
        </a>
        <template v-else>Non renseignée</template>
      </p>
      <p class="fr-mb-1v">
        Type d’audit :
        <strong>{{ reportStore.data.criteriaCount.total }} critères</strong>
      </p>
      <p class="fr-mb-1v">
        Référentiel :
        <strong>{{ reportStore.data.context.referencial }}</strong>
      </p>
      <p v-if="reportStore.data.context.auditorName" class="fr-mb-1v">
        Auditeur ou auditrice :
        <strong>{{ reportStore.data.context.auditorName }}</strong>
      </p>
      <p v-if="reportStore.data.procedureInitiator">
        Déclaration d’accessibilité :
        <RouterLink
          :to="{ name: 'a11y-statement', params: { uniqueId } }"
          class="fr-link"
          target="_blank"
        >
          accéder à la déclaration
          <span class="fr-sr-only">(nouvelle fenêtre)</span>
        </RouterLink>
      </p>

      <RouterLink class="fr-link" :to="{ name: 'context' }">
        Voir le contexte de l’audit
      </RouterLink>
    </div>

    <div class="fr-tabs">
      <ul class="fr-tabs__list" role="tablist" aria-label="Sections du rapport">
        <li v-for="(tab, i) in tabs" :key="tab.title" role="presentation">
          <button
            :id="`tabpanel-${slugify(tab.title)}`"
            class="fr-tabs__tab"
            tabindex="0"
            role="tab"
            :aria-selected="i === targetTabIndex"
            :aria-controls="`tabpanel-${slugify(tab.title)}-panel`"
          >
            {{ tab.title }}
            <span v-if="i === targetTabIndex" class="fr-sr-only"
              >&nbsp;Actif</span
            >
          </button>
        </li>
      </ul>
      <div
        v-for="(tab, i) in tabs"
        :id="`tabpanel-${slugify(tab.title)}-panel`"
        :key="tab.title"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': i === targetTabIndex }"
        role="tabpanel"
        :aria-labelledby="`tabpanel-${slugify(tab.title)}`"
        tabindex="0"
        v-on="{ 'dsfr.disclose': () => handleTabChange(tab) }"
      >
        <component :is="tab.component" />
      </div>
    </div>
  </template>

  <TopLink />
</template>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.heading-actions {
  display: flex;
  gap: 1rem;
}

.dates {
  color: var(--text-mention-grey);
}

.in-progress-alert {
  position: sticky;
  top: 0;
  background-color: var(--background-default-grey);
  z-index: 3;
}
</style>
