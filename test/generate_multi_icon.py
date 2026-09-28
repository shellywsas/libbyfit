from PIL import Image, ImageDraw
import math

def create_multi_sport_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    margin = size * 0.04
    radius = size * 0.22
    
    # Outer glow / shadow
    draw.rounded_rectangle([margin, margin + size*0.02, size - margin, size - margin + size*0.02], radius=radius, fill=(2, 132, 199, 40))
    
    # Main badge background: Fresh Bright Turquoise / Sky Blue
    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=radius, fill=(14, 165, 233, 255))
    
    # Subtle inner border
    draw.rounded_rectangle([margin + size*0.02, margin + size*0.02, size - margin - size*0.02, size - margin - size*0.02], radius=radius*0.9, outline=(125, 211, 252, 180), width=max(2, int(size*0.015)))

    # Grid arrangement: 4 Quadrants for the 4 sports:
    # Top-Left: Volleyball over Net
    # Top-Right: Tennis Ball
    # Bottom-Left: Dumbbell
    # Bottom-Right: Climbing Wall Holds

    # --- 1. Top-Left: Volleyball & Net ---
    # Net horizontal lines
    net_y1 = size * 0.36
    net_y2 = size * 0.44
    draw.line([size * 0.12, net_y1, size * 0.44, net_y1], fill=(255, 255, 255, 200), width=max(2, int(size*0.015)))
    draw.line([size * 0.12, net_y2, size * 0.44, net_y2], fill=(255, 255, 255, 180), width=max(2, int(size*0.012)))
    # Net vertical mesh
    for nx in [0.18, 0.26, 0.34, 0.42]:
        draw.line([size * nx, net_y1, size * nx, net_y2], fill=(255, 255, 255, 160), width=max(1, int(size*0.008)))
    
    # Volleyball leaping above net
    vx, vy = size * 0.28, size * 0.24
    vr = size * 0.13
    draw.ellipse([vx - vr, vy - vr, vx + vr, vy + vr], fill=(255, 255, 255, 255), outline=(6, 182, 212, 255), width=max(2, int(size*0.018)))
    # Volleyball seams
    draw.arc([vx - vr*1.2, vy - vr*0.7, vx + vr*0.6, vy + vr*1.1], start=280, end=35, fill=(14, 165, 233, 255), width=max(1, int(size*0.012)))
    draw.arc([vx - vr*0.6, vy - vr*1.1, vx + vr*1.2, vy + vr*0.7], start=100, end=215, fill=(14, 165, 233, 255), width=max(1, int(size*0.012)))

    # --- 2. Top-Right: Tennis Ball (Neon yellow-green with white seam) ---
    tx, ty = size * 0.72, size * 0.25
    tr = size * 0.13
    draw.ellipse([tx - tr, ty - tr, tx + tr, ty + tr], fill=(163, 230, 53, 255), outline=(101, 163, 13, 255), width=max(2, int(size*0.015)))
    # Classic curved tennis seams (white)
    draw.arc([tx - tr*1.3, ty - tr, tx + tr*0.4, ty + tr], start=300, end=60, fill=(255, 255, 255, 255), width=max(2, int(size*0.016)))
    draw.arc([tx - tr*0.4, ty - tr, tx + tr*1.3, ty + tr], start=120, end=240, fill=(255, 255, 255, 255), width=max(2, int(size*0.016)))

    # --- 3. Bottom-Left: Dumbbell (חדר כושר) ---
    dx, dy = size * 0.28, size * 0.72
    # Bar
    draw.line([dx - size*0.14, dy, dx + size*0.14, dy], fill=(226, 232, 240, 255), width=max(3, int(size*0.035)))
    # Outer weight plates
    draw.rounded_rectangle([dx - size*0.15, dy - size*0.09, dx - size*0.10, dy + size*0.09], radius=size*0.02, fill=(30, 41, 59, 255))
    draw.rounded_rectangle([dx + size*0.10, dy - size*0.09, dx + size*0.15, dy + size*0.09], radius=size*0.02, fill=(30, 41, 59, 255))
    # Inner weight plates
    draw.rounded_rectangle([dx - size*0.10, dy - size*0.065, dx - size*0.06, dy + size*0.065], radius=size*0.015, fill=(71, 85, 105, 255))
    draw.rounded_rectangle([dx + size*0.06, dy - size*0.065, dx + size*0.10, dy + size*0.065], radius=size*0.015, fill=(71, 85, 105, 255))

    # --- 4. Bottom-Right: Climbing Wall Holds (קיר טיפוס) ---
    # Wall background panel
    wx1, wy1 = size * 0.58, size * 0.56
    wx2, wy2 = size * 0.88, size * 0.86
    draw.rounded_rectangle([wx1, wy1, wx2, wy2], radius=size*0.04, fill=(241, 245, 249, 230))
    # Hold 1 (Coral pink polygon)
    draw.polygon([(size*0.64, size*0.62), (size*0.72, size*0.60), (size*0.75, size*0.67), (size*0.67, size*0.69)], fill=(244, 63, 94, 255))
    draw.ellipse([size*0.68, size*0.64, size*0.70, size*0.66], fill=(159, 18, 57, 255)) # screw bolt
    # Hold 2 (Bright Orange sloper)
    draw.rounded_rectangle([size*0.73, size*0.72, size*0.84, size*0.79], radius=size*0.025, fill=(249, 115, 22, 255))
    draw.ellipse([size*0.77, size*0.745, size*0.79, size*0.765], fill=(154, 52, 18, 255)) # bolt
    # Hold 3 (Mint Green jug)
    draw.polygon([(size*0.62, size*0.76), (size*0.68, size*0.74), (size*0.70, size*0.82), (size*0.63, size*0.82)], fill=(16, 185, 129, 255))
    draw.ellipse([size*0.65, size*0.775, size*0.67, size*0.795], fill=(6, 95, 70, 255)) # bolt

    # Center Sparkling Star / Heart badge
    cx, cy = size * 0.5, size * 0.5
    draw.ellipse([cx - size*0.07, cy - size*0.07, cx + size*0.07, cy + size*0.07], fill=(255, 255, 255, 240), outline=(2, 132, 199, 200), width=max(1, int(size*0.01)))
    # Golden Star
    star_r = size * 0.05
    draw.polygon([
        (cx, cy - star_r),
        (cx + star_r * 0.35, cy - star_r * 0.35),
        (cx + star_r, cy),
        (cx + star_r * 0.35, cy + star_r * 0.35),
        (cx, cy + star_r),
        (cx - star_r * 0.35, cy + star_r * 0.35),
        (cx - star_r, cy),
        (cx - star_r * 0.35, cy - star_r * 0.35),
    ], fill=(250, 204, 21, 255))

    img.save(filename, "PNG")
    print(f"Generated {filename}")

create_multi_sport_icon(192, "icon-192.png")
create_multi_sport_icon(512, "icon-512.png")
create_multi_sport_icon(64, "favicon.png")
