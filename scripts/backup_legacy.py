import os
import shutil
import hashlib
import json
from datetime import datetime

def hash_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def run_backup():
    src_dir = r"C:\Users\gorav singh\Documents\linux world traning\SBLMS"
    dst_dir = r"c:\Users\gorav singh\Documents\webbuild\backups\legacy_backup_20261010"
    os.makedirs(dst_dir, exist_ok=True)

    manifest = {
        "timestamp": datetime.now().isoformat(),
        "source": src_dir,
        "destination": dst_dir,
        "files": {}
    }

    # 1. Backup library.db
    db_src = os.path.join(src_dir, "library.db")
    db_dst = os.path.join(dst_dir, "library.db")
    if os.path.exists(db_src):
        shutil.copy2(db_src, db_dst)
        manifest["files"]["library.db"] = {
            "size": os.path.getsize(db_dst),
            "sha256": hash_file(db_dst)
        }
        print(f"Backed up library.db ({os.path.getsize(db_dst)} bytes)")

    # 2. Backup static uploads (photos, aadhaar)
    uploads_src = os.path.join(src_dir, "static", "uploads")
    uploads_dst = os.path.join(dst_dir, "uploads")
    if os.path.exists(uploads_src):
        shutil.copytree(uploads_src, uploads_dst, dirs_exist_ok=True)
        count = 0
        for root, _, files in os.walk(uploads_dst):
            for f in files:
                count += 1
                fp = os.path.join(root, f)
                rel = os.path.relpath(fp, dst_dir)
                manifest["files"][rel] = {
                    "size": os.path.getsize(fp),
                    "sha256": hash_file(fp)
                }
        print(f"Backed up {count} uploaded student documents.")

    # 3. Backup static images (logo, banner)
    images_src = os.path.join(src_dir, "static", "images")
    images_dst = os.path.join(dst_dir, "images")
    if os.path.exists(images_src):
        shutil.copytree(images_src, images_dst, dirs_exist_ok=True)
        for root, _, files in os.walk(images_dst):
            for f in files:
                fp = os.path.join(root, f)
                rel = os.path.relpath(fp, dst_dir)
                manifest["files"][rel] = {
                    "size": os.path.getsize(fp),
                    "sha256": hash_file(fp)
                }

    manifest_path = os.path.join(dst_dir, "backup_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Backup manifest created at {manifest_path}")
    print(f"Total files backed up: {len(manifest['files'])}")
    return manifest

if __name__ == "__main__":
    run_backup()
