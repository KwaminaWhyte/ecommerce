# #!/usr/bin/env python3
# import subprocess


# def run_react_app():
#     try:
#         # Change the path to your React app directory
#         react_app_path = '/'

#         # Navigate to the React app directory
#         subprocess.run(['cd', react_app_path], check=True)

#         # Install dependencies (optional, if not already installed)
#         # subprocess.run(['npm', 'install'], check=True)

#         # Run the React app
#         subprocess.run(['npm', 'run', 'dev'], check=True)

#     except subprocess.CalledProcessError as e:
#         print(f"Error: {e}")


# if __name__ == "__main__":
#     run_react_app()

import subprocess
import os

# Set the path to the Node.js app directory
project_directory = os.path.join(
    os.path.expanduser('~'), 'Desktop', 'ecommerce')

# Change the current working directory to the Node.js app directory
os.chdir(project_directory)

# Command to install dependencies (if needed)
subprocess.run(['npm', 'install'], check=True)

# Command to start the Node.js app
subprocess.run(['npm', 'start'], check=True)


# pip install pyinstaller
# pyinstaller --onefile run_node_app.py
