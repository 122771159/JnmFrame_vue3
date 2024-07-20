const modulesFiles = import.meta.glob('./modules/*.*', { eager: true });
const modules = {};
for (const key in modulesFiles) {
  const moduleName = key.replace(/(.*\/)*([^.]+).*/gi, '$2');

  modules[moduleName] = modulesFiles[key];
  // console.log(modules);
}

export default modules;
