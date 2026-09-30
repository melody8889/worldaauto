from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.colors import HexColor
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

OUT = "output/pdf/汽车出口获客落地执行手册.pdf"
pdfmetrics.registerFont(TTFont("MicrosoftYaHei", r"C:\Windows\Fonts\msyh.ttc"))
pdfmetrics.registerFont(TTFont("MicrosoftYaHei-Bold", r"C:\Windows\Fonts\msyhbd.ttc"))

navy = HexColor("#12283F")
teal = HexColor("#147A78")
gold = HexColor("#EBA02E")
ink = HexColor("#20262C")
muted = HexColor("#5F686F")
pale = HexColor("#EFF6F5")
line = HexColor("#D3DDDD")

styles = getSampleStyleSheet()
def ps(name, size, leading=None, font="MicrosoftYaHei", color=ink, spaceAfter=0):
    return ParagraphStyle(name, parent=styles["Normal"], fontName=font, fontSize=size,
                          leading=leading or size * 1.5, textColor=color,
                          alignment=TA_LEFT, spaceAfter=spaceAfter)

body = ps("body", 9.5, 14)
small = ps("small", 8.3, 12, color=muted)
title = ps("title", 28, 36, "MicrosoftYaHei-Bold", colors.white)
subtitle = ps("subtitle", 22, 30, "MicrosoftYaHei-Bold", HexColor("#A3E8E1"))
h2 = ps("h2", 14, 20, "MicrosoftYaHei-Bold", navy, 7)
h3 = ps("h3", 11, 16, "MicrosoftYaHei-Bold", teal, 4)
table_head = ps("table_head", 8.2, 11, "MicrosoftYaHei-Bold", colors.white)
table_cell = ps("table_cell", 8.2, 11)
table_cell_center = ps("table_cell_center", 8.2, 11)

def P(text, style=body):
    return Paragraph(text.replace("\n", "<br/>"), style)

def section(title_text):
    return [Table([[P("", ps("bar", 1)), P(title_text, h2)]],
                  colWidths=[5*mm, 160*mm],
                  style=TableStyle([("BACKGROUND", (0,0), (0,0), teal),
                                    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
                                    ("LEFTPADDING", (0,0), (-1,-1), 0),
                                    ("RIGHTPADDING", (0,0), (-1,-1), 5),
                                    ("TOPPADDING", (0,0), (-1,-1), 0),
                                    ("BOTTOMPADDING", (0,0), (-1,-1), 0)])), Spacer(1, 4)]

def checkbox(text):
    return P("□  " + text, body)

def bullet(text):
    return P("•  " + text, body)

def data_table(data, widths, row_heights=None):
    converted = []
    for ri, row in enumerate(data):
        style = table_head if ri == 0 else table_cell
        converted.append([P(str(c), style) for c in row])
    t = Table(converted, colWidths=widths, rowHeights=row_heights, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), teal),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("GRID", (0,0), (-1,-1), 0.45, line),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 5),
        ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ] + [("BACKGROUND", (0, r), (-1, r), pale if r % 2 == 0 else colors.white)
         for r in range(2, len(data))]))
    return t

def on_page(canvas, doc):
    if doc.page == 1:
        return
    canvas.saveState()
    canvas.setFillColor(navy)
    canvas.rect(0, A4[1] - 22*mm, A4[0], 22*mm, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("MicrosoftYaHei-Bold", 13)
    canvas.drawString(15*mm, A4[1] - 14*mm, "汽车出口获客落地执行手册")
    canvas.setFillColor(HexColor("#CDE9E6"))
    canvas.setFont("MicrosoftYaHei", 8)
    canvas.drawRightString(A4[0] - 15*mm, A4[1] - 13.7*mm, "每天 2 小时，连续 7 天")
    canvas.setStrokeColor(line)
    canvas.line(15*mm, 12*mm, A4[0] - 15*mm, 12*mm)
    canvas.setFillColor(muted)
    canvas.setFont("MicrosoftYaHei", 8)
    canvas.drawRightString(A4[0] - 15*mm, 7*mm, f"第 {doc.page} 页")
    canvas.restoreState()

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=15*mm, rightMargin=15*mm,
                      topMargin=30*mm, bottomMargin=16*mm)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="main", frames=frame, onPage=on_page)])
