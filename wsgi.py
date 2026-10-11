import os
import sys

# Ensure the backend directory is in the Python search path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from wsgi import app

if __name__ == "__main__":
    app.run()
