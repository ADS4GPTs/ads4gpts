from typing import List, Dict, Any, Union, Optional
import os


def get_from_env(key: str, env_key: str, default: Optional[str] = None) -> str:
    """Retrieve a value from an environment variable."""
    value = os.getenv(env_key)
    if value:
        return value
    elif default is not None:
        return default
    else:
        raise ValueError(
            f"'{key}' not found. Please set the '{env_key}' environment variable or provide '{key}' as a parameter."
        )


def get_from_dict_or_env(
    data: Dict[str, Any],
    key: Union[str, List[str]],
    env_key: str,
    default: Optional[str] = None,
) -> str:
    """Retrieve a value from a dictionary or environment variable."""
    if isinstance(key, (list, tuple)):
        for k in key:
            if data.get(k):
                return data[k]
    elif data.get(key):
        return data[key]

    return get_from_env(key, env_key, default)
