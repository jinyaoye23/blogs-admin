const { sequelize } = require('./src/config/database');
const Article = require('./src/models/Article');

async function checkArticles() {
  try {
    console.log('🔍 正在连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 查询所有文章
    const articles = await Article.findAll({
      include: [
        { 
          model: require('./src/models/User'), 
          as: 'author', 
          attributes: ['id', 'username'] 
        },
        { 
          model: require('./src/models/Category'), 
          as: 'category', 
          attributes: ['id', 'name'] 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log(`📊 数据库中共有 ${articles.length} 篇文章:\n`);
    
    if (articles.length === 0) {
      console.log('⚠️  数据库中没有文章数据!');
      console.log('\n可能的原因:');
      console.log('1. 创建文章的 API 请求失败');
      console.log('2. 事务回滚了');
      console.log('3. 连接了错误的数据库');
    } else {
      articles.forEach((article, index) => {
        console.log(`${index + 1}. ID: ${article.id}`);
        console.log(`   标题: ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   作者: ${article.author?.username || '未知'}`);
        console.log(`   分类: ${article.category?.name || '未分类'}`);
        console.log(`   状态: ${article.status}`);
        console.log(`   创建时间: ${article.created_at}`);
        console.log('');
      });
    }

    // 检查最近的操作
    console.log('\n📝 检查最近的记录...');
    const recentArticles = await Article.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'title', 'slug', 'status', 'created_at']
    });

    if (recentArticles.length > 0) {
      console.log('最近 5 条记录:');
      recentArticles.forEach(article => {
        console.log(`  - [${article.created_at}] ${article.title} (${article.status})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ 查询失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkArticles();