story = []

# Cover
story += [Spacer(1, 20*mm), Table([[P("汽车出口获客", title)], [P("落地执行手册", subtitle)]],
                                  colWidths=[180*mm],
                                  style=TableStyle([("BACKGROUND", (0,0), (-1,-1), navy),
                                                    ("LEFTPADDING", (0,0), (-1,-1), 14),
                                                    ("TOPPADDING", (0,0), (-1,-1), 12),
                                                    ("BOTTOMPADDING", (0,0), (-1,-1), 12)])),
          Spacer(1, 11*mm), P("给自己一个 7 天周期，把“等客户”变成每天可完成的动作。", ps("lead", 12, 18, color=navy)),
          Spacer(1, 8*mm),
          Table([[P("<b>本手册的目标</b><br/>每天完成 10 个有效触达，持续发布真实车辆内容，建立自己的客户池和转介绍渠道。<br/><font color='#5F686F'>适用业务：二手车、新能源车、整车出口、阿联酋及非洲/中亚市场开发</font>", body)]],
                colWidths=[180*mm], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), colors.white),
                                                       ("BOX", (0,0), (-1,-1), 0.6, line),
                                                       ("LEFTPADDING", (0,0), (-1,-1), 8*mm),
                                                       ("RIGHTPADDING", (0,0), (-1,-1), 8*mm),
                                                       ("TOPPADDING", (0,0), (-1,-1), 6*mm),
                                                       ("BOTTOMPADDING", (0,0), (-1,-1), 6*mm)])),
          Spacer(1, 8*mm)] + section("使用规则") + [
          checkbox("每天只抓 2 小时，先完成动作，再优化方法。"), Spacer(1, 3*mm),
          checkbox("先问客户车型、预算和目的地，再发送匹配车辆。"), Spacer(1, 3*mm),
          checkbox("每一次联系都记录结果，避免重复和遗忘。"), Spacer(1, 3*mm),
          checkbox("7 天后复盘：哪个国家、车型和渠道回复率最高。"),
          Spacer(1, 25*mm), P("开始日期：__________________    本周目标：获得 ______ 个有效询盘", small),
          PageBreak()]

# Page 2
story += section("每天 2 小时工作块") + [P("把时间固定下来。你不需要等状态好才开始，按顺序做完即可。", small), Spacer(1, 4*mm),
    data_table([
        ["时间", "动作", "完成标准"],
        ["0:00-0:30", "整理客户名单", "新增 20 个真实客户，写清国家、主营车型、联系方式"],
        ["0:30-1:10", "首次触达", "发消息给 10 个客户，至少 3 个是精准匹配"],
        ["1:10-1:20", "休息", "离开屏幕，喝水，回来继续"],
        ["1:20-1:50", "发布内容", "发布 1 条真实车辆信息，含图片/视频、年份、价格区间"],
        ["1:50-2:00", "跟进记录", "跟进 5 人，填写结果和下次联系日期"],
    ], [24*mm, 36*mm, 110*mm]), Spacer(1, 6*mm)] + section("每天开始前写下 3 件事") + [
    checkbox("今天要联系的国家/市场：________________________________"), Spacer(1, 2*mm),
    checkbox("今天主推车型：________________________________________"), Spacer(1, 2*mm),
    checkbox("今天完成后能看到的结果：_______________________________"), Spacer(1, 5*mm)] + section("客户来源清单") + [
    bullet("Google Maps：搜索 used car dealer、car importer、auto trading + 国家/城市。"), Spacer(1, 1*mm),
    bullet("Facebook 群组：搜索 UAE used cars、African car dealers、Chinese cars in [国家]。"), Spacer(1, 1*mm),
    bullet("LinkedIn：搜索 importer、dealer、procurement、automotive trading。"), Spacer(1, 1*mm),
    bullet("WhatsApp：优先联系有公开号码、近期发车源或询价内容的人。"), Spacer(1, 5*mm),
    Table([[P("<b>今天的最低完成线</b><br/>20 个名单 + 10 条首次消息 + 1 条车辆内容 + 5 个跟进。做完就算完成。", body)]],
          colWidths=[180*mm], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), HexColor("#FFF4DB")),
                                                 ("BOX", (0,0), (-1,-1), 0.6, HexColor("#EBC276")),
                                                 ("LEFTPADDING", (0,0), (-1,-1), 6*mm), ("RIGHTPADDING", (0,0), (-1,-1), 6*mm),
                                                 ("TOPPADDING", (0,0), (-1,-1), 4*mm), ("BOTTOMPADDING", (0,0), (-1,-1), 4*mm)])),
    PageBreak()]

