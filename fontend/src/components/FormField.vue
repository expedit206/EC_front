<!-- src/components/FormField.vue -->
<template>
  <div>
    <label class="block text-[var(--espace-gris)] text-sm sm:text-base font-medium mb-1">
      <i :class="`fas ${icon} mr-1`"></i> {{ label }}
    </label>
    <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      :required="required"
      class="w-full p-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--espace-or)] transition" />
  </div>
</template>

<script setup>
import { readonly } from 'vue';

defineProps({
  label: String,
  icon: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  required: Boolean,
})

defineEmits(['update:modelValue'])
</script>
