const menuItems = [
  
  {
    section: 'Menu'
  },
  {
    title: 'contacts',
    icon: 'icon-menu-contacts',
    path: '/contacts'
  },
  {
    title: 'Financeiro',
    icon: 'icon-menu-invoice',
    submenu: [
      { title: 'Categorias', path: '/financial/category' },
      { title: 'Formas de pagamento', path: '/financial/payment_method' },
      { title: 'Lançamentos', path: '/financial/transactions' },
      { title: 'Relatórios', path: '/financial/reports' },
    ]
  },
  {
    section: 'user_interface'
  },
  {
    title: 'Acesso',
    icon: 'icon-menu-components',
    submenu: [
      { title: 'Usuários', path: '/auth/users' },
      { title: 'Perfis', path: '/auth/roles' },
      { title: 'Páginas', path: '/auth/pages' }
    ]
  }
];

export default menuItems;