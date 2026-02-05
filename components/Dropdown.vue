<template>
  <div class="relative w-32" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      :class="[
        'w-full px-4 py-3 text-left bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none transition-all duration-200 flex justify-between items-center',
        isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300',
        selectedOption ? 'text-gray-900' : 'text-gray-500',
      ]"
      :aria-expanded="isOpen"
      :aria-label="selectedOption ? `Seleccionado: ${selectedOption.label}` : placeholder"
    >
      <span class="font-medium truncate">
        {{ selectedOption?.label || placeholder }}
      </span>
      <svg
        class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
        :class="[isOpen ? 'text-blue-500 rotate-180' : 'text-gray-400']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        role="listbox"
      >
        <ul class="py-1">
          <li
            v-for="(option, index) in options"
            :key="option.value"
            @click="selectOption(option)"
            :class="[
              'px-4 py-3 cursor-pointer transition-colors duration-150',
              option.value === selectedOption?.value
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50',
            ]"
            role="option"
            :aria-selected="option.value === selectedOption?.value"
            :tabindex="0"
            @keydown.enter="selectOption(option)"
            @keydown.space.prevent="selectOption(option)"
          >
            <div class="flex items-center justify-between">
              <span>{{ option.label }}</span>
              <svg
                v-if="option.value === selectedOption?.value"
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Selecciona una opción",
  },
  modelValue: {
    type: Object,
    default: null,
  },
  id: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const isOpen = ref(false);
const dropdownRef = ref(null);
const selectedOption = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue;
  }
);

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    // Enfocar el primer elemento si está abierto
    const firstOption = dropdownRef.value?.querySelector('[role="option"]');
    firstOption?.focus();
  }
};

const selectOption = (option) => {
  selectedOption.value = option;
  emit("update:modelValue", option);
  emit("change", option);
  isOpen.value = false;
};

const handleKeyDown = (event) => {
  if (!isOpen.value) return;

  const options = dropdownRef.value?.querySelectorAll('[role="option"]');
  if (!options?.length) return;

  const currentIndex = Array.from(options).findIndex(
    (option) => option.getAttribute("aria-selected") === "true"
  );

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      options[nextIndex].focus();
      break;
    case "ArrowUp":
      event.preventDefault();
      const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
      options[prevIndex].focus();
      break;
    case "Escape":
      event.preventDefault();
      isOpen.value = false;
      dropdownRef.value?.querySelector("button")?.focus();
      break;
    case "Tab":
      isOpen.value = false;
      break;
  }
};

const closeOnClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeOnClickOutside);
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeOnClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
});
</script>
