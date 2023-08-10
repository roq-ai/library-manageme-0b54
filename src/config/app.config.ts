interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Library Administrator'],
  customerRoles: [],
  tenantRoles: ['Library Administrator', 'Librarian'],
  tenantName: 'Library',
  applicationName: 'Library Management',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
