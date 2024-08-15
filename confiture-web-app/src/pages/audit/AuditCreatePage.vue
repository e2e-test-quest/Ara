<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

import LeaveModal from "../../components/audit/LeaveModal.vue";
import NewAuditContactDetails from "../../components/audit/NewAuditContactDetails.vue";
import NewAuditPages from "../../components/audit/NewAuditPages.vue";
import NewAuditReference from "../../components/audit/NewAuditReference.vue";
import NewAuditType from "../../components/audit/NewAuditType.vue";
import NewUUVReport from "../../components/audit/NewUUVReport.vue";
import PageMeta from "../../components/PageMeta";
import { useNotifications } from "../../composables/useNotifications";
import router from "../../router";
import { useAuditStore, useResultsStore } from "../../store";
import { useAccountStore } from "../../store/account";
import { useReferenceStore } from "../../store/reference";
import { AuditReference, AuditType, CreateAuditRequestData } from "../../types";
import { A11yResult, transformUuvReport } from "../../types/uuv-report";
import { captureWithPayloads } from "../../utils";

const leaveModalRef = ref<InstanceType<typeof LeaveModal>>();
const leaveModalDestination = ref<string>("");
const confirmedLeave = ref(false);

function showLeaveModal() {
  leaveModalRef.value?.show();
}

function confirmLeave() {
  // Not closing the modal before route navigation would leave a dangling
  // "trap focus" event handler on the document body, which would break further
  // tab navigation
  leaveModalRef.value?.hide();

  confirmedLeave.value = true;
  router.push(leaveModalDestination.value);
}

function cancelLeave() {
  leaveModalRef.value?.hide();
}

// Display leave modal when navigating to another route
// FIXME: it causes bug with links on the page
onBeforeRouteLeave((to) => {
  if (!isSubmitting.value && !confirmedLeave.value) {
    leaveModalDestination.value = to.fullPath;
    showLeaveModal();
    return false;
  }
});

// Display the native browser confirm modal when leaving site
function onBeforeUnload(e: BeforeUnloadEvent) {
  e.preventDefault();
}

onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", onBeforeUnload);
});

const accountStore = useAccountStore();

// Steps management
const currentStep = ref(0);
const steps = [
  "Choisissez un type de référentiel",
  "A partir de UUV",
  "Choisissez un type d’audit",
  "Renseignez l’échantillon des pages à auditer",
  ...(accountStore.account && accountStore.account.name
    ? []
    : ["Indiquez vos coordonnées"])
];
const stepHeadingRef = ref<HTMLHeadingElement>();

// Setup audit object
const audit = ref<CreateAuditRequestData>({
  auditType: null,
  procedureName: "",
  pages: [{ name: "", url: "" }],
  auditorEmail: accountStore.account?.email ?? "",
  auditorName: accountStore.account?.name ?? "",
  auditReference: AuditReference.RAWEB,
  result: undefined
});

// Default pages per audit type
const fullDefaultPages = [
  { name: "Accueil", url: "" },
  { name: "Contact", url: "" },
  { name: "Mentions légales", url: "" },
  { name: "Accessibilité", url: "" },
  { name: "Plan du site", url: "" },
  { name: "Aide", url: "" },
  { name: "Authentification", url: "" }
];

const fastAndComplementaryDefaultPages = [{ name: "Accueil", url: "" }];

// Update default pages except if pages has been changed by user
const pagesArePristine = ref(true);

const auditType = computed(() => {
  return audit.value.auditType;
});

watch(auditType, (newValue) => {
  if (
    (newValue === AuditType.FAST || newValue === AuditType.COMPLEMENTARY) &&
    pagesArePristine.value
  ) {
    audit.value.pages = [...fastAndComplementaryDefaultPages];
  }

  if (newValue === AuditType.FULL && pagesArePristine.value) {
    audit.value.pages = [...fullDefaultPages];
  }
});

async function updateAudit(uuvReport: A11yResult) {
  //FIXME SSE à dynamiser la pageID
  const pageId = 1;
  if (uuvReport) {
    audit.value.result = { data: transformUuvReport(uuvReport, pageId) };
  }
  await submitStep(audit.value);
}

async function updateReference(payload: Partial<CreateAuditRequestData>) {
  await referenceStore.fetchReference(
    payload.auditReference ?? AuditReference.RAWEB
  );
  await submitStep(payload);
}

async function submitStep(payload: Partial<CreateAuditRequestData>) {
  audit.value = {
    ...audit.value,
    ...payload
  };
  if (currentStep.value === steps.length - 1) {
    submitAuditSettings();
  } else if (audit.value.auditReference === AuditReference.RAAM) {
    currentStep.value += 2;
  } else {
    currentStep.value += 1;

    await nextTick();
    stepHeadingRef.value?.focus();
  }
}

// Final submission
const isSubmitting = ref(false);
const auditStore = useAuditStore();
const referenceStore = useReferenceStore();
const resultsStore = useResultsStore();
const notify = useNotifications();

