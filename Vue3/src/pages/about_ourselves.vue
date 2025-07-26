<template>
  <div class="about-container">
    <div class="about-content">
      <h1 class="about-title">致读者</h1>
      
      <div class="section">
        <p class="greeting">各位同学，各位老师，以及看到这里的各界人士：</p>
        <p class="greeting">各位好！</p>
        <p>首先，我仅代表我们团队，衷心地感谢各位能忍受制作如此粗糙的网页读到这里。</p>
      </div>

      <div class="section">
        <h2>项目介绍</h2>
        <p>我们是中国药科大学的一支大创团队，项目内容在实际上的体现，就是各位前面所看到的两大功能：</p>
        <ul>
          <li><strong>与人工智能对话</strong></li>
          <li><strong>基于图神经网络的文献搜集与图谱构建</strong></li>
        </ul>
        <p>很抱歉，由于我们自己能力有限，且校方并不看好我们的项目，导致这两大功能并不像我们最初设计的那样理想。</p>
      </div>

      <div class="section">
        <h2>具体问题说明</h2>
        
        <h3>1. 与人工智能的对话</h3>
        <p>人工智能需要大量的数据去训练。最初的设想中，我们希望构建属于自己的，服务于药学生的数据集。</p>
        <p>基于我们自己在学校中的深切体会，我们定了两个方向：</p>
        
        <h4>方向一：考试复习资料</h4>
        <p>直白点说就是用来调整模型，让各位的期末尽可能地不那么疲惫，也让各位老师不必为了大家的学业发愁。</p>
        
        <h4>方向二：科研文献搜集</h4>
        <p>这些数据可以让一个通用的人工智能模型变得更加的"专业"，让各位同学在接触一个新的研究领域时，不必头秃地去寻找文献。输入关键词，人工智能就会轻松地将某一领域内经典文献呈现给大家。</p>
        
        <div class="highlight-box">
          <p><strong>很遗憾，以上两点我们都没有做到。</strong></p>
          <p>受限于资金问题，各位现在使用的模型，是简单地使用提示词训练的DeepSeek-r1:7b模型，也就是正常DeepSeek满血版的阉割再阉割版本。</p>
          <p>所以，各位输入的问题，它还是会答非所问，甚至是一些很抽象的答案。请原谅，我们团队支付不起满血版的租金，使用数据集调整模型那更是天方夜谭。</p>
          <p>乃至于这个网站，我们悲观地估计也只能支撑到9月开学前就得停掉。</p>
        </div>

        <h3>2. 关于文献图谱构建</h3>
        <p>这个灵感来自于ConnectPapers网站。其对文献的网络式梳理让我们觉得相当有潜力。</p>
        <p>所以，我们采取了图神经网络来构建图谱网络，相较于ConnectPapers，理想结果更加精准。</p>
        <p>但同样的，财力限制了算力，算力又限制了神经网络能构建的水平。</p>
        <p>在最初的，纯粹使用图神经网络版本中，上面的连线是一个都不存在的。我们后续采取了传统的耦合算法，才呈现出如今的页面给各位。</p>
      </div>

      <div class="section">
        <h2>数据收集请求</h2>
        <p>算力问题我们无力解决，但是关于数据集的收集，在这里，我们恳请各位出一份力。</p>
        <p>我们需要以下数据：</p>

        <div class="data-request">
          <h3>📚 文献评述</h3>
          <p><strong>类型要求：</strong></p>
          <ul>
            <li>最好是综述类型的文献(reviews)</li>
            <li>研究型文献(articles)也可</li>
          </ul>
          
          <p><strong>用途说明：</strong></p>
          <p>我们希望借助各位所阅读过的，各个领域内的精选文献，让人工智能对每一个我们研究的领域有一个全面而清晰地理解，所以综述类型的文献是我们最需要的。</p>
          
          <p><strong>提交方式：</strong></p>
          <ul>
            <li>使用您注册时使用的邮箱</li>
            <li>发送到：<strong>1990493833@qq.com</strong></li>
            <li>邮件主题：<strong>"文献评述"</strong></li>
            <li>邮件内容：您的姓名与学号</li>
            <li>最好附上评述，字数不限，可从多方面对该论文乃至该领域进行全面的介绍与探讨</li>
          </ul>
        </div>

        <div class="data-request">
          <h3>📖 学习资料</h3>
          <p><strong>内容范围：</strong></p>
          <p>我校本科，研究生乃至博士各学科的学习资料，可以是书籍电子版，也可以是其他的各种类型的资料。</p>
          
          <p><strong>提交方式：</strong></p>
          <ul>
            <li>使用您注册时使用的邮箱</li>
            <li>发送到：<strong>1990493833@qq.com</strong></li>
            <li>邮件主题：<strong>该学科名字</strong></li>
            <li>邮件内容：您的姓名与学号</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>致谢与承诺</h2>
        <p>我们无力承诺大家什么。在我们力所能及的范围内：</p>
        <ul>
          <li>凡是参与我们数据集构建的同学老师，如果项目还有后续，我们会第一时间邀请您参与内测使用。</li>
          <li>对于本科同学，若您参与了，请关注您的邮箱，我们后续会申请pu与操行，以表感谢。</li>
        </ul>
      </div>

      <div class="section">
        <h2>联系方式</h2>
        <p>再次感谢读到这里的各位！</p>
        <p>我们的项目还没有起名字。如果您愿意，欢迎提交您的创意与设计。</p>
        <p>如您有任何建议，或者想要参与到该项目中，欢迎发送邮件到：<strong>1990493833@qq.com</strong></p>
      </div>

      <div class="signature">
        <hr>
        <p><strong>AIGC赋能药学生教育综合智能体服务平台构建研究项目组</strong></p>
        <p>2025年7月26日</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutOurselves'
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.about-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 40px;
  font-weight: 300;
}

.section {
  margin-bottom: 50px;
}

.section h2 {
  color: #34495e;
  font-size: 1.8em;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.section h3 {
  color: #2980b9;
  font-size: 1.4em;
  margin: 30px 0 15px 0;
}

.section h4 {
  color: #7f8c8d;
  font-size: 1.2em;
  margin: 20px 0 10px 0;
}

.greeting {
  font-size: 1.1em;
  color: #2c3e50;
  line-height: 1.8;
}

p {
  font-size: 1.1em;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 15px;
}

ul {
  margin: 15px 0;
  padding-left: 30px;
}

li {
  font-size: 1.1em;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 8px;
}

.highlight-box {
  background: #f8f9fa;
  border-left: 4px solid #e74c3c;
  padding: 20px;
  margin: 25px 0;
  border-radius: 5px;
}

.highlight-box p {
  margin-bottom: 10px;
  color: #2c3e50;
}

.data-request {
  background: #f1f8ff;
  border: 1px solid #d1e7ff;
  border-radius: 10px;
  padding: 25px;
  margin: 25px 0;
}

.data-request h3 {
  color: #0066cc;
  margin-top: 0;
}

.signature {
  text-align: center;
  margin-top: 60px;
  color: #7f8c8d;
}

.signature hr {
  border: none;
  height: 1px;
  background: #bdc3c7;
  margin-bottom: 30px;
}

strong {
  color: #2c3e50;
}

@media (max-width: 768px) {
  .about-content {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .about-title {
    font-size: 2em;
  }
  
  .section h2 {
    font-size: 1.5em;
  }
}
</style>
