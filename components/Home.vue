<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-2 pb-32">
    <header class="mb-8 pt-6">
      <h1 class="text-3xl font-bold text-gray-800 text-center">Selector de Opciones</h1>
      <p class="text-gray-600 text-center mt-2">
        Selecciona las opciones en cada dropdown
      </p>
    </header>

    <main class="max-w-md mx-auto space-y-8">
      <!-- Secciones dinámicas -->
      <div
        v-for="section in sections"
        :key="section.id"
        class="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            :class="getSectionColor(section.id).bgColor"
          >
            <span class="text-white font-bold">{{ section.id }}</span>
          </div>
          {{ section.title }}
        </h2>

        <div class="space-y-4">
          <div v-for="dropdown in section.dropdowns" :key="dropdown.id">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ dropdown.label }}
            </label>
            <Dropdown
              :id="dropdown.id"
              :options="dropdown.options"
              :placeholder="dropdown.placeholder"
              :model-value="getSelectedValue(section.id, dropdown.id)"
              @update:model-value="
                (value) => handleSelection(section.id, dropdown.id, value)
              "
              @change="(value) => handleSelection(section.id, dropdown.id, value)"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Panel de resultados como componente separado -->
    <ResultsPanel
      :selected-values="selectedValues"
      :sections="sections"
      @clear-selection="clearSelection"
      @clear-all="clearAllSelections"
      @clear-section="clearSection"
      @export-data="exportData"
      @share-data="shareData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Dropdown from "./Dropdown.vue";
import ResultsPanel from "./ResultsPanel.vue";
import { useDropdownData } from "~/composables/useDropdownData";

const { getSections, getColorConfig } = useDropdownData();

// Estado reactivo para las selecciones
const selectedValues = ref({
  1: {},
  2: {},
  3: {},
});

// Obtener secciones desde el JSON
const sections = getSections();

// Obtener color para cada sección
const getSectionColor = (sectionId) => {
  const colorConfig = getColorConfig(sectionId);
  return (
    colorConfig || {
      bgColor: "bg-gray-500",
      textColor: "text-gray-600",
      bgLight: "bg-gray-50",
    }
  );
};

// Manejar selección de dropdown
const handleSelection = (sectionId, dropdownId, option) => {
  if (!selectedValues.value[sectionId]) {
    selectedValues.value[sectionId] = {};
  }

  if (option) {
    selectedValues.value[sectionId][dropdownId] = option;
  } else {
    delete selectedValues.value[sectionId][dropdownId];
  }

  // Guardar en localStorage para persistencia
  saveToLocalStorage();
};

// Obtener valor seleccionado para un dropdown específico
const getSelectedValue = (sectionId, dropdownId) => {
  return selectedValues.value[sectionId]?.[dropdownId] || null;
};

// Limpiar selección específica
const clearSelection = (sectionId, dropdownId) => {
  if (selectedValues.value[sectionId]?.[dropdownId]) {
    delete selectedValues.value[sectionId][dropdownId];
    saveToLocalStorage();
  }
};

// Limpiar sección completa
const clearSection = (sectionId) => {
  if (selectedValues.value[sectionId]) {
    selectedValues.value[sectionId] = {};
    saveToLocalStorage();
  }
};

// Limpiar todas las selecciones
const clearAllSelections = () => {
  selectedValues.value = { 1: {}, 2: {}, 3: {} };
  localStorage.removeItem("dropdownSelections");
};

// Exportar datos
const exportData = () => {
  const data = {
    timestamp: new Date().toISOString(),
    selections: selectedValues.value,
    summary: {
      total: Object.values(selectedValues.value).reduce(
        (total, section) => total + Object.keys(section).length,
        0
      ),
      bySection: {
        section1: Object.keys(selectedValues.value[1] || {}).length,
        section2: Object.keys(selectedValues.value[2] || {}).length,
        section3: Object.keys(selectedValues.value[3] || {}).length,
      },
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `selecciones-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Feedback visual
  showToast("Datos exportados exitosamente", "success");
};

// Compartir datos
const shareData = async () => {
  if (navigator.share) {
    try {
      const text = `He realizado ${Object.values(selectedValues.value).reduce(
        (total, section) => total + Object.keys(section).length,
        0
      )} selecciones en la aplicación de dropdowns.`;

      await navigator.share({
        title: "Mis selecciones",
        text: text,
        url: window.location.href,
      });

      showToast("Compartido exitosamente", "success");
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast("Error al compartir", "error");
      }
    }
  } else {
    // Fallback: copiar al portapapeles
    const text = JSON.stringify(selectedValues.value, null, 2);
    await navigator.clipboard.writeText(text);
    showToast("Datos copiados al portapapeles", "success");
  }
};

// Mostrar notificación toast
const showToast = (message, type = "info") => {
  // Implementación simple de toast
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : "bg-blue-500 text-white"
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

// Guardar en localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem("dropdownSelections", JSON.stringify(selectedValues.value));
  } catch (error) {
    console.error("Error guardando en localStorage:", error);
  }
};

// Cargar desde localStorage
const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem("dropdownSelections");
    if (saved) {
      selectedValues.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error cargando desde localStorage:", error);
  }
};

// Inicializar cargando datos guardados
onMounted(() => {
  loadFromLocalStorage();
});
</script>