function submitAuditSettings() {
  isSubmitting.value = true;

  // Update user profile when their name is not known.
  if (
    accountStore.account &&
    audit.value.auditorName &&
    !accountStore.account?.name
  ) {
    // Since this update is not necessary for the audit to be created, we ignore eventual errors.
    accountStore
      .updateProfile({ name: audit.value.auditorName })
      .catch(captureWithPayloads);
  }

  auditStore
    .createAudit(audit.value)
    .then(async (auditResult) => {
      if (!accountStore.account) {
        auditStore.showAuditEmailAlert = true;
      }
      if (
        audit.value.result?.data &&
        audit.value.result.data.length &&
        audit.value.result.data.length > 0
      ) {
        audit.value.result.data.forEach(
          (value) => (value.pageId = auditResult.pages[0].id)
        );
        await resultsStore.fetchResults(auditResult.editUniqueId);
        console.log(resultsStore.allResults);
        resultsStore.allResults?.forEach((data) => {
          const auditUpdated = audit.value.result?.data.find(
            (auditUpdated) =>
              auditUpdated.criterium === data.criterium &&
              auditUpdated.topic === data.topic &&
              auditUpdated.pageId === data.pageId
          );
          if (auditUpdated) {
            data.transverse = auditUpdated.transverse;
            data.status = auditUpdated.status;
            data.compliantComment = auditUpdated.compliantComment;
            data.exampleImages = auditUpdated.exampleImages;
            data.notApplicableComment = auditUpdated.notApplicableComment;
            data.quickWin = auditUpdated.quickWin;
            data.notCompliantComment = auditUpdated.notCompliantComment;
            data.userImpact = auditUpdated.userImpact;
          }
        }) ?? [];
        await resultsStore.updateResults(
          auditResult.editUniqueId,
          resultsStore.allResults ?? []
        );
      }

      return router.push({
        name: "audit-overview",
        params: { uniqueId: auditResult.editUniqueId }
      });
    })
    .catch((err) => {
      console.error(err);
      notify(
        "error",
        "Une erreur est survenue",
        "Un problème empêche la sauvegarde de vos données. Contactez-nous à l'adresse contact@design.numerique.gouv.fr si le problème persiste."
      );
      captureWithPayloads(err);
    })
    .finally(() => {
      isSubmitting.value = false;
    });
}

// Previous step button
async function goToPreviousStep() {
  if (audit.value.auditReference === AuditReference.RAAM) {
    currentStep.value -= 2;
  } else {
    currentStep.value -= 1;
  }

  await nextTick();
  stepHeadingRef.value?.focus();
}
</script>

<template>
  <PageMeta
    title="Démarrer un audit"
    description="Pour paramétrer un nouvel audit indiquez le type d'audit, renseignez l'échantillon des pages à auditer, nommez votre audit et indiquer vos coordonnées pour recevoir les liens de votre audit, de votre rapport d'audit généré automatiquement et de votre déclaration d'accessibilité"
  />

  <div class="content">
    <h1 class="fr-mb-6w">Démarrer un audit</h1>
    <div class="fr-stepper fr-mb-9v">
      <h2 ref="stepHeadingRef" tabindex="-1" class="fr-stepper__title fr-h2">
        {{ steps[currentStep] }}
        <span class="fr-stepper__state">
          Étape {{ currentStep + 1 }} sur {{ steps.length }}
        </span>
      </h2>
      <div
        class="fr-stepper__steps"
        :data-fr-current-step="currentStep + 1"
        :data-fr-steps="steps.length"
      />
    </div>
    <NewAuditReference v-if="currentStep === 0" @submit="updateReference" />
    <NewUUVReport
      v-if="
        (audit.auditReference === AuditReference.RAWEB ||
          audit.auditReference === AuditReference.RGAA) &&
        currentStep === 1
      "
      @upload-file="updateAudit"
      @previous="goToPreviousStep"
      @submit="submitStep"
    />
    <NewAuditType
      v-if="currentStep === 2"
      :audit-reference="audit.auditReference"
      :audit-type="audit.auditType"
      :procedure-name="audit.procedureName"
      @previous="goToPreviousStep"
      @submit="submitStep"
    />
    <NewAuditPages
      v-else-if="currentStep === 3"
      :audit-type="audit.auditType"
      :pages="audit.pages"
      @previous="goToPreviousStep"
      @submit="submitStep"
      @change="pagesArePristine = false"
    />
    <NewAuditContactDetails
      v-else-if="currentStep === 4"
      :email="audit.auditorEmail"
      :name="audit.auditorName"
      @previous="goToPreviousStep"
      @submit="submitStep"
    />
  </div>

  <LeaveModal
    ref="leaveModalRef"
    title="Le paramétrage de l’audit n’est pas terminé"
    icon="fr-icon-warning-line"
    confirm="Abandonner le paramétrage de l’audit"
    cancel="Poursuivre le paramétrage de l’audit"
    @confirm="confirmLeave"
    @cancel="cancelLeave"
  >
    <p>
      Aucune des informations saisies ne sera enregistrée. Souhaitez-vous
      vraiment abandonner le paramétrage de l’audit ?
    </p>
  </LeaveModal>
</template>

<style scoped>
.content {
  max-width: 49.5rem;
  margin: 0 auto;
}
</style>
