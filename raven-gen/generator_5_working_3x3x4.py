from raven_gen import Matrix, MatrixType, Ruleset, RuleType
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import random
import os
import json
# ===== CONFIGURATION =====

NUM_SETS = 12  # Number of sets of puzzles to generate
# Sets 1-2 get 40 puzzles; sets 3-12 get 20 puzzles.

# Output directory (relative to this script's location)
# Resolves to: <repo_root>/_static/puzzles/Set{N}/
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_BASE = os.path.join(SCRIPT_DIR, "..", "_static", "puzzles")

# Setup
Matrix.oblique_angle_rotations(allowed=False)

# ===== 2x2 MATRIX WITH 4 SHAPES PER CELL =====

# Simple version: 4 shapes per cell, only number stays constant
simple_2x2_matrix_types = [
    MatrixType.FOUR_SHAPE,  # Each cell has 4 shapes in a 2x2 arrangement
]
simple_2x2_ruleset = Ruleset(
    number_rules=[RuleType.CONSTANT],  # Number of shapes stays constant
    size_rules=[RuleType.CONSTANT],    # Size stays constant (easier)
    color_rules=[RuleType.CONSTANT],   # Color stays constant (easier)
)

SHAPE_COLOR = (70, 130, 180)  # Steel blue

def colorize_image(img, shape_color=SHAPE_COLOR):
    """Recolor grayscale shapes to a target color, preserving intensity."""
    data = np.array(img.convert('RGB')).astype(float)
    intensity = 1.0 - data[:, :, 0] / 255.0  # 0=white bg, 1=black shape
    out = np.ones_like(data) * 255.0
    for c, ch in enumerate(shape_color):
        out[:, :, c] = 255.0 * (1.0 - intensity) + float(ch) * intensity
    return Image.fromarray(out.astype(np.uint8))


def _answers_are_distinct(imgs, min_distinct_fraction=0.08):
    """
    True if every pair of answer tiles differs on at least min_distinct_fraction
    of pixels (threshold: >30 gray levels). Catches near-identical alternatives.
    """
    arrays = [np.array(img.convert('L')).astype(np.int16) for img in imgs]
    for i in range(len(arrays)):
        for j in range(i + 1, len(arrays)):
            if np.mean(np.abs(arrays[i] - arrays[j]) > 30) < min_distinct_fraction:
                return False
    return True


def create_puzzle_and_answers(matrix_id, temp_dir="temp_matrices", output_dir="puzzles_3x3x4"):
    matrix_types = simple_2x2_matrix_types
    ruleset = simple_2x2_ruleset
    n_alternatives = 3

    os.makedirs(temp_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)

    # Retry until all 4 answer options are visually distinct from each other.
    for _ in range(50):
        matrix_type = np.random.choice(matrix_types)
        rpm = Matrix.make(matrix_type, ruleset=ruleset, n_alternatives=n_alternatives)
        rpm.save(temp_dir, f"temp_{matrix_id:03d}")

        answer_path = os.path.join(temp_dir, f"temp_{matrix_id:03d}_answer.png")
        img = Image.open(answer_path)
        width, height = img.size
        cell_width = width // 2

        correct_answer_img = img.crop((323, 323, 479, 479))
        incorrect_answers = []
        for i in range(n_alternatives):
            alt_path = os.path.join(temp_dir, f"temp_{matrix_id:03d}_alternative_{i}.png")
            alt_img = Image.open(alt_path)
            incorrect_answers.append(alt_img.crop((323, 323, 479, 479)))

        if _answers_are_distinct([correct_answer_img] + incorrect_answers):
            break

    all_answers = [(correct_answer_img, True)] + [(a, False) for a in incorrect_answers]
    random.shuffle(all_answers)
    correct_index = next(i for i, (_, ok) in enumerate(all_answers) if ok)
    labels = ['A', 'B', 'C', 'D']
    correct_letter = labels[correct_index]

    # ===== CREATE PUZZLE IMAGE =====
    puzzle = img.copy()
    draw = ImageDraw.Draw(puzzle)
    draw.rectangle([(323, 323), (479, 479)], fill='white')

    try:
        font_large = ImageFont.truetype("arial.ttf", size=cell_width // 4)
    except Exception:
        font_large = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), "?", font=font_large)
    text_x = 323 + (156 - (bbox[2] - bbox[0])) // 2
    text_y = 323 + (156 - (bbox[3] - bbox[1])) // 2
    draw.text((text_x, text_y), "?", fill='black', font=font_large)

    puzzle_path = os.path.join(output_dir, f"puzzle_{matrix_id:03d}.png")
    colorize_image(puzzle).save(puzzle_path)

    # ===== CREATE INDIVIDUAL ANSWER IMAGES =====
    answer_files = []
    for (answer_img, is_correct), label in zip(all_answers, labels):
        correctness = 'T' if is_correct else 'F'
        answer_filename = f"answers_{matrix_id:03d}{label}_{correctness}.png"
        colorize_image(answer_img).save(os.path.join(output_dir, answer_filename))
        answer_files.append(answer_filename)

    return {
        'puzzle_id': matrix_id,
        'matrix_size': '2x2',
        'shapes_per_cell': 4,
        'matrix_type': str(matrix_type),
        'correct_answer': correct_letter,
        'num_options': 4,
        'rules': str(rpm.rules),
        'puzzle_file': f"puzzle_{matrix_id:03d}.png",
        'answer_files': answer_files
    }


