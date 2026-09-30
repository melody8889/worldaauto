from pathlib import Path
import re


root = Path(r"C:\Users\Melody\Documents\汽车出口独立站")
text = (root / "script.js").read_text(encoding="utf-8")
for slug in ["deepal-s07", "deepal-s05", "deepal-sl03", "rox-adamas"]:
    idx = text.index(f'slug: "{slug}"')
    block = text[idx : text.index("}", idx)]
    paths = re.findall(r'"(assets/products/[^"]+)"', block)
    print(slug)
    for rel in paths:
        path = root / rel
        print(" OK " if path.exists() else " MISS ", rel)
