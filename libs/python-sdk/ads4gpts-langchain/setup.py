import toml
from setuptools import setup, find_packages

# Load the pyproject.toml file
with open("pyproject.toml", "r") as pyproject_file:
    pyproject_data = toml.load(pyproject_file)

# Extract project metadata
tool_poetry = pyproject_data.get("tool", {}).get("poetry", {})
name = tool_poetry.get("name", "default_name")
version = tool_poetry.get("version", "0.0.1")
description = tool_poetry.get("description", "")
authors = tool_poetry.get("authors", [])
license = tool_poetry.get("license", "")
readme = tool_poetry.get("readme", "")
homepage = tool_poetry.get("homepage", "")
repository = tool_poetry.get("repository", "")
documentation = tool_poetry.get("documentation", "")
keywords = tool_poetry.get("keywords", [])
classifiers = tool_poetry.get("classifiers", [])
dependencies = tool_poetry.get("dependencies", {})

# Process authors
author_list = [author.split(" <")[0] for author in authors]
author_email_list = [
    author.split(" <")[1].rstrip(">") if " <" in author else "" for author in authors
]

# Process dependencies
install_requires = [
    f"{pkg}{ver if ver != '*' else ''}"
    for pkg, ver in dependencies.items()
    if pkg != "python"
]

setup(
    name=name,
    version=version,
    description=description,
    author=", ".join(author_list),
    author_email=", ".join(author_email_list),
    license=license,
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
    python_requires=dependencies.get("python", ""),
)
