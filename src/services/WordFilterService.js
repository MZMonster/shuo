/**
 * 敏感词过滤
 */
var _ = require('lodash');
var keyWordsTree = null;    // 敏感词树

var traChn = '產皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩';

var simChn = '产皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄';

function translation(str) {
  var c = [];
  for (var i = 0; i < str.length; i++) {
    var ch = str[i];
    var chHex = str.charCodeAt(i).toString(16);
    chHex = _.parseInt(chHex, 16);
    /*全角=>半角*/
    if (chHex > 0xFF00 && chHex < 0xFF5F){
      chHex = (chHex - 0xFEE0);
    }

    /*大写=>小写*/
    if (chHex > 0x40 && chHex < 0x5b){
      chHex = (chHex + 0x20);
    }

    /*繁体=>简体*/
    if (chHex > 0x4E00 && chHex < 0x9FFF) {
      var index = traChn.indexOf(ch);
      if (index > -1) {
        ch = simChn[index];
        chHex = simChn.charCodeAt(index).toString(16);
        chHex = _.parseInt(chHex, 16);
      }
    }
    c.push(String.fromCharCode(chHex));
  }
  return c;
}

//跳过符号和数字
function isSkip(firstChar) {
  if (firstChar < '0'){
    return true;
  }
  if (firstChar > '9' && firstChar < 'A'){
    return true;
  }
  if (firstChar > 'Z' && firstChar < 'a'){
    return true;
  }
  return (firstChar > 'z' && firstChar < 128);
}

/**
 * find out the sensitive words in the source text
 * @param {String} srcText
 * @returns {Object}
 *  {badWords: [], text: '替换后的文字'}
 */
function checkText(srcText) {
  var resultJson = {    //返回结果
    badWords: [],
    text: srcText
  };

  if (_.isNull(keyWordsTree)) {
    sails.log.error('违禁词库未初始化');
    return resultJson;
  }

  if (_.isEmpty(srcText)) {
    return resultJson;
  }

  var text  = translation(srcText);
  var resultText = srcText;
  var badWordStart = 0; // 当前敏感词开始位置

  /**
   * 从头到尾扫描文本,遇到符号或者非敏感字符跳过,
   * 遇到敏感字的第一个字则向后匹配是否符合敏感词库
   */
  while(badWordStart < text.length) {
    var badWordLen = 0; // 当前敏感词长度
    var len = text.length - 1;  // 最大下标
    var curChar = text[badWordStart+badWordLen];  // 当前字符
    var curNode = {}; // 当前敏感词所在的敏感词树节点

    while(isSkip(curChar) && !keyWordsTree[curChar] && (badWordStart + badWordLen ) < len){
      badWordStart++; // 没匹配到敏感词, 则敏感词开始下标后移
      curChar = text[badWordStart + badWordLen]; // 匹配下一个字符
    }

    // 发现第一个敏感字符, 此时firstChar为敏感词开始字符, 开始匹配后面的字符
    curNode = keyWordsTree;
    while (typeof curNode[curChar] !== 'undefined') {
      curNode = curNode[curChar];  // 当前敏感词所在的子树
      badWordLen++;

      if ((badWordStart + badWordLen) >= text.length) {
        break;
      }

      curChar = text[badWordStart + badWordLen]; // 下一个字符

      // 如果当前字符为符合, 并且不是结束字符, 认为是干扰词, 直接下一个
      while (isSkip(curChar) && !curNode.isEnd && (badWordStart + badWordLen) < len) {
        badWordLen++;
        curChar = text[badWordStart+badWordLen];
      }
    }

    // 如果到这里curNode.isEnd = false, 表示我们只匹配到前部分, 所以认为该词不是敏感词, 继续下一个字符
    //
    // 如果curNode.isEnd, 则匹配到了敏感词
    // 将敏感词用"*"代替,并添加到badWords数组
    if (curNode.isEnd) {
      var badWords = srcText.substr(badWordStart, badWordLen);
      var replace = '**********';

      // 限制*的最长长度
      replace = replace.length > badWordLen ? replace.substr(0, badWordLen) : replace;

      resultJson.badWords.push(badWords);

      // 将敏感词替换为菊花
      resultText = resultText.replace(new RegExp(badWords, 'g'), replace);

      badWordStart += badWordLen - 1;
    }

    badWordStart++;
  }

  // 将替换后字符串添加到返回json中
  resultJson.text = resultText;

  return resultJson;
}

/**
 * 构建敏感词树
 * 比如keyword = [{keyword: 毛泽东},{keyword: 毛岸青},{keyword: 毛岸红}]; // 为了举例把主席爷爷家族给挖出来了, sorry
 * 会构建成如下树
 *  {
 *   毛:{
 *      泽:{ 东:{isEnd: true} }
 *      岸:{
 *         青:{isEnd: true}
 *         红:{isEnd: true}
 *      }
 *    }
 *  }
 *  如果输入毛泽,则不认为是敏感词
 *  输入毛泽东则认为是敏感词
 *
 * @param keywords
 * @param isRebuild 是否重建树
 * @private
 */
function _build(keywords, isRebuild) {
  if(isRebuild){
    keyWordsTree = {};
    keyWordsTree.isEnd = false;
  }
  _.forEach(keywords, function (item) {
    var chs = translation(item.keyword);
    var ch = chs[0];
    var chNext = '';

    if (typeof keyWordsTree[ch] === 'undefined') {
      keyWordsTree[ch] = {};
    }

    var curNode = keyWordsTree[ch];
    for (var i = 1; i < chs.length; i++) {
      curNode.isEnd = false;
      chNext = chs[i];

      if (typeof curNode[chNext] === 'undefined') {
        curNode[chNext] = {};
      }

      if (i === chs.length - 1) {
        curNode[chNext].replace = item.replace;
        curNode[chNext].isEnd = true;
      }

      curNode = curNode[chNext];
    }
  });
}
/**
 * 初始化敏感词库
 * 将敏感词构建成一颗树
 * @param keywords Array
 *  eg: [{keyword:'共产党',replace:'{MOD}'}, {keyword:'习近平',replace:'{BANNED}'},
 *        {keyword:'BANNED',replace:'banned'}, {keyword:'STAR', replace:''}]
 */
function init(keywords){
  if (!_.isArray(keywords)) {
    throw '关键词列表不是数组';
  }

  _build(keywords, true);
}

/**
 * 添加关键词
 * @param keyword object or array
 *      eg. {keyword: 'fuck', replace: '{MOD}'}
 *      eg. [{keyword: 'fuck', replace: '{MOD}'}, {keyword: 'asshole'}]
 */
function addKeyword(keyword) {
  if (!_.isArray(keyword) && _.isObject(keyword)) {
    keyword = [keyword];
  }
  _build(keyword);
}


module.exports = {
  init: init,
  addKeyword: addKeyword,
  checkText: checkText
};
