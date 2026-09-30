from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


SRC = Path(r"C:\Users\Melody\AppData\Local\Temp\codex-clipboard-8788dabb-9458-47a2-9f06-d2a3378101d9.png")
OUT = Path(r"C:\Users\Melody\Documents\汽车出口独立站\output\furniture-suite-white-bg.png")


def aa_mask(size, draw_fn, scale=4):
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)

    def sc_points(points):
        return [(int(x * scale), int(y * scale)) for x, y in points]

    def sc_box(box):
        return tuple(int(v * scale) for v in box)

    draw_fn(draw, sc_points, sc_box, scale)
    return mask.resize(size, Image.Resampling.LANCZOS)


def paste_piece(canvas, src, mask, bbox=None):
    if bbox:
        x1, y1, x2, y2 = bbox
        piece = src.crop(bbox).convert("RGBA")
        piece_mask = mask.crop(bbox)
        canvas.alpha_composite(piece, (x1, y1), source=(0, 0, x2 - x1, y2 - y1))
        alpha = Image.new("L", canvas.size, 0)
        alpha.paste(piece_mask, (x1, y1))
        current = canvas.getchannel("A")
        canvas.putalpha(Image.composite(current, current, alpha))
    else:
        canvas.alpha_composite(src.convert("RGBA"), (0, 0), source=(0, 0, src.width, src.height))


def masked_paste(canvas, src, mask):
    layer = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    layer.alpha_composite(src.convert("RGBA"))
    layer.putalpha(mask)
    canvas.alpha_composite(layer)


def add_shadow(base, box, opacity=48, blur=18):
    shadow = Image.new("RGBA", base.size, (255, 255, 255, 0))
    d = ImageDraw.Draw(shadow)
    d.ellipse(box, fill=(0, 0, 0, opacity))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(shadow)


src = Image.open(SRC).convert("RGB")
w, h = src.size

product_mask = aa_mask((w, h), lambda d, p, b, s: [
    # Back console table.
    d.rounded_rectangle(b((488, 480, 935, 553)), radius=int(36 * s), fill=255),
    d.polygon(p([(568, 532), (654, 532), (676, 735), (583, 735)]), fill=255),
    d.polygon(p([(789, 530), (873, 530), (866, 736), (776, 736)]), fill=255),

    # Long rear sideboard.
    d.rounded_rectangle(b((1048, 392, 1710, 744)), radius=int(44 * s), fill=255),

    # Front TV cabinet, visible upper and left sections.
    d.rounded_rectangle(b((1258, 625, 1917, 801)), radius=int(30 * s), fill=255),
    d.polygon(p([(1260, 740), (1440, 728), (1440, 927), (1280, 927), (1260, 850)]), fill=255),

    # Center round table.
    d.ellipse(b((888, 637, 1215, 815)), fill=255),
    d.rounded_rectangle(b((954, 785, 1125, 932)), radius=int(22 * s), fill=255),

    # Front oval coffee table.
    d.ellipse(b((340, 685, 897, 852)), fill=255),
    d.polygon(p([(414, 818), (511, 827), (505, 1030), (429, 1030)]), fill=255),
    d.polygon(p([(734, 800), (823, 793), (811, 1030), (735, 1030)]), fill=255),

    # Left round side table.
    d.ellipse(b((-15, 771, 320, 932)), fill=255),
    d.rounded_rectangle(b((70, 892, 202, 1032)), radius=int(16 * s), fill=255),
])

# Remove the two unwanted light-wood pieces and the cropped foreground table from the mask.
remove_mask = aa_mask((w, h), lambda d, p, b, s: [
    d.rounded_rectangle(b((1668, 378, 1918, 635)), radius=int(18 * s), fill=255),
    d.rounded_rectangle(b((1413, 786, 1918, 1066)), radius=int(55 * s), fill=255),
    d.rounded_rectangle(b((690, 914, 1390, 1066)), radius=int(24 * s), fill=255),
    d.rounded_rectangle(b((-5, 1018, 760, 1066)), radius=int(20 * s), fill=255),
])
product_mask = Image.eval(Image.composite(Image.new("L", (w, h), 0), product_mask, remove_mask), lambda px: px)

canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255))

for box, op, blur in [
    ((45, 940, 230, 1038), 30, 16),
    ((395, 970, 835, 1060), 38, 18),
    ((945, 895, 1140, 955), 30, 14),
    ((1050, 700, 1700, 780), 28, 20),
    ((1265, 875, 1740, 950), 30, 18),
    ((555, 695, 875, 750), 22, 16),
]:
    add_shadow(canvas, box, op, blur)

# Rebuild the lower part of the TV cabinet that was blocked by the unwanted light table.
wood_patch = src.crop((1280, 724, 1475, 917)).resize((520, 210), Image.Resampling.BICUBIC)
wood_layer = Image.new("RGBA", (w, h), (255, 255, 255, 0))
wood_layer.paste(wood_patch, (1395, 736))
wood_mask = aa_mask((w, h), lambda d, p, b, s: [
    d.rounded_rectangle(b((1392, 730, 1915, 928)), radius=int(30 * s), fill=255),
    d.rectangle(b((1392, 730, 1918, 830)), fill=255),
])
wood_layer.putalpha(wood_mask)
canvas.alpha_composite(wood_layer)

masked_paste(canvas, src, product_mask)

# Softly cover tiny red-frame remnants near product edges if any survive.
cleanup = Image.new("RGBA", (w, h), (255, 255, 255, 0))
cd = ImageDraw.Draw(cleanup)
cd.rectangle((0, 255, 1918, 273), fill=(255, 255, 255, 255))
cd.rectangle((0, 1053, 1918, 1066), fill=(255, 255, 255, 255))
cd.rectangle((0, 260, 17, 1066), fill=(255, 255, 255, 255))
cd.rectangle((1913, 260, 1918, 1066), fill=(255, 255, 255, 255))
canvas.alpha_composite(cleanup)

# Crop to content with clean padding.
alpha = Image.eval(product_mask, lambda px: 255 if px > 8 else 0)
bbox = alpha.getbbox()
if bbox:
    x1, y1, x2, y2 = bbox
    pad_x, pad_y = 90, 70
    x1, y1 = max(0, x1 - pad_x), max(0, y1 - pad_y)
    x2, y2 = min(w, x2 + pad_x), min(h, y2 + pad_y)
    result = canvas.crop((x1, y1, x2, y2)).convert("RGB")
else:
    result = canvas.convert("RGB")

# Make it a clean landscape catalog image.
target_w = 1800
scale = target_w / result.width
target_h = int(result.height * scale)
result = result.resize((target_w, target_h), Image.Resampling.LANCZOS)
final = Image.new("RGB", (1800, max(980, target_h + 80)), "white")
final.paste(result, (0, 40))

OUT.parent.mkdir(parents=True, exist_ok=True)
final.save(OUT, quality=96)
print(str(OUT))
