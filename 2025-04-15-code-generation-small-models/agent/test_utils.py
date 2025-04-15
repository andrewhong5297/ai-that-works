from utils import load_files, walk_directory

def test_load_files():
    # Test loading specific files
    files = load_files(['hello.py', 'utils.py'])
    assert len(files) >= 2
    assert 'hello.py' in files
    assert 'utils.py' in files
    
def test_walk_directory():
    # Test walking the current directory
    files = walk_directory('.')
    assert len(files) >= 2
    assert any('hello.py' in path for path in files.keys())
    assert any('utils.py' in path for path in files.keys())

if __name__ == '__main__':
    test_load_files()
    test_walk_directory()
    print("All tests passed!")