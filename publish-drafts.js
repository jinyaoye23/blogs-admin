const { sequelize } = require('./src/config/database');
const Article = require('./src/models/Article');

async function publishAllDrafts() {
  try {
    console.log('🔍 正在连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 查询所有草稿状态的文章
    const drafts = await Article.findAll({
      where: { status: 'draft' },
      attributes: ['id', 'title', 'status']
    });

    if (drafts.length === 0) {
      console.log('✅ 没有草稿文章需要发布');
      process.exit(0);
      return;
    }

    console.log(`📝 找到 ${drafts.length} 篇草稿文章:\n`);
    drafts.forEach(article => {
      console.log(`  - [ID: ${article.id}] ${article.title}`);
    });

    // 询问用户是否发布
    console.log('\n⚠️  即将把这些文章状态改为 "published"');
    console.log('按 Ctrl+C 取消,或等待 3 秒后自动执行...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 批量更新
    const [affectedCount] = await Article.update(
      { status: 'published' },
      { where: { status: 'draft' } }
    );

    console.log(`✅ 成功发布 ${affectedCount} 篇文章!\n`);

    // 验证
    const published = await Article.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'status']
    });

    console.log(`📊 当前已发布文章 (${published.length} 篇):`);
    published.forEach(article => {
      console.log(`  - [ID: ${article.id}] ${article.title} (${article.status})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

publishAllDrafts();
