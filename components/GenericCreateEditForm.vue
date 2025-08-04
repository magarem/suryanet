<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="close" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="panel w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-800"
            >
              <DialogTitle as="h3" class="text-xl font-medium leading-6 text-gray-400">
               {{ localItem.id ? 'Editar ' + title: 'Adicionar ' + title }}
              </DialogTitle>

              <form @submit.prevent="save" class="mt-4">
                  <div class="space-y-4">
                      <template v-for="col in columns" :key="col.field">
                          <div v-if="col.editTemplate">
                              <label :for="col.field" class="block text-xl font-medium text-gray-500">{{ col.header }}</label>
                              <component
                                  :is="col.editTemplate"
                                  :id="col.field"
                                  v-model="localItem[col.field]"
                                  :options="col.options"
                                  :optionLabel="col.optionLabel"
                                  :optionValue="col.optionValue"
                                  :placeholder="'Insira ' + col.header.toLowerCase()"
                                  class="mt-1 w-full"
                                  :class="{ 'form-input': col.editTemplate !== Select, 'p-invalid': submitted && !localItem[col.field] }"
                              />
                              <small v-if="submitted && !localItem[col.field]" class="mt-1 text-red-500"> {{ col.header }} é obrigatório. </small>
                          </div>
                      </template>
                  </div>

                  <div class="mt-8 flex items-center justify-end space-x-4">
                      <button type="button" class="btn btn-outline-danger text-xl" @click="close">Cancelar</button>
                      <button type="submit" class="btn btn-primary text-xl">
                          {{ localItem.id ? 'Atualizar' : 'Adicionar' }}
                      </button>
                  </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
    import { ref, watch, defineAsyncComponent } from 'vue';
    import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

    // Importa os componentes de formulário do PrimeVue
    const InputText = defineAsyncComponent(() => import('primevue/inputtext'));
    const Select = defineAsyncComponent(() => import('primevue/select'));

    // Define as propriedades que o componente aceita
    const props = defineProps({
       title: {
            type: String,
            default: "Registro",
        },
        show: {
            type: Boolean,
            default: false,
        },
        item: {
            type: Object,
            default: () => ({}),
        },
        columns: {
            type: Array,
            required: true,
        },
        submitted: {
            type: Boolean,
            default: false,
        },
    });

    // Define os eventos que o componente pode emitir
    const emit = defineEmits(['close', 'save']);

    // Cria uma cópia local do item para evitar mutação direta da prop
    const localItem = ref({});

    // Observa mudanças na prop 'item' e atualiza a cópia local
    watch(
        () => props.item,
        (newItem) => {
            localItem.value = { ...newItem };
        },
        { deep: true, immediate: true },
    );

    // Função para emitir o evento de fechamento
    function close() {
        emit('close');
    }

    // Função para emitir o evento de salvamento com os dados do formulário
    function save() {
        emit('save', localItem.value);
    }
</script>

<style>
  .form-input {
    @apply  w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xl;
  }
</style>
