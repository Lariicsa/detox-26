<template>
  <div
    class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl transition-all duration-300 ease-in-out"
    :class="[isExpanded ? 'h-[96vh] rounded-t-3xl' : 'h-auto max-h-[20vh] rounded-t-3xl']"
    :style="{ zIndex: 999 }"
  >
    <!-- Header del panel - Siempre visible -->
    <div
      class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl"
      :class="{ 'shadow-sm': isExpanded }"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg
            class="w-6 h-6 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-semibold text-gray-800">
            Selecciones Actuales
            <span
              v-if="totalSelections > 0"
              class="ml-2 text-sm font-normal text-gray-500"
            >
              ({{ totalSelections }})
            </span>
          </h3>
        </div>

        <div class="flex items-center space-x-4">
          <button
            v-if="totalSelections > 0"
            @click="emit('clearAll')"
            class="text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-1 rounded-lg hover:bg-red-50 flex items-center"
          >
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Limpiar
          </button>

          <button
            @click="toggleExpand"
            class="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            :aria-label="isExpanded ? 'Contraer panel' : 'Expandir panel'"
          >
            <svg
              class="w-6 h-6 transition-transform duration-300"
              :class="{ 'rotate-180': isExpanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Indicador de arrastre (solo mobile) -->
      <div
        class="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
        @click="toggleExpand"
      />
    </div>

    <!-- Contenido del panel -->
    <div
      class="h-full overflow-hidden"
      :class="{
        'overflow-y-auto': isExpanded,
        'overflow-y-hidden': !isExpanded,
      }"
    >
      <div class="p-6">
        <!-- Estado vacío -->
        <div v-if="totalSelections === 0" class="text-center py-8 text-gray-500">
          <div class="w-20 h-20 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p class="font-medium text-gray-600">No hay selecciones</p>
          <p class="text-sm mt-2 text-gray-500 max-w-xs mx-auto">
            Selecciona opciones en los dropdowns de arriba para ver los resultados aquí
          </p>
        </div>

        <!-- Contenido con selecciones -->
        <div v-else class="space-y-6">
          <!-- Sección 1 -->
          <section
            v-if="selectedValues[1] && Object.keys(selectedValues[1]).length > 0"
            class="animate-fadeIn"
          >
            <header class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-blue-700 flex items-center">
                <div
                  class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2"
                >
                  <span class="text-blue-600 text-xs font-bold">1</span>
                </div>
                Sección 1
                <span class="ml-2 text-sm font-normal text-gray-500">
                  ({{ Object.keys(selectedValues[1]).length }})
                </span>
              </h4>
              <button
                v-if="isExpanded"
                @click="clearSection(1)"
                class="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Limpiar sección
              </button>
            </header>
            <div class="space-y-3 ml-8">
              <div
                v-for="(value, dropdownId) in selectedValues[1]"
                :key="dropdownId"
                class="bg-gradient-to-r from-blue-50 to-blue-25 border border-blue-100 rounded-xl p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div
                      class="text-xs uppercase tracking-wider text-blue-500 font-semibold mb-1"
                    >
                      {{ getDropdownLabel(1, dropdownId) }}
                    </div>
                    <div class="text-gray-800 font-medium">{{ value.label }}</div>
                    <div class="text-xs text-gray-500 mt-1">Valor: {{ value.value }}</div>
                  </div>
                  <button
                    @click="emit('clearSelection', 1, dropdownId)"
                    class="ml-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                    :title="`Eliminar ${getDropdownLabel(1, dropdownId)}`"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 2 -->
          <section
            v-if="selectedValues[2] && Object.keys(selectedValues[2]).length > 0"
            class="animate-fadeIn"
          >
            <header class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-green-700 flex items-center">
                <div
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2"
                >
                  <span class="text-green-600 text-xs font-bold">2</span>
                </div>
                Sección 2
                <span class="ml-2 text-sm font-normal text-gray-500">
                  ({{ Object.keys(selectedValues[2]).length }})
                </span>
              </h4>
              <button
                v-if="isExpanded"
                @click="clearSection(2)"
                class="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Limpiar sección
              </button>
            </header>
            <div class="space-y-3 ml-8">
              <div
                v-for="(value, dropdownId) in selectedValues[2]"
                :key="dropdownId"
                class="bg-gradient-to-r from-green-50 to-green-25 border border-green-100 rounded-xl p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div
                      class="text-xs uppercase tracking-wider text-green-500 font-semibold mb-1"
                    >
                      {{ getDropdownLabel(2, dropdownId) }}
                    </div>
                    <div class="text-gray-800 font-medium">{{ value.label }}</div>
                    <div class="text-xs text-gray-500 mt-1">Valor: {{ value.value }}</div>
                  </div>
                  <button
                    @click="emit('clearSelection', 2, dropdownId)"
                    class="ml-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                    :title="`Eliminar ${getDropdownLabel(2, dropdownId)}`"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 3 -->
          <section
            v-if="selectedValues[3] && Object.keys(selectedValues[3]).length > 0"
            class="animate-fadeIn"
          >
            <header class="flex items-center justify-between mb-3">
              <h4 class="font-medium text-purple-700 flex items-center">
                <div
                  class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2"
                >
                  <span class="text-purple-600 text-xs font-bold">3</span>
                </div>
                Sección 3
                <span class="ml-2 text-sm font-normal text-gray-500">
                  ({{ Object.keys(selectedValues[3]).length }})
                </span>
              </h4>
              <button
                v-if="isExpanded"
                @click="clearSection(3)"
                class="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Limpiar sección
              </button>
            </header>
            <div class="space-y-3 ml-8">
              <div
                v-for="(value, dropdownId) in selectedValues[3]"
                :key="dropdownId"
                class="bg-gradient-to-r from-purple-50 to-purple-25 border border-purple-100 rounded-xl p-4 transition-all duration-200 hover:shadow-sm"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div
                      class="text-xs uppercase tracking-wider text-purple-500 font-semibold mb-1"
                    >
                      {{ getDropdownLabel(3, dropdownId) }}
                    </div>
                    <div class="text-gray-800 font-medium">{{ value.label }}</div>
                    <div class="text-xs text-gray-500 mt-1">Valor: {{ value.value }}</div>
                  </div>
                  <button
                    @click="emit('clearSelection', 3, dropdownId)"
                    class="ml-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                    :title="`Eliminar ${getDropdownLabel(3, dropdownId)}`"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Resumen cuando está contraído -->
          <div v-if="!isExpanded && totalSelections > 0" class="text-center py-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium">{{ totalSelections }}</span> selecciones
              realizadas
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Expande para ver detalles
              <svg
                class="w-4 h-4 inline-block ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </p>
          </div>

          <!-- Acciones cuando está expandido -->
          <div
            v-if="isExpanded && totalSelections > 0"
            class="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 -mx-6 px-6 mt-6"
          >
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="emit('exportData')"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar datos
              </button>
              <button
                @click="emit('shareData')"
                class="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  selectedValues: {
    type: Object,
    required: true,
    default: () => ({ 1: {}, 2: {}, 3: {} }),
  },
  sections: {
    type: Array,
    required: true,
    default: () => [],
  },
  defaultExpanded: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "clearSelection",
  "clearAll",
  "clearSection",
  "exportData",
  "shareData",
]);

