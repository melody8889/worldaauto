from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance


SRC = Path(r"C:\Users\Melody\AppData\Local\Temp\codex-clipboard-8788dabb-9458-47a2-9f06-d2a3378101d9.png")
OUT = Path(r"C:\Users\Melody\Documents\汽车出口独立站\output\furniture-suite-clean-white-bg.png")


def make_mask(size, draw_fn, scale=4):
    m = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    d = ImageDraw.Draw(m)
    box = lambda b: tuple(int(v * scale) for v in b)
    pts = lambda p: [(int(x * scale), int(y * scale)) for x, y in p]
    draw_fn(d, box, pts, scale)
    return m.resize(size, Image.Resampling.LANCZOS)


def rounded_mask(size, radius):
    return make_mask(size, lambda d, b, p, s: d.rounded_rectangle(b((0, 0, size[0], size[1])), radius=int(radius * s), fill=255))


def ellipse_mask(size):
    return make_mask(size, lambda d, b, p, s: d.ellipse(b((0, 0, size[0], size[1])), fill=255))


def enhance(img, contrast=1.0, brightness=1.0, sharpness=1.0):
    img = ImageEnhance.Contrast(img).enhance(contrast)
    img = ImageEnhance.Brightness(img).enhance(brightness)
    img = ImageEnhance.Sharpness(img).enhance(sharpness)
    return img


def tile_texture(src, crop, size, contrast=1.0, brightness=1.0):
    patch = src.crop(crop).convert("RGB")
    patch = enhance(patch, contrast, brightness, 1.15)
    tex = Image.new("RGB", size)
    for x in range(0, size[0], patch.width):
        for y in range(0, size[1], patch.height):
            tex.paste(patch, (x, y))
    return tex.crop((0, 0, size[0], size[1])).convert("RGBA")


