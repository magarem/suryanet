
<template>
    <div :class="{ 'dark text-white-dark': store.semidark }">
        <nav class="sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300">
            <div class="h-full bg-white dark:bg-[#0e1726]">
                <!-- Cabeçalho do menu (logo) -->
                <div class="flex items-center justify-between px-4 py-3 mb-5">
                    <NuxtLink to="/" class="main-logo flex shrink-0 items-center">
                          <svg class="h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <span class="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">SuryaNet</span>

                    </NuxtLink>
                    <a href="javascript:;" @click="store.toggleSidebar()" class="collapse-icon">
                        <icon-carets-down class="m-auto rotate-90" />
                    </a>
                </div>

                <client-only>
                    <perfect-scrollbar class="relative h-[calc(100vh-80px)]">
                        <ul class="relative space-y-0.5 p-4 py-0 font-semibold">
                            <!-- Iteração pelos itens do menu -->
                            <template v-for="(item, index) in menuItems" :key="index">
                                <!-- Seção -->
                                <template v-if="item.section">
                                    <h2 class="section-title">
                                        <!-- <span>{{ $t(item.section) }}</span> -->
                                    </h2>
                                </template>
                                
                                <!-- Item com submenu -->
                                <li v-else-if="item.submenu" class="menu nav-item">
                                    <button type="button" class="nav-link group w-full"
                                        :class="{ active: activeDropdown === item.title }"
                                        @click="toggleDropdown(item.title)">
                                        <div class="flex items-center">
                                            <component :is="item.icon" class="shrink-0 group-hover:!text-primary" />
                                            <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                {{ $t(item.title) }}
                                            </span>
                                        </div>
                                        <div :class="{ '-rotate-90 rtl:rotate-90': activeDropdown !== item.title }">
                                            <icon-caret-down />
                                        </div>
                                    </button>
                                    <vue-collapsible :isOpen="activeDropdown === item.title">
                                        <ul class="sub-menu text-gray-500">
                                            <li v-for="(subItem, subIndex) in item.submenu" :key="subIndex">
                                                <NuxtLink 
                                                    :to="subItem.path" 
                                                    :target="subItem.target || null"
                                                    @click="toggleMobileMenu">
                                                    {{ $t(subItem.title) }}
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </vue-collapsible>
                                </li>
                                
                                <!-- Item simples (sem submenu) -->
                                <li v-else class="nav-item">
                                    <NuxtLink 
                                        :to="item.path" 
                                        :target="item.target || null"
                                        class="group" 
                                        @click="toggleMobileMenu">
                                        <div class="flex items-center">
                                            <component :is="item.icon" class="shrink-0 group-hover:!text-primary" />
                                            <span class="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">
                                                {{ $t(item.title) }}
                                            </span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </template>
                        </ul>
                    </perfect-scrollbar>
                </client-only>
            </div>
        </nav>
    </div>
</template>
<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    import { useAppStore } from '@/stores/index';
    import VueCollapsible from 'vue-height-collapsible/vue3';
    import menuItems from '@/data/menuItems'; // Importe seu objeto de menu

    const store = useAppStore();
    const activeDropdown = ref<string | null>(null);
    const subActive = ref<string | null>(null);

    // Função para alternar dropdowns
    const toggleDropdown = (itemTitle: string) => {
        if (window.innerWidth < 1024) {
            store.toggleSidebar();
        }
        activeDropdown.value = activeDropdown.value === itemTitle ? null : itemTitle;
    };

    // Função para fechar menu em mobile
    const toggleMobileMenu = () => {
        if (window.innerWidth < 1024) {
            store.toggleSidebar();
        }
    };

    onMounted(() => {
        // Lógica para marcar o item ativo
        setTimeout(() => {
            const selector = document.querySelector(`.sidebar ul a[href="${window.location.pathname}"]`);
            if (selector) {
                selector.classList.add('active');
                
                // Encontrar e abrir o submenu pai se existir
                const ul = selector.closest('ul.sub-menu');
                if (ul) {
                    const parentItem = ul.closest('li.menu');
                    if (parentItem) {
                        const button = parentItem.querySelector('button.nav-link');
                        if (button) {
                            const itemTitle = menuItems.find(item => 
                                item.submenu?.some(subItem => 
                                    subItem.path === window.location.pathname
                                )
                            )?.title;
                            
                            if (itemTitle) {
                                activeDropdown.value = itemTitle;
                            }
                        }
                    }
                }
            }
        });
    });
</script>
<style scoped>
/* Estilo base para os itens do menu */
.nav-link {
    @apply text-sm; /* Tamanho padrão para itens principais (14px) */
    font-size: 14px;
    line-height: 0;
}

/* Estilo para os subitens do menu */
.sub-menu a {
    @apply text-xs; /* Tamanho menor para subitens (12px) */
    font-size: 12px;
    line-height: 1;
}

/* Estilo para os títulos das seções */
.section-title {
    @apply text-xl uppercase tracking-wider; /* Estilo para seções */
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.05em;
}

/* Estilo para o item ativo */
.nav-link.active,
.sub-menu a.active {
    @apply text-primary dark:text-white;
    font-weight: 600;
}

/* Estilo para hover nos itens */
.nav-link:not(.active):hover,
.sub-menu a:not(.active):hover {
    @apply text-primary dark:text-white;
}

/* Ajuste de espaçamento */
.nav-item {
    @apply py-0 text-xl;
}

.sub-menu li {
    @apply py-0 text-xl;
}

/* Se precisar ajustar o ícone junto com o texto */
.nav-link > div,
.sub-menu a {
    @apply flex items-center text-xl;
}

/* Responsividade - ajustar tamanhos em telas menores */
@media (max-width: 1023px) {
    .nav-link {
        @apply text-base; /* Aumenta um pouco em mobile */
        font-size: 16px;
    }
    
    .sub-menu a {
        @apply text-sm;
        font-size: 14px;
    }
}
</style>