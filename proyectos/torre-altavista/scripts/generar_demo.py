"""
Genera los recursos de muestra del recorrido por un edificio de apartamentos:
  - 9 ilustraciones (entrada, parking, living, áreas recreativas, apartamento,
    cocina, baño, sala de estar y terraza) como pósters WebP
  - 8 clips MP4 de transición entre escenas consecutivas

Son ilustraciones de muestra, no videos de Wan. Sirven para validar el
mecanismo de scroll; después se reemplazan por los clips generados localmente
con los mismos nombres de archivo.

Uso:  python scripts/generar_demo.py   (desde proyectos/torre-altavista)
Requiere: Pillow, numpy y ffmpeg en el PATH.
"""

import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent   # proyectos/torre-altavista
DIR_IMG = RAIZ / "src" / "assets" / "paseo"
DIR_VIDEO = RAIZ / "public" / "video"

W, H = 1920, 1080          # lienzo base de las escenas
S = 2                      # supermuestreo para suavizar bordes
OUT_W, OUT_H = 1600, 900   # tamaño de pósters y video
FPS = 60                   # más fotogramas por tramo de scroll = recorrido más fluido

CALIDA = (255, 214, 156)   # vidrio iluminado
MARCO = (48, 46, 46)
MADERA = (150, 108, 72)
MADERA_OSCURA = (118, 82, 52)
CIELO = ((30, 40, 70), (236, 170, 124))


# ---------------------------------------------------------------- utilidades

def P(pts):
    return [(x * S, y * S) for x, y in pts]


def box(x0, y0, x1, y1):
    return [x0 * S, y0 * S, x1 * S, y1 * S]


def lienzo(color=(0, 0, 0)):
    img = Image.new("RGB", (W * S, H * S), color)
    return img, ImageDraw.Draw(img)


def gradiente(size, c1, c2):
    """Degradado vertical de c1 (arriba) a c2 (abajo)."""
    mask = Image.linear_gradient("L").resize(size)
    return Image.composite(Image.new("RGB", size, c2), Image.new("RGB", size, c1), mask)


def poligono_degradado(img, pts, c1, c2):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    x0, y0, x1, y1 = int(min(xs)), int(min(ys)), int(max(xs)) + 1, int(max(ys)) + 1
    grad = gradiente((x1 - x0, y1 - y0), c1, c2)
    mask = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(mask).polygon([(x - x0, y - y0) for x, y in pts], fill=255)
    img.paste(grad, (x0, y0), mask)


def rect_degradado(img, x0, y0, x1, y1, c1, c2):
    poligono_degradado(img, P([(x0, y0), (x1, y0), (x1, y1), (x0, y1)]), c1, c2)


def translucido(img, pts, color, alpha):
    """Superficie semitransparente (vidrio)."""
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).polygon(P(pts), fill=alpha)
    img.paste(Image.new("RGB", img.size, color), (0, 0), mask)


def resplandor(img, formas, color, radio):
    """Suma un brillo difuso (ventanas iluminadas, lámparas, sol)."""
    capa = Image.new("RGB", img.size, (0, 0, 0))
    d = ImageDraw.Draw(capa)
    for tipo, coords in formas:
        if tipo == "rect":
            d.rectangle(box(*coords), fill=color)
        else:
            d.ellipse(box(*coords), fill=color)
    capa = capa.filter(ImageFilter.GaussianBlur(radio * S))
    return ImageChops.screen(img, capa)


def finalizar(img):
    return img.resize((W, H), Image.LANCZOS)


def lineas_perspectiva(d, vp, y_ini, y_fin, x_ini, x_fin, n, color, ancho=1):
    """Líneas del piso que convergen al punto de fuga."""
    vx, vy = vp
    t = (y_ini - vy) / (y_fin - vy)
    for i in range(n + 1):
        xb = x_ini + (x_fin - x_ini) * i / n
        xt = vx + (xb - vx) * t
        d.line(P([(xt, y_ini), (xb, y_fin)]), fill=color, width=ancho * S)


def lineas_profundidad(d, vp, y_ini, y_fin, filas, color, ancho=1):
    """Juntas horizontales del piso, más juntas cuanto más lejos."""
    vy = vp[1]
    s_min = (y_ini - vy) / (y_fin - vy)
    for k in range(filas + 1):
        y = vy + (y_fin - vy) * s_min ** (k / filas)
        d.line(P([(0, y), (W, y)]), fill=color, width=ancho * S)


def solo_piso(img, atras, antes):
    """Deja las líneas dibujadas desde `antes` únicamente dentro del piso de la habitación."""
    x0, y0, x1, y1 = atras
    fuera = Image.new("L", img.size, 255)
    ImageDraw.Draw(fuera).polygon(P([(x0, y1), (x1, y1), (W, H), (0, H)]), fill=0)
    img.paste(antes, (0, 0), fuera)


def cuarto(img, d, atras, techo, izq, der, fondo, piso):
    """Habitación en perspectiva de un punto: techo, paredes, fondo y piso."""
    x0, y0, x1, y1 = atras
    poligono_degradado(img, P([(0, 0), (W, 0), (x1, y0), (x0, y0)]), *techo)
    poligono_degradado(img, P([(0, 0), (x0, y0), (x0, y1), (0, H)]), *izq)
    poligono_degradado(img, P([(W, 0), (x1, y0), (x1, y1), (W, H)]), *der)
    d.rectangle(box(*atras), fill=fondo)
    poligono_degradado(img, P([(x0, y1), (x1, y1), (W, H), (0, H)]), *piso)