# Page 3
story += section("7 天获客任务表") + [P("每一天只增加一个重点，避免同时研究太多平台。", small), Spacer(1, 3*mm),
    data_table([
        ["天", "主题", "当天任务", "验收结果"],
        ["1", "建立名单", "找 20 个车商/进口商，完成 10 次首次联系", "至少 1 人回复"],
        ["2", "测试车型", "发布 2 个车型，比较哪条内容有人问", "记录询问车型"],
        ["3", "扩大渠道", "加入 5 个相关群组，发 1 条真实车源", "新增 10 个潜客"],
        ["4", "做转介绍", "联系 10 个旧客户/货代/供应商，提出介绍合作", "获得 2 个转介绍线索"],
        ["5", "建立信任", "给 5 个客户发送验车视频、底盘号或装运流程", "至少 2 个进入询价"],
        ["6", "集中跟进", "跟进前 5 天所有已回复客户", "明确预算/车型/目的地"],
        ["7", "复盘优化", "统计回复率、询价率、有效渠道和热门车型", "确定下周重点"],
    ], [12*mm, 33*mm, 83*mm, 52*mm]), Spacer(1, 6*mm)] + section("每晚 5 分钟复盘") + [
    checkbox("今天新增客户：______ 人    首次触达：______ 人"), Spacer(1, 2*mm),
    checkbox("回复：______ 人    有效询盘：______ 人    报价：______ 人"), Spacer(1, 2*mm),
    checkbox("今天哪个动作最有效：__________________________________"), Spacer(1, 2*mm),
    checkbox("明天要删掉或调整的动作：_______________________________"), Spacer(1, 5*mm),
    Table([[P("<b>判断标准</b><br/>不要只看成交。前期先看“回复”和“有效询盘”。如果连续 3 天没人回复，优先改客户名单、开场问题或主推车型。", body)]],
          colWidths=[180*mm], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), pale), ("BOX", (0,0), (-1,-1), 0.6, HexColor("#A9D2CF")),
                                                 ("LEFTPADDING", (0,0), (-1,-1), 6*mm), ("RIGHTPADDING", (0,0), (-1,-1), 6*mm),
                                                 ("TOPPADDING", (0,0), (-1,-1), 4*mm), ("BOTTOMPADDING", (0,0), (-1,-1), 4*mm)])),
    PageBreak()]

