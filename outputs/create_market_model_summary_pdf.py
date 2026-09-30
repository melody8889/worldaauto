from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


OUTPUT = r"C:\Users\Melody\Documents\汽车出口独立站\outputs\中东和俄罗斯市场车型整理方法.pdf"
FONT = r"C:\Windows\Fonts\NotoSansSC-VF.ttf"


pdfmetrics.registerFont(TTFont("NotoSC", FONT))

styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    "TitleCN",
    parent=styles["Title"],
    fontName="NotoSC",
    fontSize=22,
    leading=30,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#1F2933"),
    spaceAfter=12,
)
subtitle_style = ParagraphStyle(
    "SubtitleCN",
    parent=styles["Normal"],
    fontName="NotoSC",
    fontSize=10,
    leading=16,
    alignment=TA_CENTER,
    textColor=colors.HexColor("#5B6770"),
    spaceAfter=18,
)
section_style = ParagraphStyle(
    "SectionCN",
    parent=styles["Heading2"],
    fontName="NotoSC",
    fontSize=15,
    leading=22,
    textColor=colors.HexColor("#111827"),
    spaceBefore=12,
    spaceAfter=8,
)
body_style = ParagraphStyle(
    "BodyCN",
    parent=styles["BodyText"],
    fontName="NotoSC",
    fontSize=10.5,
    leading=18,
    alignment=TA_LEFT,
    textColor=colors.HexColor("#27313A"),
    spaceAfter=7,
)
small_style = ParagraphStyle(
    "SmallCN",
    parent=styles["BodyText"],
    fontName="NotoSC",
    fontSize=9,
    leading=14,
    textColor=colors.HexColor("#3F4A54"),
)
table_header = ParagraphStyle(
    "TableHeaderCN",
    parent=small_style,
    fontName="NotoSC",
    fontSize=9,
    leading=12,
    textColor=colors.white,
)
table_cell = ParagraphStyle(
    "TableCellCN",
    parent=small_style,
    fontName="NotoSC",
    fontSize=8.5,
    leading=12,
)


def p(text, style=body_style):
    return Paragraph(text, style)


def bullets(items):
    story = []
    for item in items:
        story.append(p("• " + item))
    return story


def table(data, widths):
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2933")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, -1), "NotoSC"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#D8DEE4")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#FAFBFC")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F6F8FA")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


story = []
story.append(p("中东与俄罗斯市场畅销车型整理方法", title_style))
story.append(p("给 Worlda Global Auto 用的动态车型池整理框架", subtitle_style))

story.append(p("核心思路", section_style))
story.extend(
    bullets(
        [
            "不要只做“销量榜”，要做“销售机会榜”。销量高不等于适合出口，也不等于你有利润空间。",
            "把车型分成三类：稳定热销款、最近变热款、可创新推荐款。",
            "中东和俄罗斯必须分开整理，两边客户偏好、气候、政策、品牌接受度和价格逻辑都不一样。",
            "AI 可以帮你做初筛，但最终判断要结合客户询盘、同行报价、当地平台、社媒热度和现车供应。",
        ]
    )
)

story.append(p("一、车型池分三类", section_style))
story.append(
    table(
        [
            [p("分类", table_header), p("含义", table_header), p("整理重点", table_header)],
            [
                p("稳定热销款", table_cell),
                p("长期好卖、客户认知强、市场接受度高的车型。", table_cell),
                p("用于建立信任和判断客户当前采购习惯。", table_cell),
            ],
            [
                p("最近变热款", table_cell),
                p("最近询盘变多、短视频流量高、同行开始频繁推荐的车型。", table_cell),
                p("适合做短视频、报价单和主页重点展示。", table_cell),
            ],
            [
                p("可创新推荐款", table_cell),
                p("不是市场第一名，但有价格、配置、现车或出口优势的车型。", table_cell),
                p("用于打开差异化销售机会，避免只卖大家都在卖的车。", table_cell),
            ],
        ],
        [34 * mm, 76 * mm, 70 * mm],
    )
)

story.append(p("二、建议表格字段", section_style))
story.extend(
    bullets(
        [
            "市场",
            "车型",
            "品牌",
            "车身类型",
            "燃油 / 混动 / 纯电",
            "目标客户",
            "为什么可能好卖",
            "对标车型",
            "价格优势",
            "供应优势",
            "风险点",
            "证据来源",
            "推荐等级",
            "备注",
        ]
    )
)

story.append(p("三、不要只看销量，要看出口机会", section_style))
story.extend(
    bullets(
        [
            "客户是否认识这个车型。",
            "当地是否接受中国品牌。",
            "是否适合当地气候和路况。",
            "是否有明显价格差或配置优势。",
            "是否有现车、是否方便出口。",
            "同行是否正在推，社媒短视频是否有热度。",
            "客户询盘后是否愿意继续聊价格、配置和交付。",
        ]
    )
)

story.append(PageBreak())

