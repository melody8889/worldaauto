from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = r"C:\Users\Melody\Documents\汽车出口独立站\output\pdf\验车视频客户开发建议.pdf"
FONT_REGULAR = r"C:\Windows\Fonts\HarmonyOS_Sans_SC_Regular.ttf"
FONT_MEDIUM = r"C:\Windows\Fonts\HarmonyOS_Sans_SC_Medium.ttf"
FONT_BOLD = r"C:\Windows\Fonts\HarmonyOS_Sans_SC_Bold.ttf"


pdfmetrics.registerFont(TTFont("HarmonySC", FONT_REGULAR))
pdfmetrics.registerFont(TTFont("HarmonySC-Medium", FONT_MEDIUM))
pdfmetrics.registerFont(TTFont("HarmonySC-Bold", FONT_BOLD))


def p(text, style):
    return Paragraph(text, style)


def bullets(items, style, bullet_color=colors.HexColor("#2F5D50")):
    return ListFlowable(
        [
            ListItem(
                Paragraph(item, style),
                bulletColor=bullet_color,
                leftIndent=0,
            )
            for item in items
        ],
        bulletType="bullet",
        start="circle",
        leftIndent=14,
        bulletFontName="HarmonySC",
        bulletFontSize=8,
        spaceBefore=4,
        spaceAfter=4,
    )


def section_title(text, styles):
    return KeepTogether(
        [
            Spacer(1, 4),
            Paragraph(text, styles["section"]),
            Spacer(1, 2),
        ]
    )


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("HarmonySC", 8.5)
    canvas.setFillColor(colors.HexColor("#7B817C"))
    canvas.drawString(18 * mm, 13 * mm, "汽车出口客户开发备忘")
    canvas.drawRightString(192 * mm, 13 * mm, f"第 {doc.page} 页")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="title_cn",
        fontName="HarmonySC-Bold",
        fontSize=21,
        leading=27,
        textColor=colors.HexColor("#1E2B26"),
        alignment=TA_LEFT,
        wordWrap="CJK",
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="subtitle_cn",
        fontName="HarmonySC",
        fontSize=10.2,
        leading=15,
        textColor=colors.HexColor("#53605A"),
        wordWrap="CJK",
        spaceAfter=12,
    )
)
styles.add(
    ParagraphStyle(
        name="body_cn",
        fontName="HarmonySC",
        fontSize=9.35,
        leading=14.2,
        textColor=colors.HexColor("#26332D"),
        wordWrap="CJK",
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="body_strong",
        parent=styles["body_cn"],
        fontName="HarmonySC-Medium",
        textColor=colors.HexColor("#173A30"),
    )
)
styles.add(
    ParagraphStyle(
        name="section",
        fontName="HarmonySC-Bold",
        fontSize=12.5,
        leading=15,
        textColor=colors.HexColor("#1C4036"),
        wordWrap="CJK",
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="small",
        fontName="HarmonySC",
        fontSize=8.8,
        leading=13,
        textColor=colors.HexColor("#5E6862"),
        wordWrap="CJK",
    )
)
styles.add(
    ParagraphStyle(
        name="script",
        fontName="HarmonySC",
        fontSize=8.9,
        leading=13.2,
        textColor=colors.HexColor("#26332D"),
        wordWrap="CJK",
        leftIndent=2,
        rightIndent=2,
    )
)

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=A4,
    rightMargin=18 * mm,
    leftMargin=18 * mm,
    topMargin=15 * mm,
    bottomMargin=15 * mm,
)

story = []

story.append(p("潜在客户开发：验车视频怎么发更有效", styles["title_cn"]))
story.append(
    p(
        "结论：可以发，而且值得发。验车视频能把“我们真的在出货、会验车、能交付”这件事变成可见证据，比单纯报价或库存图更容易建立第一层信任。",
        styles["subtitle_cn"],
    )
)

summary_table = Table(
    [
        [
            p("<b>核心原则</b>", styles["body_strong"]),
            p("视频不是主角，信任才是主角。要短、真实、相关，并配一句自然引导。", styles["body_cn"]),
        ],
        [
            p("<b>最佳长度</b>", styles["body_strong"]),
            p("首发 15-30 秒精剪版。对方感兴趣后，再补完整验车视频或更多照片。", styles["body_cn"]),
        ],
        [
            p("<b>使用场景</b>", styles["body_strong"]),
            p("陌生客户破冰、报价后补信任、客户犹豫时证明流程、复盘已出货案例。", styles["body_cn"]),
        ],
    ],
    colWidths=[32 * mm, 124 * mm],
    hAlign="LEFT",
)
summary_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F2F6F1")),
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#CBD9D0")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D8E2DC")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]
    )
)
story.append(summary_table)

story.append(section_title("建议怎么发", styles))
story.append(
    bullets(
        [
            "先发短视频，不要一上来甩完整长视频。第一条只承担“让客户愿意继续看”的任务。",
            "镜头重点放在客户会在意的证据：外观、内饰、仪表、发动机舱/底盘、启动状态、装车或港口片段。",
            "文字不要写成广告。不要说“我们很专业”，而是说“我们会在交付前检查车况，不只是发库存图片”。",
            "按客户市场选择素材。俄罗斯客户看俄语市场常见车型，中东客户看 Land Cruiser、Patrol、BYD、Jetour 等更相关车型。",
        ],
        styles["body_cn"],
    )
)

story.append(section_title("发送前要注意", styles))
story.append(
    bullets(
        [
            "打码客户名、车架号、合同、车牌、物流单、收货人信息，避免泄露隐私。",
            "不要把视频包装得过度夸张。真实的验车过程比“大片感”更能让买家放心。",
            "如果视频里的车辆不是对方要的车型，要明确说“similar units”，避免客户误以为这台车正在出售。",
            "视频后面要接一个低压力问题，比如“你现在在找类似车型吗？”而不是立刻逼单。",
        ],
        styles["body_cn"],
    )
)

story.append(section_title("可直接复制的话术", styles))

script_rows = [
    [
        p("Email / LinkedIn", styles["body_strong"]),
        p(
            "Hi, we just finished inspection for a shipment before export.<br/>"
            "Sharing this short video so you can see how we check the car condition before delivery.<br/>"
            "If you are sourcing similar units, I can send available options with inspection photos/videos.",
            styles["script"],
        ),
    ],
    [
        p("WhatsApp", styles["body_strong"]),
        p(
            "This is one of our pre-shipment inspection videos. We usually check condition before delivery, not only send stock photos.<br/>"
            "Are you currently sourcing any similar models?",
            styles["script"],
        ),
    ],
]

script_table = Table(script_rows, colWidths=[35 * mm, 121 * mm], hAlign="LEFT")
script_table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FBFAF6")),
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#D9D2C3")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5DED0")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]
    )
)
story.append(script_table)

story.append(section_title("一个更自然的发送顺序", styles))
story.append(
    bullets(
        [
            "第一条：简短问候 + 一句话说明你最近有出货/验车素材。",
            "第二条：发送 15-30 秒视频。",
            "第三条：补一句“如果你在找类似车型，我可以发当前可选车源和验车照片”。",
            "客户回复后：再进入车型、年份、预算、目的港、付款方式等具体问题。",
        ],
        styles["body_cn"],
    )
)

story.append(Spacer(1, 3))
closing = Table(
    [
        [
            p(
                "一句话记住：不要把验车视频当广告发，把它当“可信交付证据”发。",
                styles["body_strong"],
            )
        ]
    ],
    colWidths=[156 * mm],
)
closing.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EAF2ED")),
            ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#AEC7B7")),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]
    )
)
story.append(closing)

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