def ciudad(img, d, x0, y0, x1, y1, semilla):
    """Vista de la ciudad al atardecer: cielo, cerros y edificios con ventanas encendidas."""
    rect_degradado(img, x0, y0, x1, y1, *CIELO)
    alto = y1 - y0
    ancho_total = x1 - x0
    horizonte = y0 + alto * 0.74
    d.polygon(P([(x0, horizonte - alto * 0.12), (x0 + ancho_total * 0.3, horizonte - alto * 0.2),
                 (x0 + ancho_total * 0.65, horizonte - alto * 0.1), (x1, horizonte - alto * 0.18),
                 (x1, y1), (x0, y1)]), fill=(78, 72, 94))
    d.rectangle(box(x0, horizonte, x1, y1), fill=(44, 46, 62))
    rng = np.random.default_rng(semilla)
    x = x0
    while x < x1:
        ancho = rng.uniform(0.035, 0.08) * ancho_total
        alto_edif = rng.uniform(0.08, 0.34) * alto
        xf = min(x + ancho, x1)
        tono = int(rng.uniform(48, 70))
        d.rectangle(box(x, horizonte - alto_edif, xf, y1), fill=(tono, tono + 4, tono + 22))
        paso_y = alto * 0.04
        paso_x = ancho * 0.24
        wy = horizonte - alto_edif + paso_y * 0.6
        while wy < y1 - paso_y * 0.5:
            wx = x + ancho * 0.12
            while wx < xf - ancho * 0.12:
                if rng.random() < 0.32:
                    d.rectangle(box(wx, wy, wx + paso_x * 0.5, wy + paso_y * 0.45), fill=(255, 212, 150))
                wx += paso_x
            wy += paso_y
        x = xf + rng.uniform(0, 0.012) * ancho_total


def maceta(d, x, y, escala=1.0):
    d.polygon(P([(x - 40 * escala, y), (x + 40 * escala, y), (x + 32 * escala, y + 70 * escala),
                 (x - 32 * escala, y + 70 * escala)]), fill=(200, 190, 174))
    for dx, dy, r in [(-34, -40, 40), (30, -56, 44), (0, -100, 48), (-44, -104, 34), (40, -118, 36)]:
        d.ellipse(box(x + (dx - r) * escala, y + (dy - r * 0.6) * escala,
                      x + (dx + r) * escala, y + (dy + r * 0.6) * escala), fill=(58, 92, 60))


def colgante(d, luces, x, y_techo, y, r=22, color=(255, 236, 196)):
    d.line(P([(x, y_techo), (x, y - r)]), fill=(40, 40, 42), width=2 * S)
    d.ellipse(box(x - r, y - r, x + r, y + r), fill=color)
    luces.append(("ellipse", (x - r * 3, y - r * 3, x + r * 3, y + r * 3)))


def auto(d, x, y, largo, color):
    """Auto de perfil, sencillo."""
    alto = largo * 0.3
    d.rounded_rectangle(box(x, y - alto * 0.55, x + largo, y), radius=alto * 0.25 * S, fill=color)
    d.polygon(P([(x + largo * 0.22, y - alto * 0.55), (x + largo * 0.34, y - alto),
                 (x + largo * 0.7, y - alto), (x + largo * 0.82, y - alto * 0.55)]), fill=color)
    d.polygon(P([(x + largo * 0.27, y - alto * 0.58), (x + largo * 0.36, y - alto * 0.92),
                 (x + largo * 0.68, y - alto * 0.92), (x + largo * 0.77, y - alto * 0.58)]), fill=(150, 170, 186))
    for rx in (x + largo * 0.2, x + largo * 0.8):
        d.ellipse(box(rx - alto * 0.24, y - alto * 0.24, rx + alto * 0.24, y + alto * 0.24), fill=(26, 26, 28))


# ---------------------------------------------------------------- escenas

