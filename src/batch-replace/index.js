const fs = require('fs');
const xlsx = require('xlsx');

const referFile = 'refer.xlsx';
const targetFile = 'target.txt';

try {
  Promise.all([fs.accessSync(referFile, fs.constants.R_OK | fs.constants.W_OK),
  fs.accessSync(targetFile, fs.constants.R_OK | fs.constants.W_OK)]).then(() => {
    const workbook = xlsx.readFile(referFile);
    const sheetNames = workbook.SheetNames;
    const referData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    // console.log(`referData:${JSON.stringify(referData)}`);
    let targetData = fs.readFileSync(targetFile, 'utf-8');
    // console.log(`targetData:${targetData}`);
    if (!referData || !referData.length > 0) {
      return;
    }
    referData.forEach(item => {
      const originValue = item['原始值'].replace(/([$^.+{}?=])/g, "\\$1");
      const replaceValue = item['替换值'];
      targetData = targetData.replace(new RegExp(originValue, 'g'), replaceValue);
    })
    fs.writeFileSync(targetFile, targetData, 'utf-8');
    console.log('success');
  })
} catch (err) {
  console.error(`no access!${err}`);
}