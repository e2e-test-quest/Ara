<script lang="ts" setup>
import { CriteriumResult } from "../../types";
import { A11yResult } from "../../types/uuv-report";
import { readJson } from "../../utils";

//FIXME rajouter props et le fichier dans l'objet de soumission pour conserver le fichier quand on retourne à la step 1
const emit = defineEmits<{
  (e: "upload-file", uuvReport: A11yResult): void;
  (e: "submit", payload: { result: CriteriumResult[] }): void;
  (e: "previous"): void;
}>();

function goToPreviousStep() {
  emit("previous");
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    try {
      const fileContent = await readJson(file);
      if (fileContent) {
        const uuvReport: A11yResult = JSON.parse(fileContent);
        emit("upload-file", uuvReport);
      } else {
        console.error("Failed to read the file with bad format:", file.type);
      }
    } catch (error) {
      console.error("Failed to read and parse the file:", error);
    }
  } else {
    emit("submit", {
      result: []
    });
  }
}
</script>

<template>
  <form @submit.prevent="handleFileChange">
    <p class="fr-text--sm notice">
      Vous pouvez initialiser un audit avec
      <a
        class="fr-link"
        target="_blank"
        href="https://www.npmjs.com/package/@uuv/a11y"
        >@uuv/a11y<span class="fr-sr-only">(nouvelle fenêtre)</span></a
      >
    </p>

    <h3 class="fr-h6 fr-mb-1w"></h3>
    <p class="fr-mb-2w">
      Cet audit permet de mesurer la conformité au RAWEB d’un site internet, il
      a une <strong>valeur légale</strong>.
    </p>
    <div class="fr-upload-group">
      <label class="fr-label" for="file-upload">Importer un rapport UUV </label>
      <input
        id="file-upload"
        class="fr-upload"
        type="file"
        name="file-upload"
        @change="handleFileChange"
      />
    </div>
    <div class="actions">
      <button
        type="button"
        class="fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-arrow-left-s-line"
        @click="goToPreviousStep"
      >
        Étape précédente
      </button>
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

.fr-upload-group {
  border: 1px solid grey;
  position: relative;
  margin-bottom: 1rem;
  padding: 2rem;
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