def escena_entrada():
    img = gradiente((W * S, H * S), CIELO[0], CIELO[1])
    d = ImageDraw.Draw(img)
    rng = np.random.default_rng(11)
    for _ in range(50):
        x, y = rng.uniform(0, W), rng.uniform(0, 260)
        d.ellipse(box(x, y, x + 2.2, y + 2.2), fill=(235, 230, 220))

    # torres vecinas
    for x0, x1, arriba, color in [(0, 300, 260, (58, 60, 80)), (1600, 1920, 200, (54, 56, 76)),
                                  (250, 540, 420, (66, 66, 86)), (1380, 1660, 380, (62, 62, 82))]:
        d.rectangle(box(x0, arriba, x1, 820), fill=color)
        for wy in range(arriba + 30, 790, 46):
            for wx in range(x0 + 20, x1 - 30, 44):
                if rng.random() < 0.3:
                    d.rectangle(box(wx, wy, wx + 16, wy + 22), fill=(236, 196, 140))

    # torre principal: pisos con balcones
    d.rectangle(box(560, 0, 1360, 820), fill=(218, 210, 198))
    luces = []
    for y in range(24, 600, 74):
        for col in range(6):
            x = 590 + col * 128
            encendida = rng.random() < 0.55
            d.rectangle(box(x, y, x + 100, y + 54), fill=CALIDA if encendida else (78, 88, 108))
            d.line(P([(x + 50, y), (x + 50, y + 54)]), fill=(60, 58, 60), width=3 * S)
            if encendida:
                luces.append(("rect", (x, y, x + 100, y + 54)))
        d.rectangle(box(548, y + 54, 1372, y + 62), fill=(72, 70, 72))
        translucido(img, [(560, y + 34), (1360, y + 34), (1360, y + 54), (560, y + 54)], (190, 214, 220), 70)
    d.rectangle(box(560, 0, 590, 640), fill=(140, 94, 60))
    d.rectangle(box(1330, 0, 1360, 640), fill=(140, 94, 60))

    # planta baja: lobby y acceso al parking
    d.rectangle(box(560, 630, 1360, 820), fill=(44, 44, 48))
    d.rectangle(box(600, 672, 1120, 820), fill=CALIDA)
    for x in range(680, 1120, 80):
        d.line(P([(x, 672), (x, 820)]), fill=MARCO, width=4 * S)
    d.rectangle(box(660, 760, 760, 820), fill=(160, 114, 72))           # recepción
    d.rectangle(box(800, 700, 920, 820), fill=(255, 230, 186))          # puertas del lobby
    d.rectangle(box(800, 700, 920, 820), outline=MARCO, width=4 * S)
    d.line(P([(860, 700), (860, 820)]), fill=MARCO, width=3 * S)
    d.rectangle(box(740, 652, 980, 672), fill=(28, 28, 32))             # marquesina
    luces.append(("rect", (600, 672, 1120, 820)))
    rect_degradado(img, 1180, 700, 1340, 820, (20, 20, 24), (60, 60, 66))   # rampa al parking
    d.rectangle(box(1180, 700, 1340, 820), outline=(30, 30, 32), width=4 * S)
    for i in range(6):
        x = 1190 + i * 24
        d.rectangle(box(x, 746, x + 12, 754), fill=(226, 188, 70) if i % 2 == 0 else (240, 240, 236))

    # acera, caminos y jardineras
    rect_degradado(img, 0, 820, 1920, 1080, (150, 140, 126), (100, 92, 82))
    d.polygon(P([(800, 820), (920, 820), (980, 1080), (700, 1080)]), fill=(188, 176, 158))
    d.polygon(P([(1180, 820), (1340, 820), (1520, 1080), (1060, 1080)]), fill=(84, 84, 88))
    for cx, r in [(420, 110), (1530, 90), (300, 80)]:
        d.rectangle(box(cx - 10, 760, cx + 10, 860), fill=(46, 34, 26))
        d.ellipse(box(cx - r, 760 - r * 1.6, cx + r, 760 + r * 0.2), fill=(40, 58, 38))
    for x, y in [(700, 900), (1000, 900), (620, 1010)]:
        d.rectangle(box(x - 4, y - 50, x + 4, y), fill=(36, 36, 38))
        d.ellipse(box(x - 9, y - 62, x + 9, y - 44), fill=(255, 226, 170))
        luces.append(("ellipse", (x - 40, y - 94, x + 40, y - 14)))

    img = resplandor(img, luces, (140, 96, 40), 30)
    return finalizar(img)


def escena_parking():
    img, d = lienzo()
    atras = (560, 300, 1360, 700)
    vp = (960, 500)
    cuarto(img, d, atras, ((96, 98, 102), (120, 122, 126)), ((124, 126, 130), (100, 102, 106)),
           ((120, 122, 126), (96, 98, 102)), (136, 138, 142), ((92, 94, 98), (62, 64, 68)))
    # vigas del techo y tubos de luz
    luces = []
    for k in range(5):
        y = 300 - 300 * (k / 5)
        xa = 560 - (560 - 0) * (k / 5)
        xb = 1360 + (1920 - 1360) * (k / 5)
        d.line(P([(xa, y), (xb, y)]), fill=(80, 82, 86), width=10 * S)
        largo = 60 + k * 50
        d.rectangle(box(960 - largo, y + 16 + k * 6, 960 + largo, y + 24 + k * 8), fill=(240, 246, 250))
        luces.append(("rect", (960 - largo, y + 10, 960 + largo, y + 34 + k * 8)))
    # líneas de estacionamiento
    antes = img.copy()
    lineas_perspectiva(d, vp, 700, 1080, -1400, 3320, 12, (226, 200, 90), 3)
    solo_piso(img, atras, antes)
    d.polygon(P([(930, 700), (990, 700), (1010, 1080), (910, 1080)]), fill=(70, 72, 76))
    # columnas
    for x0, x1, y0, y1 in [(380, 440, 200, 860), (1480, 1540, 200, 860), (500, 530, 260, 760), (1390, 1420, 260, 760)]:
        d.rectangle(box(x0, y0, x1, y1), fill=(170, 172, 176))
        d.rectangle(box(x0, y1 - 90, x1, y1 - 60), fill=(226, 188, 70))
    # autos estacionados
    auto(d, 40, 940, 320, (150, 40, 44))
    auto(d, 1560, 940, 320, (40, 60, 96))
    auto(d, 580, 720, 150, (210, 210, 214))
    auto(d, 1190, 720, 150, (30, 30, 34))
    # ascensores al fondo
    for x in (800, 900, 1000):
        d.rectangle(box(x, 520, x + 80, 700), fill=(184, 188, 192))
        d.line(P([(x + 40, 520), (x + 40, 700)]), fill=(120, 124, 128), width=2 * S)
        d.rectangle(box(x + 30, 500, x + 50, 510), fill=(255, 220, 160))
        luces.append(("rect", (x + 20, 490, x + 60, 520)))
    d.rectangle(box(780, 480, 1100, 520), fill=(60, 62, 66))
    img = resplandor(img, luces, (90, 100, 110), 26)
    return finalizar(img)