story.append(p("四、中东市场整理逻辑", section_style))
story.append(
    p(
        "中东市场不要简单说“中国车替代 Land Cruiser / Patrol”。更好的说法是：客户已经有 Land Cruiser 和 Patrol 渠道，我们推荐的是更高配置、更低预算、更容易拿货的 SUV / PHEV / 7座车型。",
    )
)
story.append(
    table(
        [
            [p("方向", table_header), p("适合整理的车型类型", table_header), p("销售切入点", table_header)],
            [
                p("硬派 SUV", table_cell),
                p("Jetour T2、Tank 300 / 500、类似越野风格车型", table_cell),
                p("外观强、通过性强、适合热门 SUV 需求的低预算替代选择。", table_cell),
            ],
            [
                p("7座家庭 SUV", table_cell),
                p("Chery Tiggo 8 / 9、Geely Monjaro、Jetour 系列", table_cell),
                p("空间、配置、家庭用途和性价比。", table_cell),
            ],
            [
                p("PHEV / 节油 SUV", table_cell),
                p("BYD Song Plus DM-i 等插混 SUV", table_cell),
                p("适合想降低油耗、又担心纯电补能的客户。", table_cell),
            ],
            [
                p("传统稳定款", table_cell),
                p("Land Cruiser、Patrol、Prado、Lexus LX、Hilux、Fortuner、Hiace", table_cell),
                p("用来判断客户主流采购习惯，不一定作为你的唯一推荐。", table_cell),
            ],
        ],
        [34 * mm, 72 * mm, 74 * mm],
    )
)

story.append(p("中东车型备注写法示例", section_style))
story.append(
    p(
        "Suitable for buyers who want SUV demand but need lower price, richer configuration, and easier supply from China.",
    )
)

story.append(p("五、俄罗斯市场整理逻辑", section_style))
story.append(
    p(
        "俄罗斯市场要重点看寒冷地区适应性、维修配件、燃油车 / SUV 接受度、价格优势和平行进口需求。不要只看豪车，也要整理实用 SUV、跨界车、经济轿车、中国品牌家庭 SUV、商用车和二手高端车。",
    )
)
story.append(
    table(
        [
            [p("方向", table_header), p("整理重点", table_header), p("判断问题", table_header)],
            [
                p("SUV / Crossover", table_cell),
                p("中国品牌家庭 SUV、城市 SUV、四驱或高离地间隙车型。", table_cell),
                p("是否适合冬季、路况和家庭用车需求？", table_cell),
            ],
            [
                p("经济轿车", table_cell),
                p("价格低、维修简单、油耗可控的车型。", table_cell),
                p("是否能满足出租、家庭和低预算买家？", table_cell),
            ],
            [
                p("二手高端车", table_cell),
                p("有品牌认知、价格差、可操作出口路径的车型。", table_cell),
                p("车况、年限、手续和汇率风险是否可控？", table_cell),
            ],
            [
                p("商用车", table_cell),
                p("MPV、Van、小型商用车、工程/业务用途车型。", table_cell),
                p("当地小企业和经销商是否有稳定需求？", table_cell),
            ],
        ],
        [34 * mm, 72 * mm, 74 * mm],
    )
)

story.append(PageBreak())

story.append(p("六、信息来源建议", section_style))
story.extend(
    bullets(
        [
            "当地汽车网站和经销商网站。",
            "当地经销商 Instagram / TikTok / YouTube。",
            "当地二手车平台和 Facebook Marketplace。",
            "Google Trends 和短视频热度。",
            "海关 / 进口记录平台。",
            "同行朋友圈、报价单、展厅在推车型。",
            "你自己的客户询盘记录，这是最重要的数据。",
        ]
    )
)

story.append(p("七、客户询盘记录模板", section_style))
story.append(
    table(
        [
            [p("字段", table_header), p("记录内容", table_header)],
            [p("客户国家", table_cell), p("例如 UAE、Saudi Arabia、Russia、Kazakhstan 等。", table_cell)],
            [p("询盘车型", table_cell), p("客户主动问的车型，不要只记录你推荐的车型。", table_cell)],
            [p("预算", table_cell), p("FOB / CIF / 目标落地价都可以记录。", table_cell)],
            [p("是否要现车", table_cell), p("现车、预订、颜色配置要求。", table_cell)],
            [p("是否接受中国品牌", table_cell), p("接受 / 犹豫 / 不接受，记录原因。", table_cell)],
            [p("后续状态", table_cell), p("是否继续聊、是否要报价、是否要照片视频、是否失联。", table_cell)],
        ],
        [42 * mm, 138 * mm],
    )
)

story.append(p("八、车型评分方法", section_style))
story.append(p("每个车型按 1-5 分打分，最后不要机械看总分，要结合你的供应能力和利润空间。"))
story.append(
    table(
        [
            [p("评分项", table_header), p("说明", table_header)],
            [p("市场认知度", table_cell), p("当地客户是否知道、是否愿意主动问。", table_cell)],
            [p("价格优势", table_cell), p("相比本地渠道或竞品是否有吸引力。", table_cell)],
            [p("供应稳定性", table_cell), p("是否容易拿车、颜色配置是否稳定。", table_cell)],
            [p("视频传播力", table_cell), p("外观、内饰、卖点是否适合短视频。", table_cell)],
            [p("出口可操作性", table_cell), p("手续、运输、认证、付款是否可控。", table_cell)],
            [p("客户询盘热度", table_cell), p("真实客户是否在问，而不是只有网上热度。", table_cell)],
            [p("利润空间", table_cell), p("是否有足够利润支持报价和后续服务。", table_cell)],
        ],
        [42 * mm, 138 * mm],
    )
)

story.append(p("最终输出建议", section_style))
story.extend(
    bullets(
        [
            "Middle East：Core hot models + China alternatives。",
            "Russia：Practical demand models + supply opportunity models。",
            "你要整理的是客户已经知道什么车、你可以切入推荐什么车、为什么这款车现在值得推。",
        ]
    )
)

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=15 * mm,
    leftMargin=15 * mm,
    topMargin=16 * mm,
    bottomMargin=16 * mm,
)
doc.build(story)
print(OUTPUT)
