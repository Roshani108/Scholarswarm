import random
import logging
from typing import Dict, Any, List

logger = logging.getLogger("scholarswarm.chaos")

class ChaosEngine:
    def __init__(self):
        self.enabled: bool = False
        self.failure_rate: float = 0.45 # 45% chance of fault when enabled
        self.total_faults_injected: int = 0
        self.total_recoveries: int = 0
        self.history: List[Dict[str, Any]] = []

    def set_enabled(self, enabled: bool):
        self.enabled = enabled
        logger.info(f"Chaos Mode is now: {'ENABLED' if enabled else 'DISABLED'}")

    def should_inject_fault(self, subsystem: str) -> bool:
        """Returns True if a chaos fault should be simulated."""
        if not self.enabled:
            return False
        inject = random.random() < self.failure_rate
        if inject:
            self.total_faults_injected += 1
            logger.warning(f"[CHAOS INJECTED] Simulating failure in subsystem '{subsystem}'")
        return inject

    def record_recovery(self, subsystem: str, recovery_strategy: str) -> str:
        self.total_recoveries += 1
        msg = f"Self-Healed: [{subsystem}] recovered via '{recovery_strategy}'"
        self.history.append({"subsystem": subsystem, "strategy": recovery_strategy})
        logger.info(msg)
        return msg

chaos_engine = ChaosEngine()