def escena_living():
    img, d = lienzo()
    atras = (520, 240, 1400, 780)
    vp = (960, 510)
    cuarto(img, d, atras, ((238, 232, 222), (246, 241, 233)), (MADERA, MADERA_OSCURA),
           ((214, 204, 190), (196, 184, 168)), (232, 224, 212), ((210, 202, 190), (170, 160, 146)))
    for x in range(30, 520, 26):
        d.line(P([(x, 240 * x / 520), (x, 1080 - 300 * x / 520)]), fill=(128, 90, 58), width=3 * S)
    antes = img.copy()
    lineas_perspectiva(d, vp, 780, 1080, -600, 2520, 10, (190, 180, 166), 2)
    lineas_profundidad(d, vp, 780, 1080, 4, (190, 180, 166), 2)
    solo_piso(img, atras, antes)

    # ventanal al área recreativa
    rect_degradado(img, 600, 300, 1320, 640, *CIELO)
    d.rectangle(box(600, 600, 1320, 780), fill=(150, 108, 72))
    poligono_degradado(img, P([(700, 650), (1220, 650), (1290, 740), (630, 740)]), (84, 170, 186), (30, 106, 128))
    d.rectangle(box(600, 560, 1320, 600), fill=(206, 198, 186))
    for x, r in [(660, 50), (1270, 46)]:
        d.ellipse(box(x - r, 560 - r * 1.4, x + r, 560 + r * 0.2), fill=(52, 84, 56))
    d.rectangle(box(600, 300, 1320, 780), outline=MARCO, width=10 * S)
    for x in (780, 880, 1040, 1140):
        d.line(P([(x, 300), (x, 780)]), fill=MARCO, width=6 * S)
    d.rectangle(box(948, 520, 958, 600), fill=(210, 180, 120))
    d.rectangle(box(962, 520, 972, 600), fill=(210, 180, 120))

    # recepción a la derecha
    d.polygon(P([(1420, 700), (1700, 760), (1700, 900), (1420, 820)]), fill=MADERA_OSCURA)
    d.polygon(P([(1420, 690), (1700, 748), (1700, 762), (1420, 702)]), fill=(232, 228, 220))

    # sala de espera
    d.ellipse(box(520, 860, 1400, 1060), fill=(200, 190, 174))
    d.rectangle(box(640, 800, 1180, 920), fill=(214, 200, 178))
    d.rectangle(box(640, 770, 1180, 820), fill=(226, 214, 194))
    d.rectangle(box(380, 800, 560, 940), fill=(90, 104, 84))
    d.rectangle(box(380, 760, 560, 810), fill=(102, 118, 96))
    d.rectangle(box(1260, 820, 1440, 960), fill=(90, 104, 84))
    d.ellipse(box(760, 930, 1060, 990), fill=(80, 56, 38))
    maceta(d, 160, 900, 1.3)

    luces = []
    for x, y in [(760, 400), (960, 360), (1160, 400)]:
        colgante(d, luces, x, 120, y, 26)
    img = resplandor(img, luces, (110, 90, 50), 30)
    img = resplandor(img, [("rect", (600, 300, 1320, 600))], (60, 40, 20), 50)
    return finalizar(img)