def paste_shape(base, xy, size, mask, tex, shadow=True, edge=True):
    if shadow:
        sm = Image.new("L", base.size, 0)
        sm.paste(mask, (xy[0] + 14, xy[1] + 20))
        sm = sm.filter(ImageFilter.GaussianBlur(18))
        sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
        sh.putalpha(sm.point(lambda p: min(42, p // 4)))
        base.alpha_composite(sh)

    piece = tex.resize(size, Image.Resampling.BICUBIC)
    piece.putalpha(mask)
    base.alpha_composite(piece, xy)

    if edge:
        ed = mask.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(3))
        line = Image.new("RGBA", size, (72, 54, 43, 70))
        line.putalpha(ed.point(lambda p: min(80, p)))
        base.alpha_composite(line, xy)


def draw_wood_lines(base, rect, count, alpha=55):
    d = ImageDraw.Draw(base)
    x1, y1, x2, y2 = rect
    gap = (x2 - x1) / count
    for i in range(1, count):
        x = int(x1 + gap * i)
        d.line((x, y1 + 8, x, y2 - 8), fill=(35, 24, 20, alpha), width=2)


def add_ground(base, box, opacity=28):
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(sh)
    d.ellipse(box, fill=(0, 0, 0, opacity))
    sh = sh.filter(ImageFilter.GaussianBlur(20))
    base.alpha_composite(sh)


src = Image.open(SRC).convert("RGB")
canvas = Image.new("RGBA", (1800, 1050), (255, 255, 255, 255))

# Samples from the real photo: deep wood door panels and stone tops only.
WOOD_CROP = (1125, 462, 1588, 705)
DARK_WOOD_CROP = (1275, 675, 1605, 880)
STONE_CROP = (430, 704, 845, 800)
STONE_LONG_CROP = (1120, 404, 1660, 455)

wood = lambda size: tile_texture(src, WOOD_CROP, size, contrast=1.12, brightness=0.95)
dark_wood = lambda size: tile_texture(src, DARK_WOOD_CROP, size, contrast=1.12, brightness=0.88)
stone = lambda size: tile_texture(src, STONE_CROP, size, contrast=1.05, brightness=1.11)
stone_long = lambda size: tile_texture(src, STONE_LONG_CROP, size, contrast=1.04, brightness=1.12)

# Rear sideboard.
add_ground(canvas, (1010, 463, 1638, 532), 25)
body_xy, body_sz = (1030, 230), (590, 245)
paste_shape(canvas, body_xy, body_sz, rounded_mask(body_sz, 38), wood(body_sz), shadow=True)
top_xy, top_sz = (1002, 188), (650, 76)
paste_shape(canvas, top_xy, top_sz, rounded_mask(top_sz, 34), stone_long(top_sz), shadow=True)
draw_wood_lines(canvas, (1048, 252, 1602, 470), 6, 60)
d = ImageDraw.Draw(canvas)
d.arc((1025, 302, 1112, 440), 88, 272, fill=(30, 24, 21, 120), width=2)
d.line((1042, 480, 1606, 480), fill=(28, 24, 22, 120), width=7)

# Console table.
add_ground(canvas, (520, 500, 914, 555), 19)
c_xy, c_sz = (500, 330), (430, 78)
paste_shape(canvas, c_xy, c_sz, rounded_mask(c_sz, 36), stone(c_sz), shadow=True)
leg_sz = (70, 205)
for lx in [590, 770]:
    paste_shape(canvas, (lx, 392), leg_sz, rounded_mask(leg_sz, 8), wood(leg_sz), shadow=True)
    ImageDraw.Draw(canvas).line((lx + 63, 400, lx + 63, 584), fill=(25, 19, 17, 60), width=3)
d.line((598, 599, 838, 599), fill=(30, 25, 22, 100), width=5)

# Front TV cabinet.
add_ground(canvas, (1135, 835, 1745, 900), 26)
tv_xy, tv_sz = (1160, 620), (560, 205)
paste_shape(canvas, tv_xy, tv_sz, rounded_mask(tv_sz, 30), dark_wood(tv_sz), shadow=True)
tv_top_xy, tv_top_sz = (1128, 570), (650, 82)
paste_shape(canvas, tv_top_xy, tv_top_sz, rounded_mask(tv_top_sz, 38), stone_long(tv_top_sz), shadow=True)
d.rounded_rectangle((1433, 655, 1585, 716), radius=7, fill=(15, 14, 13, 245))
draw_wood_lines(canvas, (1183, 650, 1700, 816), 5, 48)
d.line((1180, 832, 1705, 832), fill=(27, 24, 22, 115), width=7)

# Round table.
add_ground(canvas, (885, 805, 1190, 872), 22)
r_xy, r_sz = (850, 585), (330, 178)
paste_shape(canvas, r_xy, r_sz, ellipse_mask(r_sz), stone(r_sz), shadow=True)
rl_sz = (145, 178)
paste_shape(canvas, (942, 725), rl_sz, rounded_mask(rl_sz, 24), dark_wood(rl_sz), shadow=True)

# Front oval coffee table.
add_ground(canvas, (315, 930, 912, 1002), 25)
o_xy, o_sz = (310, 675), (575, 178)
paste_shape(canvas, o_xy, o_sz, ellipse_mask(o_sz), stone(o_sz), shadow=True)
for lx in [420, 700]:
    paste_shape(canvas, (lx, 812), (86, 185), rounded_mask((86, 185), 8), wood((86, 185)), shadow=True)
d.rounded_rectangle((790, 768, 806, 798), radius=3, fill=(18, 24, 24, 210))

# Left side table.
add_ground(canvas, (85, 918, 374, 980), 23)
s_xy, s_sz = (90, 740), (265, 148)
paste_shape(canvas, s_xy, s_sz, ellipse_mask(s_sz), stone(s_sz), shadow=True)
paste_shape(canvas, (178, 852), (94, 150), rounded_mask((94, 150), 8), dark_wood((94, 150)), shadow=True)

OUT.parent.mkdir(parents=True, exist_ok=True)
canvas.convert("RGB").save(OUT, quality=96)
print(str(OUT))
