import os
import shutil

# Supported image extensions
IMAGE_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".webp",
    ".bmp", ".gif", ".tiff", ".svg"
}

def is_image(file_name):
    return os.path.splitext(file_name)[1].lower() in IMAGE_EXTENSIONS


def get_unique_path(dest_path):
    """
    If file exists, rename it: image.jpg -> image_1.jpg, image_2.jpg, etc.
    """
    base, ext = os.path.splitext(dest_path)
    counter = 1

    new_path = dest_path
    while os.path.exists(new_path):
        new_path = f"{base}_{counter}{ext}"
        counter += 1

    return new_path


def copy_images_recursive(src_dir, dst_dir):
    if not os.path.exists(src_dir):
        print("❌ Source directory does not exist")
        return

    os.makedirs(dst_dir, exist_ok=True)

    total = 0

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if is_image(file):
                src_path = os.path.join(root, file)
                dst_path = os.path.join(dst_dir, file)

                # Avoid overwrite
                dst_path = get_unique_path(dst_path)

                try:
                    shutil.copy2(src_path, dst_path)
                    print(f"[+] Copied: {src_path} -> {dst_path}")
                    total += 1
                except Exception as e:
                    print(f"[!] Failed: {src_path} ({e})")

    print(f"\n✅ Done. Total images copied: {total}")


if __name__ == "__main__":
    src = input("Enter source directory: ").strip()
    dst = input("Enter destination directory: ").strip()

    copy_images_recursive(src, dst)