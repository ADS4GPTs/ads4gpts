from setuptools import setup, find_packages

setup(
    name="ads4gpts-langchain",
    version="0.1.0",
    author="Ioannis Bakagiannis",
    author_email="giannis.bakagiannis@gmail.com",
    description="Ads for GPTs Langchain Toolkit",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/knitly/Ads4GPTs/libs/python-sdk/langchain-toolkit",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.11",
    install_requires=[
        "langchain",
        "langgraph",
        "httpx",
        "pydantic",
    ],
)
