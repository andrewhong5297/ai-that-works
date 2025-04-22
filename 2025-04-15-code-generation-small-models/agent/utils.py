import os
from pathlib import Path
from typing import Dict, List, Set, Union

# Common patterns to ignore
DEFAULT_IGNORE_PATTERNS = {
    'node_modules',
    'venv',
    '.venv',
    '__pycache__',
    '.git',
    '.idea',
    '.vscode',
    'dist',
    'build',
    '.pytest_cache',
}

def load_files(file_paths: List[str]) -> Dict[str, str]:
    """
    Load multiple files and return their contents as a dictionary.
    
    Args:
        file_paths: List of file paths to read
        
    Returns:
        Dictionary mapping file paths to their contents
    """
    result = {}
    for path in file_paths:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                result[path] = f.read()
        except Exception as e:
            print(f"Error reading file {path}: {e}")
    return result

def walk_directory(
    directory: Union[str, Path],
    ignore_patterns: Set[str] = DEFAULT_IGNORE_PATTERNS
) -> Dict[str, str]:
    """
    Walk a directory tree and return all file contents as a dictionary.
    
    Args:
        directory: Root directory to start walking from
        ignore_patterns: Set of directory/file patterns to ignore
        
    Returns:
        Dictionary mapping file paths to their contents
    """
    if isinstance(directory, str):
        directory = Path(directory)
        
    result = {}
    
    for root, dirs, files in os.walk(directory):
        # Remove ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_patterns]
        
        for file in files:
            file_path = Path(root) / file
            
            # Skip files in ignored directories
            if any(pattern in str(file_path) for pattern in ignore_patterns):
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    result[str(file_path)] = f.read()
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")
                
    return result