def create_merged_image(puzzle_path, answer_paths, correct_letter, output_path):
    """
    Puzzle image on top; 4 answer tiles in a row below.
    Correct tile gets a green border and a '✓' label.
    """
    GAP = 12
    BORDER = 4
    LABEL_HEIGHT = 22
    GREEN = (34, 197, 94)
    GRAY = (80, 80, 80)

    puzzle_img = Image.open(puzzle_path)
    pw, ph = puzzle_img.size
    tile_w = pw // 4

    labels = ['A', 'B', 'C', 'D']
    answer_imgs = [Image.open(p).resize((tile_w, tile_w), Image.LANCZOS) for p in answer_paths]

    total_h = ph + GAP + tile_w + LABEL_HEIGHT
    merged = Image.new('RGB', (pw, total_h), (255, 255, 255))
    merged.paste(puzzle_img, (0, 0))

    draw = ImageDraw.Draw(merged)
    try:
        font = ImageFont.truetype("arial.ttf", 13)
    except Exception:
        font = ImageFont.load_default()

    for i, (label, tile) in enumerate(zip(labels, answer_imgs)):
        x, y = i * tile_w, ph + GAP
        merged.paste(tile, (x, y))
        is_correct = label == correct_letter
        if is_correct:
            draw.rectangle([(x, y), (x + tile_w - 1, y + tile_w - 1)], outline=GREEN, width=BORDER)
        label_text = f"{label} ✓" if is_correct else label
        color = GREEN if is_correct else GRAY
        bbox = draw.textbbox((0, 0), label_text, font=font)
        tw = bbox[2] - bbox[0]
        draw.text((x + (tile_w - tw) // 2, y + tile_w + 3), label_text, fill=color, font=font)

    merged.save(output_path)


def build_answer_key_js(puzzle_info: list) -> str:
    """Build a JS file containing const PUZZLES = [...] for a set."""
    labels = ['A', 'B', 'C', 'D']
    lines = ["const PUZZLES = ["]
    for rec in puzzle_info:
        pid = rec["puzzle_id"]
        correct = rec["correct_answer"]
        n = rec.get("num_options", 4)
        puzzle_file = f"puzzle_{pid:03d}.png"
        answer_files = []
        for label in labels[:n]:
            suffix = "T" if label == correct else "F"
            answer_files.append(f"answers_{pid:03d}{label}_{suffix}.png")
        answers_js = ", ".join(f"'{f}'" for f in answer_files)
        lines.append(
            f"    {{ puzzle: '{puzzle_file}', answers: [{answers_js}], correct: '{correct}' }},"
        )
    lines[-1] = lines[-1].rstrip(",")
    lines.append("];")
    return "\n".join(lines) + "\n"


# Generate multiple sets of puzzles
if __name__ == "__main__":
    import shutil

    temp_dir = os.path.join(SCRIPT_DIR, "temp_matrices")

    for set_num in range(1, NUM_SETS + 1):
        puzzles_this_set = 40 if set_num <= 2 else 20
        set_dir = os.path.join(OUTPUT_BASE, f"Set{set_num}")
        inspection_dir = os.path.join(OUTPUT_BASE, "inspection", f"Set{set_num}")
        os.makedirs(set_dir, exist_ok=True)
        os.makedirs(inspection_dir, exist_ok=True)

        puzzle_info = []

        for puzzle_id in range(puzzles_this_set):
            info = create_puzzle_and_answers(puzzle_id, temp_dir=temp_dir, output_dir=set_dir)
            puzzle_info.append(info)

            puzzle_path = os.path.join(set_dir, info['puzzle_file'])
            answer_paths = [os.path.join(set_dir, f) for f in info['answer_files']]
            merged_path = os.path.join(inspection_dir, f"merged_puzzle_{puzzle_id:03d}.png")
            create_merged_image(puzzle_path, answer_paths, info['correct_answer'], merged_path)

        # Save JSON answer key
        json_path = os.path.join(set_dir, "answer_key.json")
        with open(json_path, 'w') as f:
            json.dump(puzzle_info, f, indent=2)

        # Save JS answer key (const PUZZLES = [...])
        js_path = os.path.join(set_dir, "answer_key.js")
        with open(js_path, 'w') as f:
            f.write(build_answer_key_js(puzzle_info))

        #print(f"  Saved answer_key.json and answer_key.js → {set_dir}")

    # Clean up temporary files
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)

    #print(f"\nDone. Generated {NUM_SETS} sets of {PUZZLES_PER_SET} puzzles each.")
    #print(f"Output: {OUTPUT_BASE}/Set1 ... Set{NUM_SETS}")