def escena_amenidades():
    img = gradiente((W * S, H * S), CIELO[0], CIELO[1])
    d = ImageDraw.Draw(img)
    rng = np.random.default_rng(21)
    luces = []
    # fachada interior del edificio
    d.rectangle(box(0, 240, 1920, 700), fill=(206, 198, 186))
    for y in range(270, 520, 70):
        for x in range(40, 1900, 120):
            if 840 < x < 1080:
                continue
            encendida = rng.random() < 0.5
            d.rectangle(box(x, y, x + 80, y + 46), fill=CALIDA if encendida else (78, 88, 108))
    # acceso a la torre (objetivo de la transición)
    d.rectangle(box(860, 540, 1060, 700), fill=CALIDA)
    d.rectangle(box(860, 540, 1060, 700), outline=MARCO, width=6 * S)
    d.line(P([(960, 540), (960, 700)]), fill=MARCO, width=4 * S)
    d.rectangle(box(820, 516, 1100, 540), fill=(40, 40, 44))
    luces.append(("rect", (860, 540, 1060, 700)))
    # gimnasio de vidrio
    d.rectangle(box(1380, 430, 1860, 700), fill=(196, 222, 228))
    for x in (1480, 1600, 1720):
        d.line(P([(x, 430), (x, 700)]), fill=MARCO, width=4 * S)
        d.polygon(P([(x - 70, 680), (x - 10, 680), (x - 20, 640), (x - 60, 650)]), fill=(52, 54, 58))
    d.rectangle(box(1370, 412, 1870, 430), fill=(40, 40, 44))
    luces.append(("rect", (1380, 430, 1860, 700)))
    # deck y piscina
    rect_degradado(img, 0, 700, 1920, 1080, MADERA, MADERA_OSCURA)
    lineas_perspectiva(d, (960, 560), 700, 1080, -1200, 3120, 34, (126, 86, 54), 2)
    poligono_degradado(img, P([(240, 760), (1080, 760), (1220, 960), (80, 960)]), (84, 170, 186), (30, 106, 128))
    d.line(P([(240, 760), (1080, 760)]), fill=(226, 238, 236), width=4 * S)
    for y, x0, x1 in [(800, 360, 760), (840, 500, 980), (890, 300, 700), (930, 640, 1060)]:
        d.line(P([(x0, y), (x1, y)]), fill=(150, 214, 218), width=3 * S)
    # tumbonas y sombrilla
    for x in (1340, 1540, 1740):
        d.polygon(P([(x, 940), (x + 130, 940), (x + 150, 980), (x - 10, 980)]), fill=(236, 230, 218))
        d.polygon(P([(x + 100, 940), (x + 140, 940), (x + 176, 884), (x + 148, 880)]), fill=(236, 230, 218))
        d.rectangle(box(x, 980, x + 8, 1010), fill=(60, 58, 56))
        d.rectangle(box(x + 130, 980, x + 138, 1010), fill=(60, 58, 56))
    d.rectangle(box(1596, 760, 1604, 930), fill=(60, 58, 56))
    d.polygon(P([(1460, 790), (1600, 720), (1740, 790)]), fill=(232, 222, 200))
    # palmeras
    for x in (140, 1240):
        d.line(P([(x, 700), (x + 10, 420)]), fill=(96, 72, 50), width=12 * S)
        for dx, dy in [(-120, 40), (120, 40), (-90, -30), (100, -30), (0, -70)]:
            d.polygon(P([(x + 10, 420), (x + 10 + dx, 420 + dy), (x + 10 + dx * 0.6, 420 + dy + 24)]),
                      fill=(48, 84, 54))
    img = resplandor(img, luces, (130, 96, 50), 30)
    return finalizar(img)


def escena_apartamento():
    img, d = lienzo()
    atras = (800, 330, 1120, 700)
    vp = (960, 515)
    cuarto(img, d, atras, ((236, 232, 224), (246, 242, 236)), ((226, 218, 206), (206, 196, 182)),
           ((220, 212, 200), (200, 190, 176)), (246, 240, 230), (MADERA, MADERA_OSCURA))
    antes = img.copy()
    lineas_perspectiva(d, vp, 700, 1080, -400, 2320, 18, (128, 90, 58), 2)
    solo_piso(img, atras, antes)
    # cocina al fondo del pasillo
    d.rectangle(box(830, 380, 1090, 460), fill=(236, 232, 224))
    d.rectangle(box(830, 560, 1090, 700), fill=MADERA)
    d.rectangle(box(826, 552, 1094, 562), fill=(240, 238, 234))
    d.rectangle(box(830, 460, 1090, 552), fill=(214, 206, 194))
    d.rectangle(box(800, 330, 1120, 700), outline=MARCO, width=8 * S)
    luces = []
    colgante(d, luces, 960, 330, 470, 14)
    # luces del techo
    for y, r in [(90, 34), (200, 24), (280, 16)]:
        d.ellipse(box(960 - r, y - r * 0.35, 960 + r, y + r * 0.35), fill=(255, 246, 222))
        luces.append(("ellipse", (960 - r * 3, y - r, 960 + r * 3, y + r * 2)))
    # puerta de entrada abierta
    d.polygon(P([(0, 60), (170, 150), (170, 1000), (0, 1080)]), fill=(110, 76, 50))
    d.polygon(P([(130, 560), (150, 566), (150, 600), (130, 596)]), fill=(210, 180, 120))
    # consola, espejo y planta en la pared derecha
    d.polygon(P([(1330, 420), (1560, 360), (1560, 640), (1330, 650)]), fill=(196, 206, 210))
    d.polygon(P([(1330, 420), (1560, 360), (1560, 640), (1330, 650)]), outline=(170, 140, 96), width=6 * S)
    d.polygon(P([(1300, 720), (1600, 780), (1600, 800), (1300, 736)]), fill=MADERA_OSCURA)
    d.line(P([(1320, 736), (1320, 880)]), fill=(60, 50, 40), width=4 * S)
    d.line(P([(1580, 796), (1580, 980)]), fill=(60, 50, 40), width=4 * S)
    maceta(d, 1450, 690, 0.7)
    img = resplandor(img, luces, (90, 76, 50), 26)
    return finalizar(img)


