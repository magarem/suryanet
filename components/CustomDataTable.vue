<script setup>
    import { ref, watch } from 'vue';

    // Props
    const props = defineProps({
        title: String,
        items: Array,
        selectedItems: Array,
        filters: Object,
        visibleColumns: Array,
        formatCurrency: Function,
        formatDateBR: Function,
        editItem: Function,
        openNew: Function,
    });

    // Emits
    const emit = defineEmits(['update:selectedItems', 'deleteItem', 'deleteSelectedItems']);

    // Internal selected rows (v-model bridge)
    const internalSelected = ref([...props.selectedItems]);

    watch(
        () => props.selectedItems,
        (val) => {
            internalSelected.value = val;
        },
    );

    watch(internalSelected, (val) => {
        emit('update:selectedItems', val);
    });

    // Dialog states
    const deleteItemDialog = ref(false);
    const deleteItemsDialog = ref(false);
    const selectedItem = ref(null);

    // Handlers
    const confirmDeleteItem = (item) => {
        selectedItem.value = item;
        deleteItemDialog.value = true;
    };

    const confirmDeleteSelected = () => {
        deleteItemsDialog.value = true;
    };

    const handleDeleteItem = () => {
        emit('deleteItem', selectedItem.value);
        deleteItemDialog.value = false;
        selectedItem.value = null;
    };

    const handleDeleteSelectedItems = () => {
        emit('deleteSelectedItems');
        deleteItemsDialog.value = false;
    };
</script>

<template>
    <Toolbar class="mb-2 border-0 rounded-5" _style="background-color: #111829">
        <template #start>
            <h1 class="text-2xl _mr-5 pb-1">{{ title }}</h1>
        </template>
        <template #center>
            <Button label="Novo" icon="pi pi-plus" severity="secondary" class="bg-transparent mr-2" @click="openNew" />
            <Button
                label="Excluir"
                icon="pi pi-trash"
                severity="secondary"
                class="bg-transparent mr-2"
                @click="confirmDeleteSelected"
                :disabled="!selectedItems || !selectedItems.length"
            />
            <IconField class="mr-2">
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText
                    v-model="filters['global'].value"
                    placeholder="Procurar..."
                    class="w-full bg-gray-800 py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-transparent"
                />
            </IconField>
        </template>
        <template #end>
            <Button label="Exportar" icon="pi pi-upload" class="bg-transparent mr-2" severity="secondary" @click="exportCSV($event)" />
        </template>
    </Toolbar>
    <div class="card">
        <DataTable
            class="tabela"
            scrollable
            scrollHeight="calc(100vh - 250px)"
            v-model:selection="internalSelected"
            :value="items"
            dataKey="id"
            :paginator="true"
            :rows="20"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="{first} até {last} de {totalRecords} itens"
        >
            <!-- Selection Checkbox -->
            <Column
                selectionMode="multiple"
                style="width: 3rem; background-color: #111829"
                :exportable="false"
                bodyClass="bg-gray-700"
                headerClass="bg-gray-800"
            />

            <!-- Dynamic Columns -->
            <Column
                v-for="col in visibleColumns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :sortable="col.sortable"
                :style="col.style"
                bodyClass="bg-gray-700"
                headerClass="bg-gray-800"
            >
                <template #body="slotProps">
                    <span v-if="col.editTemplate === 'money'">
                        {{ formatCurrency(slotProps.data[col.field]) }}
                    </span>
                    <span v-else-if="col.editTemplate === 'calendar'">
                        {{ formatDateBR(slotProps.data[col.field]) }}
                    </span>
                    <span v-else>
                        {{ slotProps.data[col.field] }}
                    </span>
                </template>
            </Column>

            <!-- Action Column -->
            <Column :exportable="false" style="min-width: 12rem; background-color: #111829" bodyClass="bg-gray-700" headerClass="bg-gray-800">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editItem(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteItem(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- Delete Single Item Dialog -->
        <Dialog v-model:visible="deleteItemDialog" :style="{ width: '300px' }" header="Confirmar" :modal="true">
            <div class="flex flex-col items-center gap-2 text-center">
                <i class="pi pi-exclamation-triangle text-yellow-500 text-3xl" />
                <span v-if="selectedItem">
                    Excluir <strong>{{ selectedItem.name }}</strong
                    >?
                </span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" text @click="deleteItemDialog = false" />
                <Button label="Sim" icon="pi pi-check" @click="handleDeleteItem" />
            </template>
        </Dialog>
    </div>
    <!-- Delete Multiple Items Dialog -->
    <Dialog v-model:visible="deleteItemsDialog" :style="{ width: '300px' }" header="Confirmar" :modal="true">
        <div class="flex flex-col items-center gap-4">
            <i class="pi pi-exclamation-triangle text-yellow-500 !text-3xl" />
            <span>Excluir itens?</span>
        </div>
        <template #footer>
            <Button label="Não" icon="pi pi-times" text @click="deleteItemsDialog = false" />
            <Button label="Sim" icon="pi pi-check" @click="handleDeleteSelectedItems" />
        </template>
    </Dialog>
</template>
<style>
.tabela {
    @apply bg-gray-900 text-white text-xl;
    
}
    .p-paginator {
        background: #111829;
    }
    .p-toolbar {
        background-color: transparent;
        border: none;
        color: white;
    }
</style>
