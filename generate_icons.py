from PIL import Image, ImageDraw

def create_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    margin = size * 0.05
    radius = size * 0.22
    
    # Outer soft glow
    draw.rounded_rectangle([margin, margin + size * 0.03, size - margin, size - margin + size * 0.03], radius=radius, fill=(2, 132, 199, 50))
    
    # Main badge box - bright turquoise/sky blue
    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, fill=(14, 165, 233, 255))
    
    # Inner border
    draw.rounded_rectangle([margin + size*0.03, margin + size*0.03, size - margin - size*0.03, size - margin - size*0.03], radius=radius*0.85, outline=(125, 211, 252, 200), width=max(2, int(size * 0.02)))
    
    # Volleyball motif
    cx, cy = size / 2, size / 2
    r = size * 0.28
    
    # Volleyball base
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, 255), outline=(6, 182, 212, 255), width=max(2, int(size * 0.025)))
    
    lw = max(2, int(size * 0.02))
    draw.arc([cx - r*1.3, cy - r*0.8, cx + r*0.7, cy + r*1.2], start=280, end=40, fill=(14, 165, 233, 255), width=lw)
    draw.arc([cx - r*0.7, cy - r*1.2, cx + r*1.3, cy + r*0.8], start=100, end=220, fill=(14, 165, 233, 255), width=lw)
    draw.line([cx - r*0.7, cy + r*0.5, cx + r*0.7, cy - r*0.5], fill=(6, 182, 212, 255), width=lw)
    
    # Star badge
    sx, sy = cx + r * 0.85, cy - r * 0.85
    star_r = size * 0.09
    draw.polygon([
        (sx, sy - star_r),
        (sx + star_r * 0.35, sy - star_r * 0.35),
        (sx + star_r, sy),
        (sx + star_r * 0.35, sy + star_r * 0.35),
        (sx, sy + star_r),
        (sx - star_r * 0.35, sy + star_r * 0.35),
        (sx - star_r, sy),
        (sx - star_r * 0.35, sy - star_r * 0.35),
    ], fill=(250, 204, 21, 255))
    
    img.save(filename, "PNG")
    print(f"Generated {filename}")

create_icon(192, "icon-192.png")
create_icon(512, "icon-512.png")
create_icon(64, "favicon.png")
