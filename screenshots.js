/**
 * 微信小程序批量截图脚本
 * 使用 miniprogram-automator 自动打开每个页面并截图
 *
 * 使用方法：
 * 1. 先手动打开微信开发者工具，打开 __APP__ 项目
 * 2. 在开发者工具菜单：设置 → 安全设置 → 开启"服务端口"
 * 3. 运行：node screenshots.js
 *
 * 如果不想手动操作，运行：node screenshots.js --auto
 * 脚本会自动通过命令行启动开发者工具
 */

const automator = require('miniprogram-automator');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');

// 小程序项目路径
const PROJECT_PATH = path.resolve(__dirname, '..', '__APP__');

// 截图输出目录
const SCREENSHOT_DIR = path.resolve(__dirname, 'images');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// 页面配置
const PAGES = [
  { name: '01-login',       route: '/pages/login/login',       method: 'reLaunch',  desc: '登录页' },
  { name: '02-home',         route: '/pages/index/index',        method: 'switchTab',  desc: '首页仪表盘' },
  { name: '03-goods-list',   route: '/pages/goods/list',         method: 'switchTab',  desc: '商品库列表' },
  { name: '04-borrow-list',  route: '/pages/borrow/list',        method: 'switchTab',  desc: '借货列表' },
  { name: '05-sale-list',    route: '/pages/sale/list',          method: 'switchTab',  desc: '销售列表' },
  { name: '06-profile',      route: '/pages/profile/profile',    method: 'switchTab',  desc: '个人中心' },
  { name: '07-goods-add',    route: '/pages/goods/add',          method: 'navigateTo', desc: '添加商品' },
  { name: '08-borrow-add',   route: '/pages/borrow/add',         method: 'navigateTo', desc: '添加借货' },
  { name: '09-sale-add',     route: '/pages/sale/add',           method: 'navigateTo', desc: '添加销售' },
  { name: '10-borrow-detail',route: '/pages/borrow/detail',      method: 'navigateTo', desc: '借货详情' },
  { name: '11-contact-list', route: '/pages/contact/list',       method: 'navigateTo', desc: '联系人列表' },
  { name: '12-contact-add',  route: '/pages/contact/add',        method: 'navigateTo', desc: '添加联系人' },
  { name: '13-sale-debt',    route: '/pages/sale/debt',          method: 'navigateTo', desc: '应收账款' },
  { name: '14-report',       route: '/pages/report/index',       method: 'navigateTo', desc: '数据报表' },
  { name: '15-transfer',     route: '/pages/borrow/transfer-list', method: 'navigateTo', desc: '调货列表' },
  { name: '16-profile-edit', route: '/pages/profile/edit',       method: 'navigateTo', desc: '编辑资料' },
  { name: '17-password',     route: '/pages/password/index',     method: 'navigateTo', desc: '修改密码' },
  { name: '18-staff',        route: '/pages/staff/index',        method: 'navigateTo', desc: '人员管理' },
  { name: '19-export',       route: '/pages/export/index',       method: 'navigateTo', desc: '数据导出' },
  { name: '20-customer-list',route: '/pages/customer/list',      method: 'navigateTo', desc: '客户列表' },
  { name: '21-customer-add', route: '/pages/customer/add',       method: 'navigateTo', desc: '添加客户' },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 通过 cmd.exe 启动微信开发者工具命令行（自动模式）
 */
function launchDevToolsCLI(port) {
  const cliPath = '"C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat"';
  const projectPath = `"${PROJECT_PATH}"`;
  const cmd = `${cliPath} auto --project ${projectPath} --auto-port ${port}`;

  console.log('🔧 正在通过命令行启动开发者工具...');
  console.log(`   命令: ${cmd}`);

  const proc = exec(cmd, { windowsHide: true }, (err) => {
    if (err) console.log('   CLI 进程结束:', err.message);
  });

  console.log(`   PID: ${proc.pid}`);
  return proc;
}

async function main() {
  const useAuto = process.argv.includes('--auto');
  const PORT = 55811;

  console.log('🚀 微信小程序批量截图工具');
  console.log(`📁 项目路径: ${PROJECT_PATH}\n`);

  let cliProc = null;

  if (useAuto) {
    // 自动模式：通过 cmd 启动开发者工具
    cliProc = launchDevToolsCLI(PORT);
    console.log('⏳ 等待开发者工具启动（约 15 秒）...');
    await sleep(15000);
  } else {
    console.log('📌 手动模式：请确保微信开发者工具已打开 __APP__ 项目');
    console.log('   并在 设置 → 安全设置 中开启「服务端口」\n');
    console.log('   💡 如果想自动启动，请运行：node screenshots.js --auto\n');
  }

  let miniProgram;
  try {
    miniProgram = await automator.connect({
      wsEndpoint: `ws://127.0.0.1:${PORT}`,
    });
    console.log('✅ 已连接到小程序\n');
  } catch (err) {
    if (cliProc) {
      console.error('❌ 自动启动失败，请尝试手动模式：');
      console.error('   1. 手动打开微信开发者工具，打开 __APP__ 项目');
      console.error('   2. 设置 → 安全设置 → 开启「服务端口」');
      console.error('   3. 运行：node screenshots.js（不加 --auto）');
    } else {
      console.error('❌ 无法连接到开发者工具。请确认：');
      console.error('   1. 微信开发者工具已打开 __APP__ 项目');
      console.error('   2. 设置 → 安全设置 → 「服务端口」已开启');
    }
    throw err;
  }

  try {
    // 跳转到首页
    console.log('📱 跳转到首页...');
    await miniProgram.reLaunch('/pages/index/index');
    await sleep(3000);

    for (let i = 0; i < PAGES.length; i++) {
      const page = PAGES[i];
      const filePath = path.join(SCREENSHOT_DIR, `${page.name}.png`);

      console.log(`[${i + 1}/${PAGES.length}] 📸 ${page.desc}`);

      try {
        if (page.method === 'switchTab') {
          await miniProgram.switchTab(page.route);
        } else if (page.method === 'reLaunch') {
          await miniProgram.reLaunch(page.route);
        } else {
          await miniProgram.navigateTo(page.route);
        }

        await sleep(2500);

        await miniProgram.screenshot({ path: filePath });
        console.log(`   ✅ ${page.name}.png`);
      } catch (err) {
        console.log(`   ⚠️ 失败: ${err.message}`);
        try {
          await miniProgram.reLaunch('/pages/index/index');
          await sleep(2000);
        } catch (e) { /* ignore */ }
      }

      if (page.method === 'navigateTo') {
        try {
          await miniProgram.navigateBack();
          await sleep(800);
        } catch (e) {
          try {
            await miniProgram.switchTab('/pages/index/index');
            await sleep(1500);
          } catch (e2) { /* ignore */ }
        }
      }
    }

    console.log('\n✨ 全部截图完成！');
    console.log(`📂 ${SCREENSHOT_DIR}`);
  } finally {
    await miniProgram.close();
    if (cliProc) {
      try { process.kill(cliProc.pid); } catch (e) { /* ignore */ }
    }
    console.log('👋 完成');
  }
}

main().catch(err => {
  console.error('❌ 脚本出错:', err.message);
  process.exit(1);
});