# Page 4
story += section("首次联系：英文短消息") + [
    Table([[P("Hi, I’m [Name] from China. We export used cars and new energy vehicles with inspection videos, chassis numbers and shipping support.<br/><br/>Are you currently sourcing cars from China? Please tell me the models and price range you are looking for. I can send you suitable stock today.<br/><br/><font color='#5F686F'>中文意思：我们出口二手车和新能源车，可提供验车视频、底盘号和运输支持。您目前从中国采购车辆吗？请告诉我想要的车型和预算，我今天可以发匹配车源。</font>", body)]],
          colWidths=[180*mm], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), HexColor("#F3F8F8")), ("BOX", (0,0), (-1,-1), 0.6, line),
                                                 ("LEFTPADDING", (0,0), (-1,-1), 6*mm), ("RIGHTPADDING", (0,0), (-1,-1), 6*mm),
                                                 ("TOPPADDING", (0,0), (-1,-1), 5*mm), ("BOTTOMPADDING", (0,0), (-1,-1), 5*mm)])),
    Spacer(1, 6*mm)] + section("客户回复后：4 个问题") + [
    bullet("Which models are you looking for? 你要找哪些车型？"), Spacer(1, 1*mm),
    bullet("What is your target price range? 你的目标预算是多少？"), Spacer(1, 1*mm),
    bullet("Which destination port and country? 目的港和国家是哪里？"), Spacer(1, 1*mm),
    bullet("How many units do you need per month? 每月大约需要多少台？"), Spacer(1, 5*mm)] + section("跟进话术") + [
    data_table([
        ["时间", "消息"],
        ["2-3 天后", "Hi [Name], I found a few cars that may fit your market. Would you like me to send the details and videos?"],
        ["客户已看车源", "Which one is closer to your target? I can check the latest price and shipping cost for you."],
        ["客户不回复", "Just checking whether you are still sourcing cars this month. I can send only the models within your budget."],
        ["客户说贵", "Understood. If you share your target price, I can look for another year, mileage or model option."],
    ], [28*mm, 152*mm]), Spacer(1, 5*mm),
    Table([[P("<b>小原则：</b>每次消息只推进一个问题。让客户容易回复，比一次发一大段公司介绍更重要。", body)]],
          colWidths=[180*mm], style=TableStyle([("BACKGROUND", (0,0), (-1,-1), HexColor("#FFF4DB")), ("BOX", (0,0), (-1,-1), 0.6, HexColor("#EBC276")),
                                                 ("LEFTPADDING", (0,0), (-1,-1), 6*mm), ("RIGHTPADDING", (0,0), (-1,-1), 6*mm),
                                                 ("TOPPADDING", (0,0), (-1,-1), 4*mm), ("BOTTOMPADDING", (0,0), (-1,-1), 4*mm)])),
    PageBreak()]

# Page 5
story += section("转介绍合作方案") + [P("你可以主动找拥有客户资源的人合作，不必等别人自然推荐。", small), Spacer(1, 3*mm),
    data_table([
        ["合作对象", "你提供什么", "怎么开口"],
        ["旧客户", "新车源、价格和物流支持", "有朋友也在找中国车吗？成交后我给你介绍费。"],
        ["货代/物流", "稳定车源和客户需求", "你有买家询车时可以转给我，我按成交台数结算。"],
        ["短视频/外贸顾问", "内容素材和佣金", "你负责带来询盘，我负责报价、验车和发运。"],
        ["修理厂/车行", "车型匹配和售后协同", "客户需要采购车辆时，可以直接把我的 WhatsApp 给他。"],
    ], [38*mm, 58*mm, 84*mm]), Spacer(1, 6*mm)] + section("客户跟进记录表") + [
    data_table([
        ["客户/公司", "国家/城市", "需求车型/预算", "当前状态", "下次跟进"],
        ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""],
        ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""],
    ], [32*mm, 32*mm, 38*mm, 38*mm, 40*mm], [10*mm]*7), Spacer(1, 6*mm)] + section("本周复盘") + [
    checkbox("回复率最高的渠道：____________________________________"), Spacer(1, 2*mm),
    checkbox("客户最常问的车型/预算：________________________________"), Spacer(1, 2*mm),
    checkbox("下周只重点做的两个渠道：_______________________________"), Spacer(1, 2*mm),
    checkbox("下周目标：有效询盘 ______ 个，报价 ______ 个，成交 ______ 台"),
    Spacer(1, 8*mm), P("提醒：先连续执行 7 天，再判断方法是否有效。", ps("remind", 9.5, 14, "MicrosoftYaHei-Bold", teal))]

doc.build(story)
print(OUT)