const isExpanded = ref(props.defaultExpanded);
const startY = ref(0);
const startHeight = ref(0);
const isDragging = ref(false);

// Calcular total de selecciones
const totalSelections = computed(() => {
  return Object.values(props.selectedValues).reduce((total, section) => {
    return total + Object.keys(section).length;
  }, 0);
});

// Obtener label de un dropdown
const getDropdownLabel = (sectionId, dropdownId) => {
  const section = props.sections.find((s) => s.id === sectionId);
  if (!section) return "";

  const dropdown = section.dropdowns.find((d) => d.id === dropdownId);
  return dropdown ? dropdown.label : "";
};

// Limpiar sección completa
const clearSection = (sectionId) => {
  emit("clearSection", sectionId);
};

// Alternar expansión
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

// Configurar arrastre para móvil
const handleTouchStart = (e) => {
  isDragging.value = true;
  startY.value = e.touches[0].clientY;
  startHeight.value = isExpanded.value ? 90 : 30;
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;

  const currentY = e.touches[0].clientY;
  const deltaY = startY.value - currentY;
  const newHeight = Math.min(
    95,
    Math.max(20, startHeight.value + (deltaY / window.innerHeight) * 100)
  );

  // Si el arrastre es significativo, cambiar estado
  if (Math.abs(deltaY) > 50) {
    isExpanded.value = newHeight > 60;
    isDragging.value = false;
  }
};

const handleTouchEnd = () => {
  isDragging.value = false;
};

// Manejar teclado
const handleKeyDown = (e) => {
  if (e.key === "Escape" && isExpanded.value) {
    isExpanded.value = false;
  }
};

// Auto-expandir cuando hay muchas selecciones
watch(totalSelections, (newTotal) => {
  if (newTotal >= 3 && !isExpanded.value) {
    // Auto-expandir después de un breve delay
    setTimeout(() => {
      isExpanded.value = true;
    }, 500);
  }
});

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
/* Animaciones personalizadas */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transición suave para el panel */
.transition-all {
  transition-property: all;
}

/* Scroll personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
