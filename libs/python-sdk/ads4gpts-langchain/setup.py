import toml
from setuptools import setup, find_packages

# Load the pyproject.toml file
with open("./pyproject.toml", "r") as pyproject_file:
    pyproject_data = toml.load(pyproject_file)

# Extract project metadata
tool_poetry = pyproject_data.get("tool", {}).get("poetry", {})
print(tool_poetry)
name = tool_poetry.get("name", "default_name")
version = tool_poetry.get("version", "0.0.1")
description = tool_poetry.get("description", "")
authors = tool_poetry.get("authors", [])
license_name = tool_poetry.get("license", "")
readme = tool_poetry.get("readme", "")
homepage = tool_poetry.get("homepage", "")
repository = tool_poetry.get("repository", "")
documentation = tool_poetry.get("documentation", "")
keywords = tool_poetry.get("keywords", [])
classifiers = tool_poetry.get("classifiers", [])
dependencies = tool_poetry.get("dependencies", {})


# Process dependencies
install_requires = [
    f"{pkg}{ver if ver != '*' else ''}"
    for pkg, ver in dependencies.items()
    if pkg != "python"
]

# Adjust version specifiers to comply with PEP 440
install_requires = [
    dep.replace("^", ">=") if "^" in dep else dep for dep in install_requires
]

# Process python_requires
python_version = dependencies.get("python", "")
if python_version.startswith("^"):
    base_version = python_version[1:]
    major, minor = base_version.split(".")
    python_requires = f">={base_version},<{int(major) + 1}.0"
else:
    python_requires = python_version

setup(
    name=name,
    version=version,
    description=description,
    author=", ".join(authors),
    license=license_name,
    long_description=open(readme).read() if readme else "",
    long_description_content_type="text/markdown",
    url=homepage,
    project_urls={
        "Documentation": documentation,
        "Source": repository,
    },
    classifiers=classifiers,
    keywords=keywords,
    packages=find_packages(where="."),
    install_requires=install_requires,
    python_requires=python_requires,
)
