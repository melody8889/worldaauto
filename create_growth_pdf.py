from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
import os

out=os.path.join('output','pdf'); os.makedirs(out,exist_ok=True)
pdfmetrics.registerFont(TTFont('YaHei','C:/Windows/Fonts/simhei.ttf'))
path=os.path.join(out,'汽车出口业务增长行动计划.pdf')
doc=SimpleDocTemplate(path,pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=16*mm,bottomMargin=16*mm)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCN',fontName='YaHei',fontSize=24,leading=32,textColor=colors.HexColor('#17324d'),spaceAfter=12))
styles.add(ParagraphStyle(name='HeadCN',fontName='YaHei',fontSize=15,leading=23,textColor=colors.HexColor('#17324d'),spaceBefore=10,spaceAfter=7))
styles.add(ParagraphStyle(name='BodyCN',fontName='YaHei',fontSize=10.5,leading=18,spaceAfter=6))
P=lambda t,s='BodyCN': Paragraph(t,styles[s])
story=[P('汽车出口业务增长行动计划','TitleCN'),P('从“每天更新社媒”升级为可持续的获客、成交、交付与复购系统','HeadCN'),P('核心判断：社媒内容只是曝光入口。汽车出口真正的增长，来自精准市场定位、主动开发、信任建设、标准化跟进和老客户复购。')]
sections=[('一、先明确一个细分市场',['不要一开始什么车、什么国家都做。选择一个主要市场、一类客户、一类主推车型和一个核心卖点。','示例定位：We help dealers in Kenya source reliable Chinese hybrid vehicles with inspection videos and transparent shipping updates。','客户越具体，越容易相信你是这个领域的专业供应商。']),('二、建立信任资产',['持续展示仓库和装车视频、VIN 查询和检测报告、出口流程、装柜报关提单案例、客户验车和到港反馈、定金合同付款及退款流程、目标国家进口要求。','客户最担心的是公司是否真实、车况是否真实、付款后是否失联、文件是否齐全以及到港后是否有售后。','内容目标不是单纯获得点赞，而是让客户看完后敢于发询盘。']),('三、建立主动获客渠道',['通过 Google Maps、LinkedIn、Facebook 汽车经销商群组、WhatsApp、Telegram、TikTok、Instagram 和当地二手车网站主动寻找车商。','每天目标：新增 20 个精准客户，发送 10 条个性化开发消息，跟进 10 个旧询盘，获得 3 个有效需求，完成 1–2 份正式报价。','开发话术：Hi David, I noticed your dealership mainly sells Toyota and hybrid SUVs in Nairobi. We currently have several low-mileage hybrid models available in China. Would you like me to send you a short list with FOB prices and inspection videos?']),('四、做一个能成交的网站',['网站应包含 Stock List、How It Works、Inspection、Shipping、Customer Cases、About Us 和 FAQ。','每个车型页面都应有明确按钮：Get Inspection Video、Request FOB Price、Check Shipping Cost。','网站的作用是解决客户疑虑并推动询盘，而不只是展示漂亮车型图片。']),('五、把询盘处理流程标准化',['准备询盘登记表或 CRM、统一报价模板、车型推荐模板、检测报告模板、FOB/CIF/DDP 报价模板、WhatsApp 跟进节奏和异议回答库。','跟进节奏：第 0 天发送报价和视频；第 1 天确认收到；第 3 天补充替代车型；第 7 天发送库存或价格变化；第 14 天询问采购计划；之后每月更新一次目标车型库存。','不要只问 Any update? 可以问：Are you mainly comparing price, vehicle condition, or shipping cost at this stage?']),('六、设计复购和转介绍机制',['老客户优先看新库存、固定采购专员、批量采购价格、月度库存清单、客户专属车型筛选、交付后 7 天和 30 天回访、转介绍奖励以及当地市场车型建议。','目标不是只卖出一台车，而是成为客户在中国的长期采购代表。'])]
for h,ps in sections:
    story.append(P(h,'HeadCN'))
    for x in ps: story.append(P('• '+x))
story.append(PageBreak()); story.append(P('90 天执行计划','TitleCN'))
for h,x in [('第 1–2 周','确定目标国家、客户类型和主推车型；整理网站、资质、报价和检测资料。形成清晰定位和销售资料包。'),('第 3–4 周','建立 200–300 个精准客户名单；每天主动开发和跟进。获得第一批有效需求。'),('第 2 个月','重点跟进询盘；发布真实案例；测试不同国家和车型的回复率。找到回复率更高的市场。'),('第 3 个月','集中资源到高潜市场；建立老客户复购和转介绍流程。形成稳定的销售管道。')]:
    story.append(P(h,'HeadCN')); story.append(P(x))
story.append(P('每日建议工作分配','HeadCN'))
for x in ['1 小时寻找精准客户','1 小时主动开发','1 小时跟进询盘','1 小时整理车辆和报价','1 小时制作信任内容','1 小时优化网站、流程和客户资料']: story.append(P('• '+x))
story.append(P('最重要的原则：先扩大精准客户数量和成交信任度，再扩大车型数量。建立稳定的车商客户和复购机制后，增长会比单纯依赖社媒稳定得多。','HeadCN'))
doc.build(story); print(path)
