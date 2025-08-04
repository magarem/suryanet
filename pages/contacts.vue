<template>
  <div class="p-3">
    <!-- <h1 class="text-2xl mb-3">Contatos</h1> -->
    <!-- Your CustomDataTable and other elements remain here -->
    <div class="card">
      <CustomDataTable
        title="Contatos"
        :items="items"
        :filters="filters"
        :visibleColumns="visibleColumns"
        v-model:selectedItems="selectedItems"
        :editItem="editItem"
        :openNew="openNew"
        @deleteItem="deleteItem"
        @deleteSelectedItems="deleteSelectedItems"
      />
    </div>

    <GenericCreateEditForm
      :show="itemDialog"
      :item="item"
      :columns="columns"
      :submitted="submitted"
      @close="hideDialog"
      @save="saveItem"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from "@primevue/core/api";
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';

// Componentes de formulário do PrimeVue
import InputText from "primevue/inputtext";
import Select from 'primevue/select';

const toast = useToast();
const items = ref([]);
const itemDialog = ref(false);
const deleteItemDialog = ref(false);
const deleteItemsDialog = ref(false);

// Objeto que armazena os dados do item a ser editado/criado
const item = ref({});
const { user, clear: clearSession } = useUserSession()
const selectedItems = ref([]);
const submitted = ref(false);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Definição das colunas que alimenta tanto a tabela quanto o formulário
const columns = ref([
 {
    field: "name",
    header: "Nome",
    sortable: true,
    style: { "min-width": "8rem", "background-color": "#111829" },
    editTemplate: InputText
  },
  {
    field: "type",
    header: "Tipo",
    sortable: true,
    style: { "min-width": "5rem", "background-color": "#111829" },
    editTemplate: Select,
    options: [{key:'Física', value:'Física'}, {key:'Jurídica', value:'Jurídica'}],
    optionLabel: "value",
    optionValue: "key"
  },
  {
    field: "doc",
    header: "Documento",
    sortable: true,
    style: { "min-width": "5rem", "background-color": "#111829" },
    editTemplate: InputText
  },
  {
    field: "email",
    header: "Email",
    sortable: true,
    style: { "min-width": "5rem", "background-color": "#111829" },
    editTemplate: InputText
  },
  {
    field: "fone1",
    header: "Telefone 1",
    sortable: true,
    style: { "min-width": "5rem", "background-color": "#111829" },
    editTemplate: InputText
  },
  {
    field: "fone2",
    header: "Telefone 2",
    sortable: true,
    style: { "min-width": "5rem", "background-color": "#111829" },
    editTemplate: InputText,
    hidden: true, // Hidden by default
  },
  {
    field: "address",
    header: "Endereço",
    sortable: true,
    style: { "min-width": "5rem", "background-color": "#111829" },
    hidden: true, // Hidden by default
    editTemplate: InputText
  },
  {
    field: "obs",
    header: "Observações",
    sortable: true,
    style: { "min-width": "5rem" , "background-color": "#111829"},
    hidden: true, // Hidden by default
    editTemplate: InputText
  }
]);

const visibleColumns = computed(() => {
  return columns.value.filter(col => !col.hidden);
});

onMounted(async () => {
 await fetchData();
});

// Função para buscar dados (exemplo)
async function fetchData() {
  items.value = await executeQuery(`SELECT * from contacts`);
}

// Abre o modal para um novo item
function openNew() {
  item.value = {}; // Limpa o objeto do item
  submitted.value = false;
  itemDialog.value = true;
}

// Abre o modal para editar um item existente
function editItem(selectedItem) {
  item.value = { ...selectedItem }; // Copia os dados do item selecionado
  submitted.value = false;
  itemDialog.value = true;
}

// Fecha o modal
function hideDialog() {
  itemDialog.value = false;
  submitted.value = false;
}

// A função saveItem agora recebe o item do evento emitido pelo modal
async function saveItem(itemToSave) {
  submitted.value = true;
  let isValid = true; // Adicione sua lógica de validação aqui

  if (isValid) {
    try {
      const userData = { ...itemToSave, user_id: user.value.id };
      
      const response = await $fetch(`/api/upsert`, {
        method: "POST",
        body: {
          table: "contacts",
          data: userData,
          condition: userData.id ? `id = ${userData.id}` : null,
        },
      });

      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Item Salvo",
        life: 3000,
      });

      hideDialog();
      await fetchData(); // Recarrega os dados
    } catch (error) {
      console.error("Erro ao salvar item:", error);
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Ocorreu um erro ao salvar o item.",
        life: 3000,
      });
    }
  }
}

function confirmDeleteItem(itemToDelete) {
  item.value = itemToDelete;
  deleteItemDialog.value = true;
}

async function deleteItem(item) {
  await executeQueryRun(
    `DELETE FROM contacts WHERE id = ${item.id}`
  );
  await fetchData();
  deleteItemDialog.value = false;
  item.value = {};
  toast.add({ severity: "success", summary: "Removido", life: 3000 });
}

function confirmDeleteSelected() {
  if (selectedItems.value && selectedItems.value.length > 0) {
    deleteItemsDialog.value = true;
  } else {
    toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Nenhum item selecionado.', life: 3000 });
  }
}

async function deleteSelectedItems() {
  items.value = items.value.filter(val => !selectedItems.value.includes(val));
  deleteItemsDialog.value = false;
  

  const response = await $fetch(`/api/delete`, {
    method: "POST",
    body: {
      table: "contacts", // Substitua pelo nome da sua tabela
      condition: `id in (${selectedItems.value.map(item => item.id).join(',')})`
    }
  });
  selectedItems.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "Items Deleted",
    life: 3000
  });
}
</script>

<style>
/* Estilos para o PrimeVue e Tailwind funcionarem bem juntos */
.p-invalid {
  border-color: #ef4444; /* red-500 */
}
/* .form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
} */
</style>