def escena_cocina():
    img, d = lienzo()
    atras = (480, 260, 1440, 760)
    vp = (960, 520)
    cuarto(img, d, atras, ((236, 232, 224), (246, 242, 236)), ((222, 216, 206), (204, 196, 184)),
           ((216, 208, 196), (198, 188, 174)), (238, 232, 222), ((210, 206, 200), (176, 172, 166)))
    antes = img.copy()
    lineas_perspectiva(d, vp, 760, 1080, -800, 2720, 12, (192, 188, 182), 2)
    lineas_profundidad(d, vp, 760, 1080, 4, (192, 188, 182), 2)
    solo_piso(img, atras, antes)
    # gabinetes superiores, salpicadero y gabinetes bajos
    d.rectangle(box(520, 300, 1180, 430), fill=(240, 236, 228))
    for x in range(630, 1180, 110):
        d.line(P([(x, 300), (x, 430)]), fill=(214, 208, 198), width=2 * S)
    d.rectangle(box(520, 430, 1180, 560), fill=(200, 192, 180))
    for y in range(450, 560, 22):
        d.line(P([(520, y), (1180, y)]), fill=(214, 206, 194), width=1 * S)
    d.polygon(P([(780, 430), (920, 430), (900, 470), (800, 470)]), fill=(150, 150, 154))
    d.rectangle(box(520, 560, 1180, 700), fill=MADERA)
    for x in range(630, 1180, 110):
        d.line(P([(x, 566), (x, 700)]), fill=MADERA_OSCURA, width=2 * S)
    d.rectangle(box(510, 552, 1190, 568), fill=(244, 242, 238))
    d.rectangle(box(1180, 300, 1220, 700), fill=(196, 198, 200))
    # pasillo hacia el baño (objetivo de la transición)
    rect_degradado(img, 1240, 380, 1420, 760, (232, 230, 226), (150, 152, 156))
    for y in range(400, 760, 40):
        d.line(P([(1240, y), (1420, y)]), fill=(214, 212, 208), width=1 * S)
    d.rectangle(box(1240, 380, 1420, 760), outline=(190, 180, 166), width=8 * S)
    # isla con banquetas
    d.polygon(P([(560, 760), (1360, 760), (1400, 800), (520, 800)]), fill=(246, 244, 240))
    d.rectangle(box(520, 800, 1400, 930), fill=MADERA_OSCURA)
    for x in (700, 960, 1220):
        d.line(P([(x - 30, 920), (x - 40, 1060)]), fill=(40, 40, 42), width=4 * S)
        d.line(P([(x + 30, 920), (x + 40, 1060)]), fill=(40, 40, 42), width=4 * S)
        d.ellipse(box(x - 60, 890, x + 60, 930), fill=(52, 54, 58))
    d.ellipse(box(900, 740, 1000, 776), fill=(214, 130, 70))
    luces = []
    for x in (720, 960, 1200):
        colgante(d, luces, x, 60, 600, 20)
    maceta(d, 600, 490, 0.5)
    img = resplandor(img, luces, (100, 86, 56), 28)
    return finalizar(img)


def escena_bano():
    img, d = lienzo()
    atras = (560, 280, 1360, 740)
    vp = (960, 510)
    cuarto(img, d, atras, ((236, 236, 234), (244, 244, 242)), ((228, 226, 222), (212, 210, 206)),
           ((224, 222, 218), (206, 204, 200)), (238, 236, 232), ((96, 98, 102), (60, 62, 66)))
    antes = img.copy()
    lineas_perspectiva(d, vp, 740, 1080, -900, 2820, 14, (116, 118, 124), 2)
    lineas_profundidad(d, vp, 740, 1080, 5, (116, 118, 124), 2)
    solo_piso(img, atras, antes)
    for y in range(320, 740, 40):
        d.line(P([(560, y), (1120, y)]), fill=(222, 220, 216), width=1 * S)
    for x in range(640, 1120, 80):
        d.line(P([(x, 280), (x, 740)]), fill=(222, 220, 216), width=1 * S)
    luces = []
    # espejo redondo y mueble flotante
    luces.append(("ellipse", (700, 310, 1000, 540)))
    d.ellipse(box(720, 330, 980, 520), fill=(196, 208, 212))
    d.ellipse(box(720, 330, 980, 520), outline=(190, 160, 110), width=6 * S)
    d.rectangle(box(630, 548, 1070, 566), fill=(246, 246, 244))
    d.rectangle(box(640, 566, 1060, 640), fill=MADERA)
    d.ellipse(box(800, 540, 900, 556), fill=(226, 228, 228))
    d.line(P([(850, 522), (850, 546)]), fill=(150, 150, 154), width=4 * S)
    # ducha con cancel de vidrio
    d.rectangle(box(1120, 280, 1360, 740), fill=(74, 78, 84))
    for y in range(300, 740, 46):
        d.line(P([(1120, y), (1360, y)]), fill=(88, 92, 98), width=2 * S)
    d.line(P([(1240, 320), (1240, 360)]), fill=(180, 180, 184), width=4 * S)
    d.ellipse(box(1210, 356, 1270, 372), fill=(190, 190, 194))
    translucido(img, [(1100, 250), (1460, 200), (1460, 1000), (1100, 900)], (210, 230, 236), 60)
    d.line(P([(1100, 250), (1100, 900)]), fill=(150, 150, 154), width=4 * S)
    # puerta hacia la sala (objetivo de la transición)
    poligono_degradado(img, P([(150, 306), (360, 356), (360, 840), (150, 980)]), (232, 204, 164), (156, 116, 78))
    d.polygon(P([(190, 640), (330, 664), (330, 800), (190, 860)]), fill=(70, 86, 102))
    d.polygon(P([(150, 306), (360, 356), (360, 840), (150, 980)]), outline=(200, 190, 176), width=8 * S)
    luces.append(("ellipse", (160, 420, 360, 760)))
    # toallero y planta
    d.rectangle(box(1480, 500, 1500, 760), fill=(244, 240, 232))
    maceta(d, 520, 900, 0.8)
    img = resplandor(img, luces, (100, 90, 70), 34)
    return finalizar(img)


