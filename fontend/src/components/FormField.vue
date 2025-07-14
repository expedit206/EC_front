<template>
  <div class="mb-4">
    <!-- Label -->
    <label class="block text-sm sm:text-base font-medium mb-1 text-[var(--espace-gris)]">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Icône -->
      <span class="absolute inset-y-0 left-3 flex items-center text-[var(--espace-or)]">
        <i :class="`fas ${icon}`"></i>
      </span>

      <!-- Input -->
      <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :required="required" :placeholder="placeholder" :class="[
          'w-full pl-10 pr-4 py-3 rounded-xl border text-sm sm:text-base transition',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-[var(--espace-or)]'
        ]" />
    </div>

    <!-- Message d'erreur -->
    <p v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  icon: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  required: Boolean,
  placeholder: String,
  error: String
});

defineEmits(['update:modelValue']);
</script>
