const fs = require('fs');
const file = 'd:/Laundry_antigravity/clean-delivery-flow/src/lib/mockData.ts';
let code = fs.readFileSync(file, 'utf8');

// 1. Interface
code = code.replace(/role: 'super-admin' \| 'admin';/g, "role: 'super-admin' | 'employee';");

// 2. demoAdminAccounts role
code = code.replace(/role: 'admin' as const/g, "role: 'employee' as const");

// 3. demoAdminAccounts names
code = code.replace(/name: 'Rafiqul Islam'/g, "name: 'Employee Rafiqul'");
code = code.replace(/name: 'Nusrat Jahan'/g, "name: 'Employee Nusrat'");

// 4. mockAdmins
// Let's replace the roles first
code = code.replace(/role: 'admin',/g, "role: 'employee',");

// Let's replace names for mockAdmins (except super-admin which is ADM-001)
const namesToReplace = [
  'Maria Garcia',
  'Carlos Martinez',
  'Ana Lopez',
  'David Chen',
  'Sofia Williams',
  'Michael Brown',
  'Emily Davis',
  'Robert Wilson',
  'Jessica Taylor',
  'Daniel Anderson',
  'Laura Thompson'
];

namesToReplace.forEach((name, i) => {
  code = code.replace(new RegExp(`name: '${name}'`, 'g'), `name: 'Employee ${i + 1}'`);
});

fs.writeFileSync(file, code);
console.log('Done modifying mockData.ts');
