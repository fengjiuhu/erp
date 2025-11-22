"""
Lightweight thread pool runtime helpers to fan-out high-level business tasks
and minimize per-request overhead. Designed for demo stubs of the enterprise
platform.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Callable, Iterable, Any, Dict

DEFAULT_WORKERS = 8


def run_concurrent(tasks: Iterable[Callable[[], Any]], max_workers: int = DEFAULT_WORKERS) -> Dict[int, Any]:
    """
    Execute callables concurrently and return a mapping of index -> result.
    Keeps memory usage low by using a bounded worker pool.
    """
    results: Dict[int, Any] = {}
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_map = {executor.submit(task): idx for idx, task in enumerate(tasks)}
        for future in as_completed(future_map):
            idx = future_map[future]
            results[idx] = future.result()
    return results


__all__ = ["run_concurrent", "DEFAULT_WORKERS"]
