from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance


SRC = Path(r"C:\Users\Melody\AppData\Local\Temp\codex-clipboard-8788dabb-9458-47a2-9f06-d2a3378101d9.png")
OUT = Path(r"C:\Users\Melody\Documents\汽车出口独立站\output\furniture-suite-rebuilt-white-bg.png")


def mask(size, draw_fn, scale=4):
    m = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    d = ImageDraw.Draw(m)
    sb = lambda box: tuple(int(v * scale) for v in box)
    sp = lambda pts: [(int(x * scale), int(y * scale)) for x, y in pts]
    draw_fn(d, sb, sp, scale)
    return m.resize(size, Image.Resampling.LANCZOS)


def texture(src, box, size, contrast=1.0, brightness=1.0):
    t = src.crop(box).resize(size, Image.Resampling.BICUBIC).convert("RGB")
    t = ImageEnhance.Contrast(t).enhance(contrast)
    t = ImageEnhance.Brightness(t).enhance(brightness)
    return t.convert("RGBA")


def paste_masked(base, img, xy, m, shadow=None):
    if shadow:
        sx, sy, blur, op = shadow
        sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
        sh_mask = Image.new("L", base.size, 0)
        sh_mask.paste(m, (xy[0] + sx, xy[1] + sy))
        sh_mask = sh_mask.filter(ImageFilter.GaussianBlur(blur))
        sh.putalpha(Image.eval(sh_mask, lambda p: min(op, p * op // 255)))
        base.alpha_composite(sh)
    layer = Image.new("RGBA", base.size, (255, 255, 255, 0))
    piece = img.copy()
    piece.putalpha(m)
    layer.alpha_composite(piece, xy)
    base.alpha_composite(layer)


def add_outline(base, xy, m, color=(85, 62, 48, 90), width=2):
    edge = m.filter(ImageFilter.FIND_EDGES)
    edge = edge.filter(ImageFilter.MaxFilter(width * 2 + 1))
    layer = Image.new("RGBA", base.size, (255, 255, 255, 0))
    edge_rgba = Image.new("RGBA", m.size, color)
    edge_rgba.putalpha(edge.point(lambda p: min(90, p)))
    layer.alpha_composite(edge_rgba, xy)
    base.alpha_composite(layer)


def rounded_rect(size, radius):
    return mask(size, lambda d, b, p, s: d.rounded_rectangle(b((0, 0, size[0], size[1])), radius=radius * s, fill=255))


def ellipse(size):
    return mask(size, lambda d, b, p, s: d.ellipse(b((0, 0, size[0], size[1])), fill=255))


src = Image.open(SRC).convert("RGB")
canvas = Image.new("RGBA", (1800, 1050), (255, 255, 255, 255))

wood = lambda size: texture(src, (1110, 450, 1605, 720), size, contrast=1.08, brightness=0.96)
wood_dark = lambda size: texture(src, (1300, 724, 1510, 900), size, contrast=1.05, brightness=0.92)
marble = lambda size: texture(src, (380, 700, 880, 835), size, contrast=1.03, brightness=1.08)
marble_long = lambda size: texture(src, (1080, 405, 1680, 462), size, contrast=1.02, brightness=1.08)

# Rear sideboard.
x, y = 1010, 185
body_size = (620, 255)
body_m = rounded_rect(body_size, 42)
paste_masked(canvas, wood(body_size), (x, y + 34), body_m, shadow=(12, 22, 20, 35))
top_m = rounded_rect((650, 74), 34)
paste_masked(canvas, marble_long((650, 74)), (x - 15, y), top_m, shadow=(4, 10, 10, 18))
d = ImageDraw.Draw(canvas)
for vx in [x + 110, x + 220, x + 330, x + 440, x + 550]:
    d.line((vx, y + 55, vx, y + 276), fill=(53, 38, 31, 72), width=2)
d.arc((x - 4, y + 106, x + 86, y + 250), 90, 270, fill=(40, 31, 25, 110), width=2)
d.line((x + 5, y + 286, x + 605, y + 286), fill=(28, 25, 23, 130), width=8)

# Right front TV cabinet.
x, y = 1130, 545
tv_body = rounded_rect((590, 190), 28)
paste_masked(canvas, wood_dark((590, 190)), (x, y + 42), tv_body, shadow=(12, 20, 18, 35))
tv_top = rounded_rect((655, 80), 36)
paste_masked(canvas, marble_long((655, 80)), (x - 35, y), tv_top, shadow=(5, 12, 10, 16))
d = ImageDraw.Draw(canvas)
d.rounded_rectangle((x + 265, y + 82, x + 420, y + 138), radius=6, fill=(16, 15, 14, 245))
for vx in [x + 125, x + 255, x + 435, x + 555]:
    d.line((vx, y + 55, vx, y + 225), fill=(52, 37, 31, 75), width=2)
d.line((x + 18, y + 232, x + 575, y + 232), fill=(27, 24, 22, 115), width=7)

# Back console table.
x, y = 520, 250
top = rounded_rect((420, 76), 36)
paste_masked(canvas, marble((420, 76)), (x, y), top, shadow=(4, 10, 10, 16))
leg_m = rounded_rect((66, 205), 6)
paste_masked(canvas, wood((66, 205)), (x + 85, y + 62), leg_m, shadow=(5, 12, 12, 20))
paste_masked(canvas, wood((66, 205)), (x + 272, y + 62), leg_m, shadow=(5, 12, 12, 20))
ImageDraw.Draw(canvas).line((x + 92, y + 267, x + 338, y + 267), fill=(38, 32, 27, 90), width=5)

# Center round table.
x, y = 870, 540
round_top = ellipse((330, 175))
paste_masked(canvas, marble((330, 175)), (x, y), round_top, shadow=(5, 13, 12, 22))
round_leg = rounded_rect((145, 170), 22)
paste_masked(canvas, wood_dark((145, 170)), (x + 92, y + 128), round_leg, shadow=(7, 14, 15, 26))

# Front oval coffee table.
x, y = 330, 620
oval_top = ellipse((560, 172))
paste_masked(canvas, marble((560, 172)), (x, y), oval_top, shadow=(6, 14, 14, 24))
leg = rounded_rect((82, 202), 8)
paste_masked(canvas, wood((82, 202)), (x + 110, y + 126), leg, shadow=(6, 15, 15, 24))
paste_masked(canvas, wood((82, 202)), (x + 380, y + 116), leg, shadow=(6, 15, 15, 24))
d = ImageDraw.Draw(canvas)
d.rounded_rectangle((x + 460, y + 94, x + 474, y + 122), radius=3, fill=(20, 25, 25, 210))

# Left side table.
x, y = 95, 720
side_top = ellipse((260, 145))
paste_masked(canvas, marble((260, 145)), (x, y), side_top, shadow=(4, 12, 13, 22))
side_leg = rounded_rect((95, 155), 8)
paste_masked(canvas, wood_dark((95, 155)), (x + 82, y + 110), side_leg, shadow=(6, 13, 14, 23))

# Subtle grounding ellipses.
ground = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
gd = ImageDraw.Draw(ground)
for box in [
    (80, 955, 385, 1010, 22),
    (310, 925, 900, 1000, 25),
    (850, 835, 1215, 900, 22),
    (995, 475, 1645, 538, 20),
    (1110, 775, 1735, 845, 25),
]:
    gd.ellipse(box[:4], fill=(0, 0, 0, box[4]))
ground = ground.filter(ImageFilter.GaussianBlur(17))
canvas.alpha_composite(ground)

# Re-paste visible items over grounding where necessary.
# The grounding goes last for softness under pieces, so use low opacity only.

OUT.parent.mkdir(parents=True, exist_ok=True)
canvas.convert("RGB").save(OUT, quality=96)
print(str(OUT))
