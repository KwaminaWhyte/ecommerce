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

# Change the working directory to the project directory
project_directory = os.path.abspath("c:/Users/HP/Desktop/ecommerce/")
os.chdir(project_directory)

# Command to run the Node.js app
command = "npm run dev"

try:
    # Run the command using subprocess
    subprocess.run(command, shell=True, check=True)
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
except KeyboardInterrupt:
    print("Process interrupted by user.")
finally:
    print("Script execution completed.")


# pip install pyinstaller
# pyinstaller --onefile run_node_app.py