def escena_sala():
    img, d = lienzo()
    atras = (480, 260, 1440, 760)
    vp = (960, 520)
    cuarto(img, d, atras, ((232, 226, 216), (246, 241, 233)), ((214, 204, 190), (200, 188, 172)),
           ((206, 196, 182), (190, 178, 162)), (236, 229, 218), (MADERA, MADERA_OSCURA))
    antes = img.copy()
    lineas_perspectiva(d, vp, 760, 1080, -420, 2340, 22, (128, 90, 58), 2)
    solo_piso(img, atras, antes)
    luces = []
    for x, y in [(620, 120), (960, 120), (1300, 120), (760, 210), (1160, 210)]:
        d.ellipse(box(x - 26, y - 9, x + 26, y + 9), fill=(255, 246, 222))
        luces.append(("ellipse", (x - 70, y - 30, x + 70, y + 40)))
    # puertas corredizas a la terraza con vista a la ciudad
    ciudad(img, d, 580, 300, 1340, 760, 5)
    translucido(img, [(580, 650), (1340, 650), (1340, 760), (580, 760)], (190, 214, 220), 80)
    d.line(P([(580, 650), (1340, 650)]), fill=(200, 200, 204), width=4 * S)
    d.rectangle(box(580, 300, 1340, 760), outline=MARCO, width=10 * S)
    for x in (770, 960, 1150):
        d.line(P([(x, 300), (x, 760)]), fill=MARCO, width=6 * S)
    # cortinas
    d.rectangle(box(500, 280, 570, 760), fill=(232, 222, 204))
    d.rectangle(box(1350, 280, 1420, 760), fill=(232, 222, 204))
    # sofá, sillón, mesa y alfombra
    d.polygon(P([(500, 880), (1420, 880), (1560, 1020), (360, 1020)]), fill=(214, 206, 192))
    d.rectangle(box(560, 780, 1240, 880), fill=(196, 186, 172))
    d.rectangle(box(560, 750, 1240, 800), fill=(208, 198, 184))
    d.rectangle(box(1300, 800, 1460, 910), fill=(170, 100, 70))
    d.rectangle(box(1300, 770, 1460, 812), fill=(184, 112, 80))
    d.rectangle(box(760, 920, 1160, 950), fill=(80, 56, 38))
    d.ellipse(box(900, 896, 960, 924), fill=(230, 224, 214))
    # lámpara de pie y planta
    d.rectangle(box(296, 520, 304, 900), fill=(40, 40, 42))
    d.ellipse(box(250, 890, 350, 912), fill=(40, 40, 42))
    d.polygon(P([(250, 520), (350, 520), (330, 450), (270, 450)]), fill=(246, 230, 196))
    luces.append(("ellipse", (180, 400, 420, 620)))
    maceta(d, 1640, 920, 1.0)
    img = resplandor(img, luces, (90, 76, 50), 30)
    img = resplandor(img, [("ellipse", (1060, 560, 1260, 660))], (110, 76, 40), 50)
    return finalizar(img)


def escena_terraza():
    img, d = lienzo()
    ciudad(img, d, 0, 0, 1920, 800, 9)
    img = resplandor(img, [("ellipse", (1180, 380, 1420, 540))], (255, 190, 110), 60)
    d = ImageDraw.Draw(img)
    d.ellipse(box(1270, 430, 1330, 490), fill=(255, 226, 170))
    ciudad_frente = np.random.default_rng(4)
    for _ in range(4):
        x = ciudad_frente.uniform(300, 1700)
        d.rectangle(box(x, 520, x + 90, 800), fill=(46, 48, 64))
    # losa superior con luces
    d.rectangle(box(0, 0, 1920, 60), fill=(62, 60, 60))
    luces = []
    for x in range(300, 1900, 240):
        d.ellipse(box(x - 14, 52, x + 14, 64), fill=(255, 236, 196))
        luces.append(("ellipse", (x - 50, 40, x + 50, 120)))
    # pared del apartamento con la puerta corrediza
    d.polygon(P([(0, 0), (260, 60), (260, 820), (0, 1080)]), fill=(190, 182, 170))
    poligono_degradado(img, P([(60, 160), (220, 190), (220, 800), (60, 900)]), (255, 220, 170), (200, 150, 100))
    d.polygon(P([(60, 160), (220, 190), (220, 800), (60, 900)]), outline=MARCO, width=6 * S)
    # piso y baranda de vidrio
    poligono_degradado(img, P([(260, 800), (1920, 800), (1920, 1080), (0, 1080)]), (176, 166, 152), (130, 120, 108))
    lineas_perspectiva(d, (960, 560), 800, 1080, -900, 2820, 24, (150, 140, 128), 2)
    translucido(img, [(260, 610), (1920, 610), (1920, 800), (260, 800)], (200, 220, 226), 70)
    d.line(P([(260, 610), (1920, 610)]), fill=(206, 206, 210), width=5 * S)
    # sofá exterior, mesa y sillas
    d.rectangle(box(340, 840, 860, 950), fill=(226, 220, 208))
    d.rectangle(box(340, 800, 860, 850), fill=(236, 230, 220))
    for x, c in [(380, (201, 163, 106)), (720, (70, 120, 130))]:
        d.rectangle(box(x, 790, x + 100, 850), fill=c)
    d.rectangle(box(520, 960, 800, 990), fill=(90, 66, 46))
    d.ellipse(box(1360, 850, 1560, 880), fill=(236, 232, 224))
    d.rectangle(box(1454, 870, 1466, 990), fill=(60, 58, 56))
    for x in (1300, 1580):
        d.rectangle(box(x, 860, x + 60, 900), fill=(60, 58, 56))
        d.rectangle(box(x, 900, x + 60, 912), fill=(226, 220, 208))
        d.line(P([(x + 6, 912), (x + 6, 990)]), fill=(60, 58, 56), width=3 * S)
        d.line(P([(x + 54, 912), (x + 54, 990)]), fill=(60, 58, 56), width=3 * S)
    maceta(d, 1820, 920, 1.2)
    luces.append(("ellipse", (40, 300, 260, 800)))
    img = resplandor(img, luces, (110, 84, 50), 30)
    return finalizar(img)


