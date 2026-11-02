module.exports = (api, options, rootOptions) => {
  api.render(files => {
    // 删除内置的组件文件
    delete files['src/assets/logo.png'];
    delete files['src/components/HelloWorld.vue'];
    delete files['src/main.js'];
    delete files['src/views/HomeView.vue'];
    delete files['src/views/AboutView.vue'];
  });

  // 1. 读取模板中的package.json
  const templatePkg = require('./template/package.json');

  // 2. 合并依赖（模板依赖优先级高于内置配置）
  api.extendPackage({
    dependencies: {
      ...templatePkg.dependencies
    },
    devDependencies: {
      ...templatePkg.devDependencies
    },
    scripts: {
      ...templatePkg.scripts
    },
    engines: templatePkg.engines
  }, {
    merge: false // 替换脚本配置；依赖仍按 Vue CLI 的规则合并
  })

  // 3. 渲染模板文件
  api.render('./template');

  // 自定义终端输出
  // api.onCreateComplete(() => {
  //   const colors = {
  //     green: '\x1B[32m', // 绿色
  //     blue: '\x1B[34m',  // 蓝色
  //     reset: '\x1B[0m'   // 重置颜色
  //   };

  //   console.log(`\n${colors.green}🎉  思政模板项目创建成功！${colors.reset}`);
  //   console.log(`${colors.blue}👉  启动项目请执行：${colors.reset}`);
  //   console.log(`\n   ${colors.green}$ cd ${rootOptions.projectName}${colors.reset}`);
  //   console.log(`   ${colors.green}$ yarn dev${colors.reset}  # 开发环境启动`);
    
  //   api.exitLog('', 'log');
  // });
}
