(function() {
  angular
    .module('loc8rApp')
    .controller('paperCtrl', paperCtrl);
    
  function paperCtrl() {
    var vm = this;
    vm.pageHeader = {
      title: '修改客户信息',
    };
    vm.main = {
      content: '上海纳纳液压件有限公司，位于上海西北角彭浦地区共康开发区，拥有建筑面积1500平方米厂房。公司从事液压软管总成的制造，具备φ2通径至φ203通径定制加工生产能力。产品用于建筑工程机械、矿石机械、冶金设备、压机、注塑和造船、柴油机、清洗及各类测压系统、测压软管、测压接头。凭借优良的生产设备、先进的测试手段、一流的技术人才、全新的管理模式、高性能的产品及优质的售后服务，企业已打造出坚实的基础，具备千万元产值的生产能力。质量是纳纳赖以生存和发展的基础，而持续改进是纳纳不断取得进步的保障。ISO9001:2000版质量体系的建立，使公司的全面质量管理水平得到了进一步提高。我们的服务理念广泛地定义为“为客户创造价值”，这种价值集中表现为帮助客户实现其现实和未来的利益。\n\n公司董事黎允朝、谭秋根偕全体员工衷心希望新老客户继续予以大力支持和帮助，我公司将以更饱满的热情、更规范的生产质量全程流程管理，更好的为客户服务。让正在蓬勃发展的客户群带领纳纳公司走得更高、更远。' 
    };
  }
})();