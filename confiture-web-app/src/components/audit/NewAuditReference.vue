<script lang="ts" setup>
import { ref } from "vue";

import { useDevMode } from "../../composables/useDevMode";
import { AuditReference } from "../../types";

const props = defineProps<{
  auditReference: AuditReference;
}>();

const emit = defineEmits<{
  (e: "submit", payload: { auditReference: AuditReference }): void;
}>();

const auditReference = ref(props.auditReference ?? AuditReference.RAWEB);

function submitAuditReference() {
  emit("submit", {
    auditReference: auditReference.value
  });
}

// Dev mode
const isDevMode = useDevMode();

function fillSettings() {
  auditReference.value = AuditReference.RAWEB;
}
</script>

<template>
  <form @submit.prevent="submitAuditReference">
    <div v-if="isDevMode" class="fr-mb-4w">
      <button class="fr-btn" type="button" @click="fillSettings">
        [DEV] Remplir les paramètres
      </button>
    </div>

    <p class="fr-text--sm notice">
      Sauf mentions contraires, tous les champs sont obligatoires. Au moins un
      type d’audit doit être selectionné.
    </p>

    <h3 class="fr-h6 fr-mb-1w">Audit complet</h3>
    <p class="fr-mb-2w">
      Cet audit permet de mesurer la conformité au RAWEB d’un site internet, il
      a une <strong>valeur légale</strong>.
    </p>
    <fieldset
      id="radio-rich"
      class="fr-fieldset"
      aria-labelledby="radio-rich-legend radio-rich-messages"
    >
      <legend
        id="radio-rich-legend"
        class="fr-fieldset__legend--regular fr-fieldset__legend"
      >
        Légende pour l’ensemble des éléments
      </legend>
      <div class="fr-fieldset__element">
        <div class="fr-radio-group fr-radio-rich">
          <input
            :id="`radio-rich-${AuditReference.RAWEB}`"
            v-model="auditReference"
            :value="AuditReference.RAWEB"
            type="radio"
            name="radio-rich"
          />
          <label class="fr-label" :for="`radio-rich-${AuditReference.RAWEB}`">
            {{ AuditReference.RAWEB }}
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-radio-group fr-radio-rich">
          <input
            :id="`radio-rich-${AuditReference.RAAM}`"
            v-model="auditReference"
            :value="AuditReference.RAAM"
            type="radio"
            name="radio-rich"
          />
          <label class="fr-label" :for="`radio-rich-${AuditReference.RAAM}`">
            {{ AuditReference.RAAM }}
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-radio-group fr-radio-rich">
          <input
            :id="`radio-rich-${AuditReference.RGAA}`"
            v-model="auditReference"
            :value="AuditReference.RGAA"
            type="radio"
            name="radio-rich"
          />
          <label class="fr-label" :for="`radio-rich-${AuditReference.RGAA}`">
            {{ AuditReference.RGAA }}
          </label>
        </div>
      </div>
      <div
        id="radio-rich-messages"
        class="fr-messages-group"
        aria-live="polite"
      ></div>
    </fieldset>
    <div class="actions">
      <button
        type="submit"
        class="fr-btn fr-btn--icon-right fr-icon-arrow-right-s-line"
      >
        Étape suivante
      </button>
    </div>
  </form>
</template>

<style scoped>
.notice {
  color: var(--text-mention-grey);
}

.actions {
  display: flex;
  justify-content: end;
  gap: 1rem;
}
</style>