# ---------------------------------------------------------------- clips

def camara(img, zoom, cx, cy):
    """Recorta una vista con zoom subpixel suave (sin saltos de enteros)."""
    mitad_w = W / (2 * zoom)
    mitad_h = H / (2 * zoom)
    cx = min(max(cx, mitad_w), W - mitad_w)
    cy = min(max(cy, mitad_h), H - mitad_h)
    a = (W / OUT_W) / zoom
    return img.transform((OUT_W, OUT_H), Image.AFFINE,
                         (a, 0, cx - mitad_w, 0, a, cy - mitad_h), resample=Image.BICUBIC)


def lerp(a, b, t):
    return a + (b - a) * t


def ease_in_out(t):
    return 0.5 - 0.5 * math.cos(math.pi * min(max(t, 0), 1))


def clip(origen, destino, objetivo, zoom_max, salida, segundos=4):
    """Acercamiento hacia `objetivo` en la escena origen y fundido a la escena destino."""
    n = int(segundos * FPS)
    ox, oy = objetivo
    proc = subprocess.Popen([
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{OUT_W}x{OUT_H}", "-r", str(FPS), "-i", "-",
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
        "-g", "6", "-keyint_min", "6", "-sc_threshold", "0",
        "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709",
        "-color_trc", "bt709", "-movflags", "+faststart", str(salida),
    ], stdin=subprocess.PIPE)

    for i in range(n):
        t = i / (n - 1)
        u = ease_in_out(t / 0.72)
        vista_a = camara(origen, lerp(1, zoom_max, u), lerp(W / 2, ox, u), lerp(H / 2, oy, u))
        alpha = ease_in_out((t - 0.42) / 0.3)
        if alpha <= 0:
            frame = np.asarray(vista_a, dtype=np.float32)
        else:
            v = ease_in_out((t - 0.42) / 0.58)
            vista_b = camara(destino, lerp(1.35, 1, v), W / 2, lerp(H / 2 + 30, H / 2, v))
            frame = (np.asarray(vista_a, dtype=np.float32) * (1 - alpha)
                     + np.asarray(vista_b, dtype=np.float32) * alpha)
        proc.stdin.write(frame.round().astype(np.uint8).tobytes())

    proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError(f"ffmpeg falló al crear {salida}")


# Orden del recorrido: (nombre, función de la escena, punto al que se acerca la cámara, zoom).
RECORRIDO = [
    ("entrada", escena_entrada, (1260, 760), 2.6),
    ("parking", escena_parking, (960, 590), 2.6),
    ("living", escena_living, (960, 560), 2.4),
    ("amenidades", escena_amenidades, (960, 630), 2.6),
    ("apartamento", escena_apartamento, (960, 515), 3.0),
    ("cocina", escena_cocina, (1330, 570), 2.6),
    ("bano", escena_bano, (255, 640), 2.4),
    ("sala", escena_sala, (960, 500), 2.4),
    ("terraza", escena_terraza, None, None),
]


def main():
    DIR_IMG.mkdir(parents=True, exist_ok=True)
    DIR_VIDEO.mkdir(parents=True, exist_ok=True)

    escenas = []
    for i, (nombre, dibujar, _, _) in enumerate(RECORRIDO, start=1):
        img = dibujar()
        img.resize((OUT_W, OUT_H), Image.LANCZOS).save(DIR_IMG / f"escena-{i}-{nombre}.webp", quality=90)
        escenas.append(img)
        print("póster", i, nombre)

    for i in range(len(RECORRIDO) - 1):
        nombre, _, objetivo, zoom = RECORRIDO[i]
        siguiente = RECORRIDO[i + 1][0]
        clip(escenas[i], escenas[i + 1], objetivo, zoom, DIR_VIDEO / f"clip-{i + 1}-{nombre}-{siguiente}.mp4")
        print("clip", i + 1, nombre, "->", siguiente)


if __name__ == "__main__":
    main()
