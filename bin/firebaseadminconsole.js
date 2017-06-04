try {
  var config = {
    appDir: 'd:/code/self-asssessment-app',
    adminSubDir: 'bin/admin'
  };
  config.adminDir = config.appDir + '/' + config.adminSubDir;
  
  var process = require('process');
  process.chdir(config.adminDir);
  console.log(process.cwd());
  
  var test = require(config.adminDir + '/admintest');
  test();
  console.log(test);
}
catch (err) {
  console.log(err.stack);
}